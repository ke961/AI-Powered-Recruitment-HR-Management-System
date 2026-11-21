var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ComplianceService } from './compliance.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Role } from '../../common/enums/index.js';
let ComplianceController = class ComplianceController {
    complianceService;
    constructor(complianceService) {
        this.complianceService = complianceService;
    }
    getLogs(entityType) {
        return this.complianceService.getActivityLogs(entityType);
    }
    requestExport(userId) {
        return this.complianceService.requestDataExport(userId);
    }
    requestDeletion(userId, reason) {
        return this.complianceService.requestDataDeletion(userId, reason);
    }
    getRetentionPolicies() {
        return this.complianceService.getRetentionPolicies();
    }
};
__decorate([
    Roles(Role.ADMIN),
    Get('audit-logs'),
    ApiOperation({ summary: 'View immutable system audit logs & security access trails' }),
    ApiQuery({ name: 'entityType', required: false, example: 'Application' }),
    __param(0, Query('entityType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "getLogs", null);
__decorate([
    Post('export'),
    ApiOperation({ summary: 'Request complete user data export (GDPR data portability)' }),
    __param(0, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "requestExport", null);
__decorate([
    Post('request-deletion'),
    ApiOperation({ summary: 'Request account & personal data deletion (GDPR right to be forgotten)' }),
    __param(0, CurrentUser('id')),
    __param(1, Body('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "requestDeletion", null);
__decorate([
    Get('retention-policies'),
    ApiOperation({ summary: 'View statutory data retention rules and compliance disclosures' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "getRetentionPolicies", null);
ComplianceController = __decorate([
    ApiTags('15. Audit & Compliance'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('compliance'),
    __metadata("design:paramtypes", [ComplianceService])
], ComplianceController);
export { ComplianceController };
//# sourceMappingURL=compliance.controller.js.map