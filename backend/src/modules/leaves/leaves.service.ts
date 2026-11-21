import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateLeaveRequestDto, ReviewLeaveRequestDto } from './dto/create-leave.dto.js';

@Injectable()
export class LeavesService {
  constructor(private prisma: PrismaService) {}

  async apply(userId: string, dto: CreateLeaveRequestDto) {
    const employee = await this.prisma.employee.findUnique({
      where: { userId },
      include: { leaveBalance: true },
    });

    if (!employee) {
      throw new NotFoundException('Employee record not found for this user');
    }

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    if (end < start) {
      throw new BadRequestException('End date cannot be earlier than start date');
    }

    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Initialize balance if not yet exists
    let balance = employee.leaveBalance;
    if (!balance) {
      balance = await this.prisma.leaveBalance.create({
        data: {
          employeeId: employee.id,
          year: new Date().getFullYear(),
        },
      });
    }

    // Verify balance
    if (dto.leaveType === 'ANNUAL' && balance.annualUsed + diffDays > balance.annualAllowed) {
      throw new BadRequestException(`Insufficient annual leave balance. Remaining: ${balance.annualAllowed - balance.annualUsed} days.`);
    }
    if (dto.leaveType === 'SICK' && balance.sickUsed + diffDays > balance.sickAllowed) {
      throw new BadRequestException(`Insufficient sick leave balance. Remaining: ${balance.sickAllowed - balance.sickUsed} days.`);
    }
    if (dto.leaveType === 'CASUAL' && balance.casualUsed + diffDays > balance.casualAllowed) {
      throw new BadRequestException(`Insufficient casual leave balance. Remaining: ${balance.casualAllowed - balance.casualUsed} days.`);
    }

    return this.prisma.leaveRequest.create({
      data: {
        employeeId: employee.id,
        leaveType: dto.leaveType,
        startDate: start,
        endDate: end,
        daysCount: diffDays,
        reason: dto.reason,
        status: 'PENDING',
      },
    });
  }

  async getMyLeaves(userId: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { userId },
      include: {
        leaveBalance: true,
        leaveRequests: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee record not found');
    }

    return {
      balance: employee.leaveBalance || {
        annualAllowed: 15,
        annualUsed: 0,
        sickAllowed: 10,
        sickUsed: 0,
        casualAllowed: 5,
        casualUsed: 0,
      },
      requests: employee.leaveRequests,
    };
  }

  async findAll(status?: string) {
    const where: any = {};
    if (status) where.status = status;

    return this.prisma.leaveRequest.findMany({
      where,
      include: {
        employee: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true, avatarUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async review(requestId: string, reviewerId: string, dto: ReviewLeaveRequestDto) {
    const request = await this.prisma.leaveRequest.findUnique({
      where: { id: requestId },
      include: { employee: { include: { leaveBalance: true, user: true } } },
    });

    if (!request) {
      throw new NotFoundException('Leave request not found');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException(`Request is already ${request.status}`);
    }

    const updated = await this.prisma.leaveRequest.update({
      where: { id: requestId },
      data: {
        status: dto.status,
        approvedById: reviewerId,
        rejectionReason: dto.rejectionReason,
      },
    });

    // If approved, deduct days from balance
    if (dto.status === 'APPROVED' && request.employee.leaveBalance) {
      const balanceUpdate: any = {};
      if (request.leaveType === 'ANNUAL') {
        balanceUpdate.annualUsed = request.employee.leaveBalance.annualUsed + request.daysCount;
      } else if (request.leaveType === 'SICK') {
        balanceUpdate.sickUsed = request.employee.leaveBalance.sickUsed + request.daysCount;
      } else if (request.leaveType === 'CASUAL') {
        balanceUpdate.casualUsed = request.employee.leaveBalance.casualUsed + request.daysCount;
      }

      await this.prisma.leaveBalance.update({
        where: { id: request.employee.leaveBalance.id },
        data: balanceUpdate,
      });
    }

    // In-app notification for employee
    await this.prisma.notification.create({
      data: {
        userId: request.employee.userId,
        title: `Leave Request ${dto.status}`,
        message: `Your ${request.leaveType} leave request for ${request.daysCount} day(s) was ${dto.status.toLowerCase()}.`,
        type: 'SYSTEM',
        link: '/employee/leaves',
      },
    });

    return updated;
  }
}
