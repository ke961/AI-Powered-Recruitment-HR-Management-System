import type { Response } from 'express';
import { ReportsService } from './reports.service.js';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getSummary(): Promise<{
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
    exportApplications(res: Response): Promise<Response<any, Record<string, any>>>;
    exportJobs(res: Response): Promise<Response<any, Record<string, any>>>;
}
