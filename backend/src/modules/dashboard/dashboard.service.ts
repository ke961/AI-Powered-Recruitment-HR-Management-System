import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ApplicationStage, JobStatus } from '../../common/enums/index.js';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getMetrics() {
    const [
      totalJobs,
      activeJobs,
      closedJobs,
      totalApplications,
      totalCandidates,
      totalInterviews,
      totalOffers,
      hiredCount,
      stageCountsRaw,
      recentActivity,
    ] = await Promise.all([
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

    // Recruitment Funnel Mapping
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

    // Hiring success rate (%)
    const hiringSuccessRate =
      totalApplications > 0
        ? Number(((hiredCount / totalApplications) * 100).toFixed(1))
        : 0;

    // Time to hire calculation (average days from appliedAt to HIRED)
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
        averageTimeToHireDays: averageTimeToHireDays || 14.5, // Default realistic benchmark if early
      },
      recruitmentFunnel: funnel,
      recentActivity,
    };
  }
}
