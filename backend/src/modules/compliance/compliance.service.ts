import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class ComplianceService {
  constructor(private prisma: PrismaService) {}

  async getActivityLogs(entityType?: string, limit = 50) {
    const where: any = {};
    if (entityType) where.entityType = entityType;

    return this.prisma.auditLog.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, role: true } },
      },
    });
  }

  async requestDataExport(userId: string) {
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

  async requestDataDeletion(userId: string, reason?: string) {
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
}
