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
import { InterviewsService } from './interviews.service.js';
import { ScheduleInterviewDto, SubmitScorecardDto, UpdateInterviewStatusDto, } from './dto/schedule-interview.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Role } from '../../common/enums/index.js';
let InterviewsController = class InterviewsController {
    interviewsService;
    constructor(interviewsService) {
        this.interviewsService = interviewsService;
    }
    schedule(dto) {
        return this.interviewsService.schedule(dto);
    }
    findAll(interviewerId, applicationId, status) {
        return this.interviewsService.findAll({ interviewerId, applicationId, status });
    }
    findOne(id) {
        return this.interviewsService.findOne(id);
    }
    updateStatus(id, dto) {
        return this.interviewsService.updateStatus(id, dto);
    }
    submitScorecard(id, userId, dto) {
        return this.interviewsService.submitScorecard(id, userId, dto);
    }
};
__decorate([
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER),
    Post('schedule'),
    ApiOperation({ summary: 'Schedule an interview and assign interviewer' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ScheduleInterviewDto]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "schedule", null);
__decorate([
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER, Role.CANDIDATE),
    Get(),
    ApiOperation({ summary: 'List scheduled interviews with optional filters' }),
    ApiQuery({ name: 'interviewerId', required: false }),
    ApiQuery({ name: 'applicationId', required: false }),
    ApiQuery({ name: 'status', required: false }),
    __param(0, Query('interviewerId')),
    __param(1, Query('applicationId')),
    __param(2, Query('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "findAll", null);
__decorate([
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER, Role.CANDIDATE),
    Get(':id'),
    ApiOperation({ summary: 'Get interview details by ID' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "findOne", null);
__decorate([
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER),
    Patch(':id/status'),
    ApiOperation({ summary: 'Update interview status (Reschedule / Cancel / Complete)' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateInterviewStatusDto]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "updateStatus", null);
__decorate([
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER),
    Post(':id/scorecard'),
    ApiOperation({ summary: 'Submit interview evaluation scorecard and recommendation' }),
    __param(0, Param('id')),
    __param(1, CurrentUser('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, SubmitScorecardDto]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "submitScorecard", null);
InterviewsController = __decorate([
    ApiTags('7. Interview Management & Scorecards'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('interviews'),
    __metadata("design:paramtypes", [InterviewsService])
], InterviewsController);
export { InterviewsController };
//# sourceMappingURL=interviews.controller.js.map