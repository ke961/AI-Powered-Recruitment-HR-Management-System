import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OnboardingService } from './onboarding.service.js';
import { CreateOnboardingTaskDto } from './dto/create-task.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/enums/index.js';

@ApiTags('10. Employee Onboarding')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Get onboarding checklist & progress for an employee' })
  getEmployeeTasks(@Param('employeeId') employeeId: string) {
    return this.onboardingService.getEmployeeOnboarding(employeeId);
  }

  @Roles(Role.ADMIN, Role.RECRUITER)
  @Post('task')
  @ApiOperation({ summary: 'Add a new custom onboarding task' })
  createTask(@Body() dto: CreateOnboardingTaskDto) {
    return this.onboardingService.createTask(dto);
  }

  @Patch('task/:taskId/toggle')
  @ApiOperation({ summary: 'Toggle completion status of an onboarding task' })
  toggleTask(@Param('taskId') taskId: string) {
    return this.onboardingService.toggleComplete(taskId);
  }

  @Roles(Role.ADMIN, Role.RECRUITER)
  @Post('employee/:employeeId/initialize')
  @ApiOperation({ summary: 'Initialize standard onboarding checklist for newly hired employee' })
  initializeDefaults(@Param('employeeId') employeeId: string) {
    return this.onboardingService.initializeDefaultTasks(employeeId);
  }
}
