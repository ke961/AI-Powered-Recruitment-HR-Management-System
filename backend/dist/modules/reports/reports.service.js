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
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRecruitmentReport() {
        const [jobs, applications, offers] = await Promise.all([
            this.prisma.jobPosting.findMany({
                select: { id: true, title: true, department: true, status: true, _count: { select: { applications: true } } },
            }),
            this.prisma.application.findMany({
                select: {
                    id: true,
                    stage: true,
                    appliedAt: true,
                    updatedAt: true,
                    job: { select: { title: true, department: true } },
                    candidate: { select: { user: { select: { firstName: true, lastName: true, email: true } } } },
                    aiAnalysis: { select: { overallMatchScore: true } },
                },
            }),
            this.prisma.offer.findMany({
                select: { id: true, status: true, baseSalary: true },
            }),
        ]);
        const stageCounts = {};
        for (const app of applications) {
            stageCounts[app.stage] = (stageCounts[app.stage] || 0) + 1;
        }
        const totalApps = applications.length;
        const stageConversions = Object.entries(stageCounts).map(([stage, count]) => ({
            stage,
            count,
            conversionRate: totalApps > 0 ? `${((count / totalApps) * 100).toFixed(1)}%` : '0%',
        }));
        return {
            summary: {
                totalJobs: jobs.length,
                totalApplications: totalApps,
                totalOffers: offers.length,
                acceptedOffers: offers.filter((o) => o.status === 'ACCEPTED').length,
            },
            stageConversions,
            jobsPerformance: jobs,
        };
    }
    async exportApplicationsCsv() {
        const apps = await this.prisma.application.findMany({
            include: {
                job: { select: { title: true, department: true } },
                candidate: {
                    include: { user: { select: { firstName: true, lastName: true, email: true } } },
                },
                aiAnalysis: { select: { overallMatchScore: true } },
            },
            orderBy: { appliedAt: 'desc' },
        });
        const headers = [
            'Application ID',
            'Candidate Name',
            'Email',
            'Job Title',
            'Department',
            'Stage',
            'AI Match Score',
            'Applied Date',
        ];
        const rows = apps.map((app) => [
            app.id,
            `"${app.candidate.user.firstName} ${app.candidate.user.lastName}"`,
            app.candidate.user.email,
            `"${app.job.title}"`,
            `"${app.job.department}"`,
            app.stage,
            app.aiAnalysis ? `${app.aiAnalysis.overallMatchScore}%` : 'N/A',
            app.appliedAt.toISOString().split('T')[0],
        ]);
        return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }
    async exportJobsCsv() {
        const jobs = await this.prisma.jobPosting.findMany({
            include: {
                _count: { select: { applications: true } },
            },
        });
        const headers = [
            'Job ID',
            'Title',
            'Department',
            'Location',
            'Employment Type',
            'Status',
            'Applications Count',
            'Created Date',
        ];
        const rows = jobs.map((j) => [
            j.id,
            `"${j.title}"`,
            `"${j.department}"`,
            `"${j.location}"`,
            j.employmentType,
            j.status,
            j._count.applications,
            j.createdAt.toISOString().split('T')[0],
        ]);
        return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }
};
ReportsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ReportsService);
export { ReportsService };
//# sourceMappingURL=reports.service.js.map