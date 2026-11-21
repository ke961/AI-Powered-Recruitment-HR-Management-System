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
import { Controller, Get, Header, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/enums/index.js';
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getSummary() {
        return this.reportsService.getRecruitmentReport();
    }
    async exportApplications(res) {
        const csv = await this.reportsService.exportApplicationsCsv();
        return res.send(csv);
    }
    async exportJobs(res) {
        const csv = await this.reportsService.exportJobsCsv();
        return res.send(csv);
    }
};
__decorate([
    Get('summary'),
    ApiOperation({ summary: 'Get stage conversion and recruitment analytics report' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getSummary", null);
__decorate([
    Get('export/applications'),
    ApiOperation({ summary: 'Export all recruitment applications to CSV' }),
    ApiProduces('text/csv'),
    Header('Content-Type', 'text/csv'),
    Header('Content-Disposition', 'attachment; filename="applications-export.csv"'),
    __param(0, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportApplications", null);
__decorate([
    Get('export/jobs'),
    ApiOperation({ summary: 'Export all jobs to CSV' }),
    ApiProduces('text/csv'),
    Header('Content-Type', 'text/csv'),
    Header('Content-Disposition', 'attachment; filename="jobs-export.csv"'),
    __param(0, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportJobs", null);
ReportsController = __decorate([
    ApiTags('14. Recruitment Reports & Export'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN, Role.RECRUITER),
    Controller('reports'),
    __metadata("design:paramtypes", [ReportsService])
], ReportsController);
export { ReportsController };
//# sourceMappingURL=reports.controller.js.map