import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CandidatesService } from './candidates.service.js';
import { UpdateCandidateProfileDto } from './dto/update-candidate.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Role } from '../../common/enums/index.js';

@ApiTags('4. Candidate Profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Get('me')
  @Roles(Role.CANDIDATE, Role.ADMIN)
  @ApiOperation({ summary: 'Get current candidate profile' })
  getMyProfile(@CurrentUser('id') userId: string) {
    return this.candidatesService.getProfile(userId);
  }

  @Put('me')
  @Roles(Role.CANDIDATE, Role.ADMIN)
  @ApiOperation({ summary: 'Update candidate profile & resume URL' })
  updateMyProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateCandidateProfileDto) {
    return this.candidatesService.updateProfile(userId, dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER)
  @ApiOperation({ summary: 'List all candidates (for recruiters)' })
  @ApiQuery({ name: 'skill', required: false })
  findAll(@Query('skill') skill?: string) {
    return this.candidatesService.findAll(skill);
  }
}
