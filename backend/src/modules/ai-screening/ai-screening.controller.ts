import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiScreeningService } from './ai-screening.service.js';
import { CreateAiAnalysisDto, HumanOverrideDto } from './dto/ai-analysis.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { Role } from '../../common/enums/index.js';

@ApiTags('6. AI Resume Screening & Matching')
@Controller('ai-screening')
export class AiScreeningController {
  constructor(private readonly aiScreeningService: AiScreeningService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER)
  @Post('trigger/:applicationId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Trigger AI screening & scoring for an application' })
  trigger(@Param('applicationId') applicationId: string) {
    return this.aiScreeningService.triggerScreening(applicationId);
  }

  @Public()
  @Post('webhook')
  @ApiOperation({ summary: 'Webhook endpoint for Python/FastAPI microservice to save analysis' })
  saveWebhookAnalysis(@Body() dto: CreateAiAnalysisDto) {
    return this.aiScreeningService.saveAnalysis(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER)
  @Get(':applicationId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get AI match analysis and explanation for an application' })
  getByApplication(@Param('applicationId') applicationId: string) {
    return this.aiScreeningService.getByApplication(applicationId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER)
  @Patch(':applicationId/override')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Human recruiter review & manual override of AI recommendation' })
  override(
    @Param('applicationId') applicationId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: HumanOverrideDto,
  ) {
    return this.aiScreeningService.overrideAnalysis(applicationId, userId, dto);
  }
}
