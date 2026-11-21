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
let ComplianceService = class ComplianceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getActivityLogs(entityType, limit = 50) {
        const where = {};
        if (entityType)
            where.entityType = entityType;
        return this.prisma.auditLog.findMany({
            where,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { firstName: true, lastName: true, email: true, role: true } },
            },
        });
    }
    async requestDataExport(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                candidateProfile: { include: { applications: true } },
                employeeRecord: true,
            },
        });
        const exportData = {
            exportTimestamp: new Date().toISOString(),
            user: {
                id: user?.id,
                email: user?.email,
                firstName: user?.firstName,
                lastName: user?.lastName,
                role: user?.role,
                createdAt: user?.createdAt,
            },
            profile: user?.candidateProfile,
            employee: user?.employeeRecord,
        };
        return this.prisma.dataExportRequest.create({
            data: {
                userId,
                type: 'FULL_DATA_EXPORT',
                status: 'COMPLETED',
                details: JSON.stringify(exportData),
                completedAt: new Date(),
            },
        });
    }
    async requestDataDeletion(userId, reason) {
        return this.prisma.dataExportRequest.create({
            data: {
                userId,
                type: 'DELETION_REQUEST',
                status: 'PENDING',
                details: JSON.stringify({ reason: reason || 'User requested GDPR account deletion' }),
            },
        });
    }
    getRetentionPolicies() {
        return {
            policies: [
                {
                    dataCategory: 'Candidate Applications & CVs',
                    retentionPeriod: '24 Months',
                    legalBasis: 'Legitimate recruitment review and candidate consent',
                    actionUponExpiry: 'Anonymize personal identifiers and delete files',
                },
                {
                    dataCategory: 'Audit & Compliance Logs',
                    retentionPeriod: '84 Months (7 Years)',
                    legalBasis: 'Statutory compliance & labor regulatory reporting',
                    actionUponExpiry: 'Archive to cold audit storage',
                },
                {
                    dataCategory: 'Employee Leave & Attendance',
                    retentionPeriod: '60 Months (5 Years)',
                    legalBasis: 'Employment tax and wage compliance',
                    actionUponExpiry: 'Aggregate into annual historical summaries',
                },
            ],
            gdprCompliance: {
                rightToAccess: 'Supported via /api/compliance/export',
                rightToBeForgotten: 'Supported via /api/compliance/request-deletion',
                dataPortability: 'JSON / CSV formats supported',
            },
        };
    }
};
ComplianceService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ComplianceService);
export { ComplianceService };
//# sourceMappingURL=compliance.service.js.map