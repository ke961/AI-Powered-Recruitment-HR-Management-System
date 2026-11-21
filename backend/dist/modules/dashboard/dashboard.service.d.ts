import { PrismaService } from '../../prisma/prisma.service.js';
import { ApplicationStage } from '../../common/enums/index.js';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getMetrics(): Promise<{
        overview: {
            totalJobs: number;
            activeJobs: number;
            closedJobs: number;
            totalApplications: number;
            totalCandidates: number;
            totalInterviews: number;
            totalOffers: number;
            hiredCount: number;
            hiringSuccessRate: string;
            averageTimeToHireDays: number;
        };
        recruitmentFunnel: {
            stage: ApplicationStage;
            count: number;
        }[];
        recentActivity: ({
            user: {
                email: string;
                firstName: string;
                lastName: string;
                role: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            userId: string | null;
            action: string;
            entityType: string;
            entityId: string;
            details: string | null;
            ipAddress: string | null;
            applicationId: string | null;
        })[];
    }>;
}
