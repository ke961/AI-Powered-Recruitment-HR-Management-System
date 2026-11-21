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
import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service.js';
import { ApplyJobDto, UpdateStageDto, AddRecruiterNotesDto } from './dto/apply-job.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Role } from '../../common/enums/index.js';
let ApplicationsController = class ApplicationsController {
    applicationsService;
    constructor(applicationsService) {
        this.applicationsService = applicationsService;
    }
    apply(userId, dto) {
        return this.applicationsService.apply(userId, dto);
    }
    getMyApplications(userId) {
        return this.applicationsService.getMyApplications(userId);
    }
    withdraw(userId, id) {
        return this.applicationsService.withdraw(userId, id);
    }
    findByJob(jobId, stage) {
        return this.applicationsService.findByJob(jobId, stage);
    }
    findAll(stage, jobId) {
        return this.applicationsService.findAll(stage, jobId);
    }
    findOne(id) {
        return this.applicationsService.findOne(id);
    }
    updateStage(id, userId, dto) {
        return this.applicationsService.updateStage(id, userId, dto);
    }
    addNotes(id, userId, dto) {
        return this.applicationsService.addNotes(id, userId, dto);
    }
};
__decorate([
    Post('apply'),
    Roles(Role.CANDIDATE, Role.ADMIN),
    ApiOperation({ summary: 'Candidate submits application for a job vacancy' }),
    __param(0, CurrentUser('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ApplyJobDto]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "apply", null);
__decorate([
    Get('my-applications'),
    Roles(Role.CANDIDATE, Role.ADMIN),
    ApiOperation({ summary: 'Get current logged-in candidate applications & tracking history' }),
    __param(0, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "getMyApplications", null);
__decorate([
    Patch(':id/withdraw'),
    Roles(Role.CANDIDATE, Role.ADMIN),
    ApiOperation({ summary: 'Candidate withdraws their application' }),
    __param(0, CurrentUser('id')),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "withdraw", null);
__decorate([
    Get('job/:jobId'),
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER),
    ApiOperation({ summary: 'Get all applications for a specific job (Kanban Pipeline)' }),
    ApiQuery({ name: 'stage', required: false }),
    __param(0, Param('jobId')),
    __param(1, Query('stage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "findByJob", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER),
    ApiOperation({ summary: 'Get all applications across all jobs' }),
    ApiQuery({ name: 'stage', required: false }),
    ApiQuery({ name: 'jobId', required: false }),
    __param(0, Query('stage')),
    __param(1, Query('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER, Role.CANDIDATE),
    ApiOperation({ summary: 'Get single application details (AI score, interviews, audit trail)' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "findOne", null);
__decorate([
    Patch(':id/stage'),
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER),
    ApiOperation({ summary: 'Update candidate stage (Kanban drag-and-drop movement)' }),
    __param(0, Param('id')),
    __param(1, CurrentUser('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, UpdateStageDto]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "updateStage", null);
__decorate([
    Post(':id/notes'),
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER),
    ApiOperation({ summary: 'Add recruiter evaluation notes to application' }),
    __param(0, Param('id')),
    __param(1, CurrentUser('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, AddRecruiterNotesDto]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "addNotes", null);
ApplicationsController = __decorate([
    ApiTags('4 & 5. Applications & Recruitment Pipeline'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('applications'),
    __metadata("design:paramtypes", [ApplicationsService])
], ApplicationsController);
export { ApplicationsController };
//# sourceMappingURL=applications.controller.js.map