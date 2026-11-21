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
import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OnboardingService } from './onboarding.service.js';
import { CreateOnboardingTaskDto } from './dto/create-task.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/enums/index.js';
let OnboardingController = class OnboardingController {
    onboardingService;
    constructor(onboardingService) {
        this.onboardingService = onboardingService;
    }
    getEmployeeTasks(employeeId) {
        return this.onboardingService.getEmployeeOnboarding(employeeId);
    }
    createTask(dto) {
        return this.onboardingService.createTask(dto);
    }
    toggleTask(taskId) {
        return this.onboardingService.toggleComplete(taskId);
    }
    initializeDefaults(employeeId) {
        return this.onboardingService.initializeDefaultTasks(employeeId);
    }
};
__decorate([
    Get('employee/:employeeId'),
    ApiOperation({ summary: 'Get onboarding checklist & progress for an employee' }),
    __param(0, Param('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OnboardingController.prototype, "getEmployeeTasks", null);
__decorate([
    Roles(Role.ADMIN, Role.RECRUITER),
    Post('task'),
    ApiOperation({ summary: 'Add a new custom onboarding task' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateOnboardingTaskDto]),
    __metadata("design:returntype", void 0)
], OnboardingController.prototype, "createTask", null);
__decorate([
    Patch('task/:taskId/toggle'),
    ApiOperation({ summary: 'Toggle completion status of an onboarding task' }),
    __param(0, Param('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OnboardingController.prototype, "toggleTask", null);
__decorate([
    Roles(Role.ADMIN, Role.RECRUITER),
    Post('employee/:employeeId/initialize'),
    ApiOperation({ summary: 'Initialize standard onboarding checklist for newly hired employee' }),
    __param(0, Param('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OnboardingController.prototype, "initializeDefaults", null);
OnboardingController = __decorate([
    ApiTags('10. Employee Onboarding'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('onboarding'),
    __metadata("design:paramtypes", [OnboardingService])
], OnboardingController);
export { OnboardingController };
//# sourceMappingURL=onboarding.controller.js.map