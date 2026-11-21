import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service.js';
import { ApplyJobDto, UpdateStageDto, AddRecruiterNotesDto } from './dto/apply-job.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Role } from '../../common/enums/index.js';

@ApiTags('4 & 5. Applications & Recruitment Pipeline')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post('apply')
  @Roles(Role.CANDIDATE, Role.ADMIN)
  @ApiOperation({ summary: 'Candidate submits application for a job vacancy' })
  apply(@CurrentUser('id') userId: string, @Body() dto: ApplyJobDto) {
    return this.applicationsService.apply(userId, dto);
  }

  @Get('my-applications')
  @Roles(Role.CANDIDATE, Role.ADMIN)
  @ApiOperation({ summary: 'Get current logged-in candidate applications & tracking history' })
  getMyApplications(@CurrentUser('id') userId: string) {
    return this.applicationsService.getMyApplications(userId);
  }

  @Patch(':id/withdraw')
  @Roles(Role.CANDIDATE, Role.ADMIN)
  @ApiOperation({ summary: 'Candidate withdraws their application' })
  withdraw(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.applicationsService.withdraw(userId, id);
  }

  @Get('job/:jobId')
  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER)
  @ApiOperation({ summary: 'Get all applications for a specific job (Kanban Pipeline)' })
  @ApiQuery({ name: 'stage', required: false })
  findByJob(@Param('jobId') jobId: string, @Query('stage') stage?: string) {
    return this.applicationsService.findByJob(jobId, stage);
  }

  @Get()
  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER)
  @ApiOperation({ summary: 'Get all applications across all jobs' })
  @ApiQuery({ name: 'stage', required: false })
  @ApiQuery({ name: 'jobId', required: false })
  findAll(@Query('stage') stage?: string, @Query('jobId') jobId?: string) {
    return this.applicationsService.findAll(stage, jobId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER, Role.CANDIDATE)
  @ApiOperation({ summary: 'Get single application details (AI score, interviews, audit trail)' })
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Patch(':id/stage')
  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER)
  @ApiOperation({ summary: 'Update candidate stage (Kanban drag-and-drop movement)' })
  updateStage(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateStageDto,
  ) {
    return this.applicationsService.updateStage(id, userId, dto);
  }

  @Post(':id/notes')
  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER)
  @ApiOperation({ summary: 'Add recruiter evaluation notes to application' })
  addNotes(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: AddRecruiterNotesDto,
  ) {
    return this.applicationsService.addNotes(id, userId, dto);
  }
}
