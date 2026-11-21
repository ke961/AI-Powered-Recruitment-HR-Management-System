import { ComplianceService } from './compliance.service.js';
export declare class ComplianceController {
    private readonly complianceService;
    constructor(complianceService: ComplianceService);
    getLogs(entityType?: string): Promise<({
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
    })[]>;
    requestExport(userId: string): Promise<{
        type: string;
        id: string;
        status: string;
        userId: string;
        details: string | null;
        completedAt: Date | null;
        downloadUrl: string | null;
        requestedAt: Date;
    }>;
    requestDeletion(userId: string, reason?: string): Promise<{
        type: string;
        id: string;
        status: string;
        userId: string;
        details: string | null;
        completedAt: Date | null;
        downloadUrl: string | null;
        requestedAt: Date;
    }>;
    getRetentionPolicies(): {
        policies: {
            dataCategory: string;
            retentionPeriod: string;
            legalBasis: string;
            actionUponExpiry: string;
        }[];
        gdprCompliance: {
            rightToAccess: string;
            rightToBeForgotten: string;
            dataPortability: string;
        };
    };
}
