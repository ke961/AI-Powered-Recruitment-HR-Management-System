import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service.js';
import { CreateDepartmentDto, UpdateCompanySettingsDto } from './dto/settings.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/enums/index.js';

@ApiTags('16. Company & Department Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Roles(Role.ADMIN, Role.RECRUITER)
  @Get('company')
  @ApiOperation({ summary: 'Get company profile, departments, and configuration' })
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Roles(Role.ADMIN)
  @Patch('company')
  @ApiOperation({ summary: 'Update company recruitment & AI screening configuration' })
  updateSettings(@Body() dto: UpdateCompanySettingsDto) {
    return this.settingsService.updateSettings(dto);
  }

  @Get('departments')
  @ApiOperation({ summary: 'Get list of active departments' })
  getDepartments() {
    return this.settingsService.getDepartments();
  }

  @Roles(Role.ADMIN)
  @Post('departments')
  @ApiOperation({ summary: 'Create a new organizational department' })
  createDepartment(@Body() dto: CreateDepartmentDto) {
    return this.settingsService.createDepartment(dto);
  }
}
