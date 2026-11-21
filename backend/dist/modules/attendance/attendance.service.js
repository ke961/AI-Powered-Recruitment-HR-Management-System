var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
let AttendanceService = class AttendanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getTodayDateOnly() {
        const now = new Date();
        return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    }
    async checkIn(userId) {
        const employee = await this.prisma.employee.findUnique({
            where: { userId },
        });
        if (!employee) {
            throw new NotFoundException('Employee profile not found');
        }
        const today = this.getTodayDateOnly();
        const existing = await this.prisma.attendanceRecord.findUnique({
            where: {
                employeeId_date: {
                    employeeId: employee.id,
                    date: today,
                },
            },
        });
        if (existing && existing.checkIn) {
            throw new BadRequestException('You have already checked in for today');
        }
        const now = new Date();
        const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30);
        const status = isLate ? 'LATE' : 'PRESENT';
        return this.prisma.attendanceRecord.upsert({
            where: {
                employeeId_date: {
                    employeeId: employee.id,
                    date: today,
                },
            },
            create: {
                employeeId: employee.id,
                date: today,
                checkIn: now,
                status,
                notes: isLate ? 'Checked in after 09:30 AM grace period' : 'On-time check-in',
            },
            update: {
                checkIn: now,
                status,
            },
        });
    }
    async checkOut(userId) {
        const employee = await this.prisma.employee.findUnique({
            where: { userId },
        });
        if (!employee) {
            throw new NotFoundException('Employee profile not found');
        }
        const today = this.getTodayDateOnly();
        const record = await this.prisma.attendanceRecord.findUnique({
            where: {
                employeeId_date: {
                    employeeId: employee.id,
                    date: today,
                },
            },
        });
        if (!record || !record.checkIn) {
            throw new BadRequestException('You have not checked in for today yet');
        }
        if (record.checkOut) {
            throw new BadRequestException('You have already checked out for today');
        }
        return this.prisma.attendanceRecord.update({
            where: { id: record.id },
            data: { checkOut: new Date() },
        });
    }
    async getTodayStatus(userId) {
        const employee = await this.prisma.employee.findUnique({
            where: { userId },
        });
        if (!employee) {
            return null;
        }
        const today = this.getTodayDateOnly();
        return this.prisma.attendanceRecord.findUnique({
            where: {
                employeeId_date: {
                    employeeId: employee.id,
                    date: today,
                },
            },
        });
    }
    async getMonthlySummary(employeeId, month, year) {
        const startDate = new Date(Date.UTC(year, month - 1, 1));
        const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59));
        const records = await this.prisma.attendanceRecord.findMany({
            where: {
                employeeId,
                date: { gte: startDate, lte: endDate },
            },
            orderBy: { date: 'asc' },
        });
        const presentCount = records.filter((r) => r.status === 'PRESENT').length;
        const lateCount = records.filter((r) => r.status === 'LATE').length;
        const halfDayCount = records.filter((r) => r.status === 'HALF_DAY').length;
        return {
            month,
            year,
            totalWorkingDaysLogged: records.length,
            presentDays: presentCount,
            lateDays: lateCount,
            halfDays: halfDayCount,
            records,
        };
    }
    async findAll(dateString) {
        const targetDate = dateString ? new Date(dateString) : this.getTodayDateOnly();
        return this.prisma.attendanceRecord.findMany({
            where: { date: targetDate },
            include: {
                employee: {
                    include: {
                        user: { select: { firstName: true, lastName: true, email: true } },
                    },
                },
            },
        });
    }
};
AttendanceService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AttendanceService);
export { AttendanceService };
//# sourceMappingURL=attendance.service.js.map