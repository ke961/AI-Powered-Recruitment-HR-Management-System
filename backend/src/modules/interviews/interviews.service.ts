import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  ScheduleInterviewDto,
  SubmitScorecardDto,
  UpdateInterviewStatusDto,
} from './dto/schedule-interview.dto.js';
import { ApplicationStage, InterviewStatus } from '../../common/enums/index.js';

@Injectable()
export class InterviewsService {
  constructor(private prisma: PrismaService) {}

  async schedule(dto: ScheduleInterviewDto) {
    const application = await this.prisma.application.findUnique({
      where: { id: dto.applicationId },
      include: {
        job: true,
        candidate: { include: { user: true } },
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const interviewer = await this.prisma.user.findUnique({
      where: { id: dto.interviewerId },
    });

    if (!interviewer) {
      throw new NotFoundException('Interviewer user not found');
    }

    const interview = await this.prisma.interview.create({
      data: {
        applicationId: dto.applicationId,
        interviewerId: dto.interviewerId,
        type: dto.type,
        scheduledAt: new Date(dto.scheduledAt),
        durationMinutes: dto.durationMinutes || 45,
        meetingLink: dto.meetingLink,
        location: dto.location,
        notes: dto.notes,
        status: InterviewStatus.SCHEDULED,
      },
      include: {
        interviewer: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    // Automatically transition application stage to INTERVIEW if in prior stage
    if (
      application.stage === ApplicationStage.APPLIED ||
      application.stage === ApplicationStage.SCREENING ||
      application.stage === ApplicationStage.SHORTLISTED
    ) {
      await this.prisma.application.update({
        where: { id: application.id },
        data: { stage: ApplicationStage.INTERVIEW },
      });
    }

    // Notify candidate
    await this.prisma.notification.create({
      data: {
        userId: application.candidate.userId,
        title: 'Interview Scheduled',
        message: `Your ${dto.type} interview for "${application.job.title}" has been scheduled for ${new Date(dto.scheduledAt).toLocaleString()}.`,
        type: 'INTERVIEW_SCHEDULED',
        link: `/candidate/interviews/${interview.id}`,
      },
    });

    // Notify interviewer
    await this.prisma.notification.create({
      data: {
        userId: interviewer.id,
        title: 'New Interview Assigned',
        message: `You have been assigned to conduct an interview with ${application.candidate.user.firstName} ${application.candidate.user.lastName} on ${new Date(dto.scheduledAt).toLocaleString()}.`,
        type: 'INTERVIEW_SCHEDULED',
        link: `/interviews/${interview.id}`,
      },
    });

    return interview;
  }

  async findAll(query: { interviewerId?: string; applicationId?: string; status?: string }) {
    const where: any = {};
    if (query.interviewerId) where.interviewerId = query.interviewerId;
    if (query.applicationId) where.applicationId = query.applicationId;
    if (query.status) where.status = query.status;

    return this.prisma.interview.findMany({
      where,
      include: {
        interviewer: { select: { id: true, firstName: true, lastName: true, email: true } },
        application: {
          include: {
            job: { select: { id: true, title: true, department: true } },
            candidate: {
              include: {
                user: { select: { firstName: true, lastName: true, email: true } },
              },
            },
          },
        },
        scorecards: true,
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
      include: {
        interviewer: { select: { id: true, firstName: true, lastName: true, email: true } },
        application: {
          include: {
            job: true,
            candidate: {
              include: {
                user: { select: { firstName: true, lastName: true, email: true } },
              },
            },
          },
        },
        scorecards: {
          include: {
            interviewer: { select: { firstName: true, lastName: true, email: true } },
          },
        },
      },
    });

    if (!interview) {
      throw new NotFoundException(`Interview with ID ${id} not found`);
    }

    return interview;
  }

  async updateStatus(id: string, dto: UpdateInterviewStatusDto) {
    await this.findOne(id);
    return this.prisma.interview.update({
      where: { id },
      data: {
        status: dto.status,
        notes: dto.notes,
      },
    });
  }

  async submitScorecard(interviewId: string, interviewerId: string, dto: SubmitScorecardDto) {
    const interview = await this.findOne(interviewId);

    const scorecard = await this.prisma.scorecard.create({
      data: {
        interviewId,
        interviewerId,
        technicalRating: dto.technicalRating,
        behavioralRating: dto.behavioralRating,
        communicationRating: dto.communicationRating,
        problemSolvingRating: dto.problemSolvingRating,
        overallRecommendation: dto.overallRecommendation,
        feedbackNotes: dto.feedbackNotes,
      },
    });

    // Mark interview as completed
    await this.prisma.interview.update({
      where: { id: interviewId },
      data: { status: InterviewStatus.COMPLETED },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: interviewerId,
        applicationId: interview.applicationId,
        action: 'INTERVIEW_SCORECARD_SUBMITTED',
        entityType: 'Scorecard',
        entityId: scorecard.id,
        details: JSON.stringify({
          recommendation: dto.overallRecommendation,
          technicalScore: dto.technicalRating,
        }),
      },
    });

    return scorecard;
  }
}
