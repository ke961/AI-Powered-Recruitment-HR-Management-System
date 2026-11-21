import { DashboardService } from './dashboard.service.js';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
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
            stage: import("../../common/enums/index.js").ApplicationStage;
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
