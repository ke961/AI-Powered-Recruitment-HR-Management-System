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
import { Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Role } from '../../common/enums/index.js';
let AttendanceController = class AttendanceController {
    attendanceService;
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    checkIn(userId) {
        return this.attendanceService.checkIn(userId);
    }
    checkOut(userId) {
        return this.attendanceService.checkOut(userId);
    }
    getTodayStatus(userId) {
        return this.attendanceService.getTodayStatus(userId);
    }
    getMonthlySummary(employeeId, month, year) {
        return this.attendanceService.getMonthlySummary(employeeId, month, year);
    }
    findAll(date) {
        return this.attendanceService.findAll(date);
    }
};
__decorate([
    Post('check-in'),
    ApiOperation({ summary: 'Employee logs daily check-in (marks LATE if after 9:30 AM)' }),
    __param(0, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "checkIn", null);
__decorate([
    Post('check-out'),
    ApiOperation({ summary: 'Employee logs daily check-out' }),
    __param(0, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "checkOut", null);
__decorate([
    Get('today'),
    ApiOperation({ summary: "Get current employee's check-in status for today" }),
    __param(0, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getTodayStatus", null);
__decorate([
    Get('monthly/:employeeId'),
    ApiOperation({ summary: 'Get monthly attendance summary and stats for an employee' }),
    ApiQuery({ name: 'month', required: true, example: 11 }),
    ApiQuery({ name: 'year', required: true, example: 2026 }),
    __param(0, Param('employeeId')),
    __param(1, Query('month', ParseIntPipe)),
    __param(2, Query('year', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getMonthlySummary", null);
__decorate([
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER),
    Get(),
    ApiOperation({ summary: 'List daily attendance records for company' }),
    ApiQuery({ name: 'date', required: false, example: '2026-11-22' }),
    __param(0, Query('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "findAll", null);
AttendanceController = __decorate([
    ApiTags('13. Attendance Management'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('attendance'),
    __metadata("design:paramtypes", [AttendanceService])
], AttendanceController);
export { AttendanceController };
//# sourceMappingURL=attendance.controller.js.map