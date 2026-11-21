import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ComplianceService } from './compliance.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Role } from '../../common/enums/index.js';

@ApiTags('15. Audit & Compliance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Roles(Role.ADMIN)
  @Get('audit-logs')
  @ApiOperation({ summary: 'View immutable system audit logs & security access trails' })
  @ApiQuery({ name: 'entityType', required: false, example: 'Application' })
  getLogs(@Query('entityType') entityType?: string) {
    return this.complianceService.getActivityLogs(entityType);
  }

  @Post('export')
  @ApiOperation({ summary: 'Request complete user data export (GDPR data portability)' })
  requestExport(@CurrentUser('id') userId: string) {
    return this.complianceService.requestDataExport(userId);
  }

  @Post('request-deletion')
  @ApiOperation({ summary: 'Request account & personal data deletion (GDPR right to be forgotten)' })
  requestDeletion(@CurrentUser('id') userId: string, @Body('reason') reason?: string) {
    return this.complianceService.requestDataDeletion(userId, reason);
  }

  @Get('retention-policies')
  @ApiOperation({ summary: 'View statutory data retention rules and compliance disclosures' })
  getRetentionPolicies() {
    return this.complianceService.getRetentionPolicies();
  }
}
