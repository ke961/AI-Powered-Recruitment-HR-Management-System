import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
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

@ApiTags('3. Job Posting & Vacancy Management')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Get all public published jobs (for career site applicants)' })
  findAllPublic(@Query() query: JobQueryDto) {
    return this.jobsService.findAll(query, true);
  }

  @Public()
  @Get('public/:slug')
  @ApiOperation({ summary: 'Get single public job details by slug' })
  findOnePublic(@Param('slug') slug: string) {
    return this.jobsService.findOne(slug);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all jobs for HR portal (includes Drafts & Closed)' })
  findAllAdmin(@Query() query: JobQueryDto) {
    return this.jobsService.findAll(query, false);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.RECRUITER)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new job posting' })
  @ApiResponse({ status: 201, description: 'Job created successfully' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateJobDto) {
    return this.jobsService.create(userId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get job details by ID' })
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.RECRUITER)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update job posting details' })
  update(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.jobsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.RECRUITER)
  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update job status (DRAFT, PUBLISHED, CLOSED)' })
  updateStatus(@Param('id') id: string, @Body('status') status: JobStatus) {
    return this.jobsService.updateStatus(id, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.RECRUITER)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a job posting' })
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }
}
