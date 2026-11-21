import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  private getTodayDateOnly(): Date {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  }

  async checkIn(userId: string) {
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

  async checkOut(userId: string) {
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

  async getTodayStatus(userId: string) {
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

  async getMonthlySummary(employeeId: string, month: number, year: number) {
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

  async findAll(dateString?: string) {
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
}
