import { Controller, Get, Header, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { ReportsService } from './reports.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/enums/index.js';

@ApiTags('14. Recruitment Reports & Export')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.RECRUITER)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get stage conversion and recruitment analytics report' })
  getSummary() {
    return this.reportsService.getRecruitmentReport();
  }

  @Get('export/applications')
  @ApiOperation({ summary: 'Export all recruitment applications to CSV' })
  @ApiProduces('text/csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="applications-export.csv"')
  async exportApplications(@Res() res: Response) {
    const csv = await this.reportsService.exportApplicationsCsv();
    return res.send(csv);
  }

  @Get('export/jobs')
  @ApiOperation({ summary: 'Export all jobs to CSV' })
  @ApiProduces('text/csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="jobs-export.csv"')
  async exportJobs(@Res() res: Response) {
    const csv = await this.reportsService.exportJobsCsv();
    return res.send(csv);
  }
}
