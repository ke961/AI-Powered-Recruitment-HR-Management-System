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
import { ApplicationStage, JobStatus } from '../../common/enums/index.js';
let ApplicationsService = class ApplicationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async apply(userId, dto) {
        let candidate = await this.prisma.candidateProfile.findUnique({
            where: { userId },
        });
        if (!candidate) {
            candidate = await this.prisma.candidateProfile.create({
                data: {
                    userId,
                    resumeUrl: dto.resumeUrl,
                },
            });
        }
        const job = await this.prisma.jobPosting.findUnique({
            where: { id: dto.jobId },
        });
        if (!job) {
            throw new NotFoundException('Job posting not found');
        }
        if (job.status !== JobStatus.PUBLISHED) {
            throw new BadRequestException('This job is no longer accepting applications');
        }
        const existing = await this.prisma.application.findUnique({
            where: {
                jobId_candidateId: {
                    jobId: dto.jobId,
                    candidateId: candidate.id,
                },
            },
        });
        if (existing) {
            throw new ConflictException('You have already applied for this position');
        }
        const application = await this.prisma.application.create({
            data: {
                jobId: dto.jobId,
                candidateId: candidate.id,
                stage: ApplicationStage.APPLIED,
                resumeUrl: dto.resumeUrl,
                coverLetter: dto.coverLetter,
            },
            include: {
                job: { select: { title: true, department: true } },
            },
        });
        await this.prisma.auditLog.create({
            data: {
                userId,
                applicationId: application.id,
                action: 'APPLICATION_SUBMITTED',
                entityType: 'Application',
                entityId: application.id,
                details: JSON.stringify({ jobId: dto.jobId, jobTitle: job.title }),
            },
        });
        await this.prisma.notification.create({
            data: {
                userId,
                title: 'Application Submitted',
                message: `Your application for "${job.title}" has been successfully received.`,
                type: 'APPLICATION_UPDATE',
                link: `/candidate/applications/${application.id}`,
            },
        });
        return application;
    }
    async getMyApplications(userId) {
        const candidate = await this.prisma.candidateProfile.findUnique({
            where: { userId },
        });
        if (!candidate) {
            return [];
        }
        return this.prisma.application.findMany({
            where: { candidateId: candidate.id },
            include: {
                job: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        department: true,
                        location: true,
                        employmentType: true,
                    },
                },
                aiAnalysis: {
                    select: {
                        overallMatchScore: true,
                        humanReviewStatus: true,
                    },
                },
                interviews: {
                    select: {
                        id: true,
                        scheduledAt: true,
                        type: true,
                        status: true,
                        meetingLink: true,
                    },
                },
                offer: {
                    select: {
                        id: true,
                        status: true,
                        baseSalary: true,
                        joiningDate: true,
                        expiryDate: true,
                    },
                },
            },
            orderBy: { appliedAt: 'desc' },
        });
    }
    async withdraw(userId, applicationId) {
        const candidate = await this.prisma.candidateProfile.findUnique({
            where: { userId },
        });
        if (!candidate) {
            throw new NotFoundException('Candidate profile not found');
        }
        const application = await this.prisma.application.findFirst({
            where: { id: applicationId, candidateId: candidate.id },
            include: { job: true },
        });
        if (!application) {
            throw new NotFoundException('Application not found');
        }
        if (application.stage === ApplicationStage.WITHDRAWN) {
            return application;
        }
        const updated = await this.prisma.application.update({
            where: { id: applicationId },
            data: { stage: ApplicationStage.WITHDRAWN },
        });
        await this.prisma.auditLog.create({
            data: {
                userId,
                applicationId,
                action: 'APPLICATION_WITHDRAWN',
                entityType: 'Application',
                entityId: applicationId,
                details: JSON.stringify({ previousStage: application.stage }),
            },
        });
        return updated;
    }
    async findByJob(jobId, stage) {
        const where = { jobId };
        if (stage)
            where.stage = stage;
        const applications = await this.prisma.application.findMany({
            where,
            include: {
                candidate: {
                    include: {
                        user: {
                            select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true },
                        },
                    },
                },
                aiAnalysis: true,
                interviews: true,
                offer: true,
            },
            orderBy: { appliedAt: 'desc' },
        });
        return applications.map((app) => this.formatApplication(app));
    }
    async findAll(stage, jobId) {
        const where = {};
        if (stage)
            where.stage = stage;
        if (jobId)
            where.jobId = jobId;
        const applications = await this.prisma.application.findMany({
            where,
            include: {
                job: { select: { id: true, title: true, department: true } },
                candidate: {
                    include: {
                        user: {
                            select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true },
                        },
                    },
                },
                aiAnalysis: true,
            },
            orderBy: { appliedAt: 'desc' },
        });
        return applications.map((app) => this.formatApplication(app));
    }
    async findOne(id) {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: {
                job: true,
                candidate: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                avatarUrl: true,
                                createdAt: true,
                            },
                        },
                    },
                },
                aiAnalysis: true,
                interviews: {
                    include: {
                        scorecards: {
                            include: {
                                interviewer: {
                                    select: { firstName: true, lastName: true, email: true },
                                },
                            },
                        },
                        interviewer: {
                            select: { firstName: true, lastName: true, email: true },
                        },
                    },
                },
                offer: true,
                auditLogs: {
                    include: {
                        user: { select: { firstName: true, lastName: true, email: true } },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!application) {
            throw new NotFoundException(`Application with ID ${id} not found`);
        }
        return this.formatApplication(application);
    }
    async updateStage(applicationId, performedById, dto) {
        const application = await this.prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                job: true,
                candidate: { include: { user: true } },
            },
        });
        if (!application) {
            throw new NotFoundException('Application not found');
        }
        const previousStage = application.stage;
        const updated = await this.prisma.application.update({
            where: { id: applicationId },
            data: {
                stage: dto.stage,
                recruiterNotes: dto.notes ? `${application.recruiterNotes ? application.recruiterNotes + '\n' : ''}${dto.notes}` : application.recruiterNotes,
                rejectionReason: dto.rejectionReason || application.rejectionReason,
            },
            include: {
                aiAnalysis: true,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                userId: performedById,
                applicationId,
                action: 'APPLICATION_STAGE_CHANGED',
                entityType: 'Application',
                entityId: applicationId,
                details: JSON.stringify({
                    from: previousStage,
                    to: dto.stage,
                    notes: dto.notes,
                    rejectionReason: dto.rejectionReason,
                }),
            },
        });
        await this.prisma.notification.create({
            data: {
                userId: application.candidate.userId,
                title: 'Application Status Updated',
                message: `Your application for "${application.job.title}" has moved to: ${dto.stage}`,
                type: 'APPLICATION_UPDATE',
                link: `/candidate/applications/${application.id}`,
            },
        });
        return this.formatApplication(updated);
    }
    async addNotes(applicationId, performedById, dto) {
        const app = await this.prisma.application.findUnique({ where: { id: applicationId } });
        if (!app)
            throw new NotFoundException('Application not found');
        const timestamp = new Date().toISOString().split('T')[0];
        const newNotes = app.recruiterNotes
            ? `${app.recruiterNotes}\n[${timestamp}]: ${dto.notes}`
            : `[${timestamp}]: ${dto.notes}`;
        const updated = await this.prisma.application.update({
            where: { id: applicationId },
            data: { recruiterNotes: newNotes },
        });
        await this.prisma.auditLog.create({
            data: {
                userId: performedById,
                applicationId,
                action: 'RECRUITER_NOTES_ADDED',
                entityType: 'Application',
                entityId: applicationId,
                details: JSON.stringify({ notes: dto.notes }),
            },
        });
        return updated;
    }
    formatApplication(app) {
        if (app.aiAnalysis) {
            try {
                if (typeof app.aiAnalysis.skillsMatched === 'string') {
                    app.aiAnalysis.skillsMatched = JSON.parse(app.aiAnalysis.skillsMatched);
                }
                if (typeof app.aiAnalysis.skillsMissing === 'string') {
                    app.aiAnalysis.skillsMissing = JSON.parse(app.aiAnalysis.skillsMissing);
                }
                if (typeof app.aiAnalysis.strengths === 'string') {
                    app.aiAnalysis.strengths = JSON.parse(app.aiAnalysis.strengths);
                }
                if (typeof app.aiAnalysis.redFlags === 'string') {
                    app.aiAnalysis.redFlags = JSON.parse(app.aiAnalysis.redFlags);
                }
            }
            catch (e) {
            }
        }
        return app;
    }
};
ApplicationsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ApplicationsService);
export { ApplicationsService };
//# sourceMappingURL=applications.service.js.map