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
import { InterviewsService } from './interviews.service.js';
import {
  ScheduleInterviewDto,
  SubmitScorecardDto,
  UpdateInterviewStatusDto,
} from './dto/schedule-interview.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Role } from '../../common/enums/index.js';

@ApiTags('7. Interview Management & Scorecards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER)
  @Post('schedule')
  @ApiOperation({ summary: 'Schedule an interview and assign interviewer' })
  schedule(@Body() dto: ScheduleInterviewDto) {
    return this.interviewsService.schedule(dto);
  }

  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER, Role.CANDIDATE)
  @Get()
  @ApiOperation({ summary: 'List scheduled interviews with optional filters' })
  @ApiQuery({ name: 'interviewerId', required: false })
  @ApiQuery({ name: 'applicationId', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(
    @Query('interviewerId') interviewerId?: string,
    @Query('applicationId') applicationId?: string,
    @Query('status') status?: string,
  ) {
    return this.interviewsService.findAll({ interviewerId, applicationId, status });
  }

  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER, Role.CANDIDATE)
  @Get(':id')
  @ApiOperation({ summary: 'Get interview details by ID' })
  findOne(@Param('id') id: string) {
    return this.interviewsService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER)
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update interview status (Reschedule / Cancel / Complete)' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateInterviewStatusDto) {
    return this.interviewsService.updateStatus(id, dto);
  }

  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER)
  @Post(':id/scorecard')
  @ApiOperation({ summary: 'Submit interview evaluation scorecard and recommendation' })
  submitScorecard(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: SubmitScorecardDto,
  ) {
    return this.interviewsService.submitScorecard(id, userId, dto);
  }
}
