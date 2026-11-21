import { PrismaService } from '../../prisma/prisma.service.js';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getRecruitmentReport(): Promise<{
        summary: {
            totalJobs: number;
            totalApplications: number;
            totalOffers: number;
            acceptedOffers: number;
        };
        stageConversions: {
            stage: string;
            count: number;
            conversionRate: string;
        }[];
        jobsPerformance: {
            department: string;
            title: string;
            id: string;
            status: string;
            _count: {
                applications: number;
            };
        }[];
    }>;
    exportApplicationsCsv(): Promise<string>;
    exportJobsCsv(): Promise<string>;
}
