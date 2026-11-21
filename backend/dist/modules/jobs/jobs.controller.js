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
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards, } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JobsService } from './jobs.service.js';
import { CreateJobDto } from './dto/create-job.dto.js';
import { JobQueryDto, UpdateJobDto } from './dto/update-job.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { JobStatus, Role } from '../../common/enums/index.js';
let JobsController = class JobsController {
    jobsService;
    constructor(jobsService) {
        this.jobsService = jobsService;
    }
    findAllPublic(query) {
        return this.jobsService.findAll(query, true);
    }
    findOnePublic(slug) {
        return this.jobsService.findOne(slug);
    }
    findAllAdmin(query) {
        return this.jobsService.findAll(query, false);
    }
    create(userId, dto) {
        return this.jobsService.create(userId, dto);
    }
    findOne(id) {
        return this.jobsService.findOne(id);
    }
    update(id, dto) {
        return this.jobsService.update(id, dto);
    }
    updateStatus(id, status) {
        return this.jobsService.updateStatus(id, status);
    }
    remove(id) {
        return this.jobsService.remove(id);
    }
};
__decorate([
    Public(),
    Get('public'),
    ApiOperation({ summary: 'Get all public published jobs (for career site applicants)' }),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [JobQueryDto]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findAllPublic", null);
__decorate([
    Public(),
    Get('public/:slug'),
    ApiOperation({ summary: 'Get single public job details by slug' }),
    __param(0, Param('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findOnePublic", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER),
    Get(),
    ApiBearerAuth(),
    ApiOperation({ summary: 'List all jobs for HR portal (includes Drafts & Closed)' }),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [JobQueryDto]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findAllAdmin", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN, Role.RECRUITER),
    Post(),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a new job posting' }),
    ApiResponse({ status: 201, description: 'Job created successfully' }),
    __param(0, CurrentUser('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateJobDto]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "create", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER),
    Get(':id'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get job details by ID' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findOne", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN, Role.RECRUITER),
    Put(':id'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update job posting details' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateJobDto]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "update", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN, Role.RECRUITER),
    Patch(':id/status'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update job status (DRAFT, PUBLISHED, CLOSED)' }),
    __param(0, Param('id')),
    __param(1, Body('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "updateStatus", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN, Role.RECRUITER),
    Delete(':id'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete a job posting' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "remove", null);
JobsController = __decorate([
    ApiTags('3. Job Posting & Vacancy Management'),
    Controller('jobs'),
    __metadata("design:paramtypes", [JobsService])
], JobsController);
export { JobsController };
//# sourceMappingURL=jobs.controller.js.map