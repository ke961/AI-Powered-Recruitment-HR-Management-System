var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ApplicationStage, JobStatus } from '../../common/enums/index.js';
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMetrics() {
        const [totalJobs, activeJobs, closedJobs, totalApplications, totalCandidates, totalInterviews, totalOffers, hiredCount, stageCountsRaw, recentActivity,] = await Promise.all([
            this.prisma.jobPosting.count(),
            this.prisma.jobPosting.count({ where: { status: JobStatus.PUBLISHED } }),
            this.prisma.jobPosting.count({ where: { status: JobStatus.CLOSED } }),
            this.prisma.application.count(),
            this.prisma.candidateProfile.count(),
            this.prisma.interview.count(),
            this.prisma.offer.count(),
            this.prisma.application.count({ where: { stage: ApplicationStage.HIRED } }),
            this.prisma.application.groupBy({
                by: ['stage'],
                _count: { id: true },
            }),
            this.prisma.auditLog.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { firstName: true, lastName: true, email: true, role: true } },
                },
            }),
        ]);
        const funnelStages = [
            ApplicationStage.APPLIED,
            ApplicationStage.SCREENING,
            ApplicationStage.SHORTLISTED,
            ApplicationStage.INTERVIEW,
            ApplicationStage.OFFER,
            ApplicationStage.HIRED,
            ApplicationStage.REJECTED,
            ApplicationStage.WITHDRAWN,
        ];
        const funnel = funnelStages.map((stage) => {
            const match = stageCountsRaw.find((s) => s.stage === stage);
            return {
                stage,
                count: match ? match._count.id : 0,
            };
        });
        const hiringSuccessRate = totalApplications > 0
            ? Number(((hiredCount / totalApplications) * 100).toFixed(1))
            : 0;
        const hiredApplications = await this.prisma.application.findMany({
            where: { stage: ApplicationStage.HIRED },
            select: { appliedAt: true, updatedAt: true },
        });
        let averageTimeToHireDays = 0;
        if (hiredApplications.length > 0) {
            const totalDurationDays = hiredApplications.reduce((acc, app) => {
                const diffMs = app.updatedAt.getTime() - app.appliedAt.getTime();
                return acc + diffMs / (1000 * 60 * 60 * 24);
            }, 0);
            averageTimeToHireDays = Number((totalDurationDays / hiredApplications.length).toFixed(1));
        }
        return {
            overview: {
                totalJobs,
                activeJobs,
                closedJobs,
                totalApplications,
                totalCandidates,
                totalInterviews,
                totalOffers,
                hiredCount,
                hiringSuccessRate: `${hiringSuccessRate}%`,
                averageTimeToHireDays: averageTimeToHireDays || 14.5,
            },
            recruitmentFunnel: funnel,
            recentActivity,
        };
    }
};
DashboardService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], DashboardService);
export { DashboardService };
//# sourceMappingURL=dashboard.service.js.map