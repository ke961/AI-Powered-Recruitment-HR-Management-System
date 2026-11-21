var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, ConflictException, Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ApplicationStage, OfferStatus } from '../../common/enums/index.js';
let OffersService = class OffersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createdById, dto) {
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
    async findAll(status) {
        const where = {};
        if (status)
            where.status = status;
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
    async findOne(id) {
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
    async updateStatus(id, performedById, dto) {
        const offer = await this.findOne(id);
        const updated = await this.prisma.offer.update({
            where: { id },
            data: { status: dto.status },
        });
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
    async candidateResponse(offerId, candidateUserId, dto) {
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
            await this.prisma.application.update({
                where: { id: offer.applicationId },
                data: { stage: ApplicationStage.HIRED },
            });
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
            await this.prisma.notification.create({
                data: {
                    userId: offer.createdById,
                    title: 'Offer Accepted! Candidate Hired 🎉',
                    message: `${offer.application.candidate.user.firstName} ${offer.application.candidate.user.lastName} accepted the offer for ${offer.application.job.title}.`,
                    type: 'OFFER_STATUS',
                    link: `/offers/${offer.id}`,
                },
            });
        }
        else {
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
};
OffersService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], OffersService);
export { OffersService };
//# sourceMappingURL=offers.service.js.map