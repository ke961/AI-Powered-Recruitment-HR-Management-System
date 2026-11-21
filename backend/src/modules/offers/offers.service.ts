import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  CandidateOfferResponseDto,
  CreateOfferDto,
  UpdateOfferStatusDto,
} from './dto/create-offer.dto.js';
import { ApplicationStage, OfferStatus } from '../../common/enums/index.js';

@Injectable()
export class OffersService {
  constructor(private prisma: PrismaService) {}

  async create(createdById: string, dto: CreateOfferDto) {
    const application = await this.prisma.application.findUnique({
      where: { id: dto.applicationId },
      include: {
        job: true,
        candidate: { include: { user: true } },
        offer: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.offer) {
      throw new ConflictException('An offer already exists for this application');
    }

    const offer = await this.prisma.offer.create({
      data: {
        applicationId: dto.applicationId,
        baseSalary: dto.baseSalary,
        bonus: dto.bonus,
        equity: dto.equity,
        joiningDate: new Date(dto.joiningDate),
        expiryDate: new Date(dto.expiryDate),
        offerLetterUrl: dto.offerLetterUrl,
        status: OfferStatus.DRAFT,
        createdById,
      },
      include: {
        application: {
          include: { job: true, candidate: { include: { user: true } } },
        },
      },
    });

    // Move application to OFFER stage
    await this.prisma.application.update({
      where: { id: dto.applicationId },
      data: { stage: ApplicationStage.OFFER },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: createdById,
        applicationId: dto.applicationId,
        action: 'OFFER_CREATED',
        entityType: 'Offer',
        entityId: offer.id,
        details: JSON.stringify({ baseSalary: dto.baseSalary, joiningDate: dto.joiningDate }),
      },
    });

    return offer;
  }

  async findAll(status?: string) {
    const where: any = {};
    if (status) where.status = status;

    return this.prisma.offer.findMany({
      where,
      include: {
        application: {
          include: {
            job: { select: { id: true, title: true, department: true } },
            candidate: {
              include: {
                user: { select: { id: true, firstName: true, lastName: true, email: true } },
              },
            },
          },
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id },
      include: {
        application: {
          include: {
            job: true,
            candidate: {
              include: {
                user: true,
              },
            },
          },
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    if (!offer) {
      throw new NotFoundException(`Offer with ID ${id} not found`);
    }

    return offer;
  }

  async updateStatus(id: string, performedById: string, dto: UpdateOfferStatusDto) {
    const offer = await this.findOne(id);

    const updated = await this.prisma.offer.update({
      where: { id },
      data: { status: dto.status },
    });

    // If sent to candidate, dispatch in-app notification
    if (dto.status === OfferStatus.SENT) {
      await this.prisma.notification.create({
        data: {
          userId: offer.application.candidate.userId,
          title: 'Job Offer Received!',
          message: `Congratulations! You have received a formal offer for the ${offer.application.job.title} role.`,
          type: 'OFFER_STATUS',
          link: `/candidate/offers/${offer.id}`,
        },
      });
    }

    await this.prisma.auditLog.create({
      data: {
        userId: performedById,
        applicationId: offer.applicationId,
        action: 'OFFER_STATUS_UPDATED',
        entityType: 'Offer',
        entityId: id,
        details: JSON.stringify({ from: offer.status, to: dto.status }),
      },
    });

    return updated;
  }

  async candidateResponse(
    offerId: string,
    candidateUserId: string,
    dto: CandidateOfferResponseDto,
  ) {
    const offer = await this.findOne(offerId);

    if (offer.application.candidate.userId !== candidateUserId) {
      throw new BadRequestException('You are not authorized to respond to this offer');
    }

    if (offer.status !== OfferStatus.SENT) {
      throw new BadRequestException(`Cannot respond to offer in "${offer.status}" state`);
    }

    if (new Date() > new Date(offer.expiryDate)) {
      await this.prisma.offer.update({
        where: { id: offerId },
        data: { status: OfferStatus.EXPIRED },
      });
      throw new BadRequestException('This offer has expired');
    }

    const isAccepted = dto.decision === 'ACCEPTED';
    const newStatus = isAccepted ? OfferStatus.ACCEPTED : OfferStatus.DECLINED;

    const updatedOffer = await this.prisma.offer.update({
      where: { id: offerId },
      data: {
        status: newStatus,
        candidateResponseNotes: dto.comments,
      },
    });

    if (isAccepted) {
      // 1. Mark application as HIRED
      await this.prisma.application.update({
        where: { id: offer.applicationId },
        data: { stage: ApplicationStage.HIRED },
      });

      // 2. Convert candidate into Employee record
      const employeeCode = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
      await this.prisma.employee.upsert({
        where: { userId: candidateUserId },
        create: {
          userId: candidateUserId,
          employeeCode,
          department: offer.application.job.department,
          designation: offer.application.job.title,
          dateOfJoining: offer.joiningDate,
          employmentStatus: 'PROBATION',
        },
        update: {
          department: offer.application.job.department,
          designation: offer.application.job.title,
          dateOfJoining: offer.joiningDate,
          employmentStatus: 'ACTIVE',
        },
      });

      // 3. Notify recruiter
      await this.prisma.notification.create({
        data: {
          userId: offer.createdById,
          title: 'Offer Accepted! Candidate Hired 🎉',
          message: `${offer.application.candidate.user.firstName} ${offer.application.candidate.user.lastName} accepted the offer for ${offer.application.job.title}.`,
          type: 'OFFER_STATUS',
          link: `/offers/${offer.id}`,
        },
      });
    } else {
      // Mark application as REJECTED / WITHDRAWN
      await this.prisma.application.update({
        where: { id: offer.applicationId },
        data: {
          stage: ApplicationStage.REJECTED,
          rejectionReason: `Candidate declined offer: ${dto.comments || 'No comments provided'}`,
        },
      });
    }

    await this.prisma.auditLog.create({
      data: {
        userId: candidateUserId,
        applicationId: offer.applicationId,
        action: isAccepted ? 'OFFER_ACCEPTED' : 'OFFER_DECLINED',
        entityType: 'Offer',
        entityId: offerId,
        details: JSON.stringify({ decision: dto.decision, comments: dto.comments }),
      },
    });

    return updatedOffer;
  }
}
