import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

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

    // Stage conversion calculations
    const stageCounts: Record<string, number> = {};
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

  async exportApplicationsCsv(): Promise<string> {
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

  async exportJobsCsv(): Promise<string> {
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
}
