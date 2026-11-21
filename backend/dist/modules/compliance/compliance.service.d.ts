import { PrismaService } from '../../prisma/prisma.service.js';
export declare class ComplianceService {
    private prisma;
    constructor(prisma: PrismaService);
    getActivityLogs(entityType?: string, limit?: number): Promise<({
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
    requestDataExport(userId: string): Promise<{
        type: string;
        id: string;
        status: string;
        userId: string;
        details: string | null;
        completedAt: Date | null;
        downloadUrl: string | null;
        requestedAt: Date;
    }>;
    requestDataDeletion(userId: string, reason?: string): Promise<{
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
