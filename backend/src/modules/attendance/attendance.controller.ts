import { Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Role } from '../../common/enums/index.js';

@ApiTags('13. Attendance Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  @ApiOperation({ summary: 'Employee logs daily check-in (marks LATE if after 9:30 AM)' })
  checkIn(@CurrentUser('id') userId: string) {
    return this.attendanceService.checkIn(userId);
  }

  @Post('check-out')
  @ApiOperation({ summary: 'Employee logs daily check-out' })
  checkOut(@CurrentUser('id') userId: string) {
    return this.attendanceService.checkOut(userId);
  }

  @Get('today')
  @ApiOperation({ summary: "Get current employee's check-in status for today" })
  getTodayStatus(@CurrentUser('id') userId: string) {
    return this.attendanceService.getTodayStatus(userId);
  }

  @Get('monthly/:employeeId')
  @ApiOperation({ summary: 'Get monthly attendance summary and stats for an employee' })
  @ApiQuery({ name: 'month', required: true, example: 11 })
  @ApiQuery({ name: 'year', required: true, example: 2026 })
  getMonthlySummary(
    @Param('employeeId') employeeId: string,
    @Query('month', ParseIntPipe) month: number,
    @Query('year', ParseIntPipe) year: number,
  ) {
    return this.attendanceService.getMonthlySummary(employeeId, month, year);
  }

  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER)
  @Get()
  @ApiOperation({ summary: 'List daily attendance records for company' })
  @ApiQuery({ name: 'date', required: false, example: '2026-11-22' })
  findAll(@Query('date') date?: string) {
    return this.attendanceService.findAll(date);
  }
}
