var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ApplicationStage, InterviewStatus } from '../../common/enums/index.js';
let InterviewsService = class InterviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async schedule(dto) {
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
        if (application.stage === ApplicationStage.APPLIED ||
            application.stage === ApplicationStage.SCREENING ||
            application.stage === ApplicationStage.SHORTLISTED) {
            await this.prisma.application.update({
                where: { id: application.id },
                data: { stage: ApplicationStage.INTERVIEW },
            });
        }
        await this.prisma.notification.create({
            data: {
                userId: application.candidate.userId,
                title: 'Interview Scheduled',
                message: `Your ${dto.type} interview for "${application.job.title}" has been scheduled for ${new Date(dto.scheduledAt).toLocaleString()}.`,
                type: 'INTERVIEW_SCHEDULED',
                link: `/candidate/interviews/${interview.id}`,
            },
        });
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
    async findAll(query) {
        const where = {};
        if (query.interviewerId)
            where.interviewerId = query.interviewerId;
        if (query.applicationId)
            where.applicationId = query.applicationId;
        if (query.status)
            where.status = query.status;
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
    async findOne(id) {
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
    async updateStatus(id, dto) {
        await this.findOne(id);
        return this.prisma.interview.update({
            where: { id },
            data: {
                status: dto.status,
                notes: dto.notes,
            },
        });
    }
    async submitScorecard(interviewId, interviewerId, dto) {
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
};
InterviewsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], InterviewsService);
export { InterviewsService };
//# sourceMappingURL=interviews.service.js.map