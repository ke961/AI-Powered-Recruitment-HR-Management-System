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
let LeavesService = class LeavesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async apply(userId, dto) {
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
        let balance = employee.leaveBalance;
        if (!balance) {
            balance = await this.prisma.leaveBalance.create({
                data: {
                    employeeId: employee.id,
                    year: new Date().getFullYear(),
                },
            });
        }
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
    async getMyLeaves(userId) {
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
    async findAll(status) {
        const where = {};
        if (status)
            where.status = status;
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
    async review(requestId, reviewerId, dto) {
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
        if (dto.status === 'APPROVED' && request.employee.leaveBalance) {
            const balanceUpdate = {};
            if (request.leaveType === 'ANNUAL') {
                balanceUpdate.annualUsed = request.employee.leaveBalance.annualUsed + request.daysCount;
            }
            else if (request.leaveType === 'SICK') {
                balanceUpdate.sickUsed = request.employee.leaveBalance.sickUsed + request.daysCount;
            }
            else if (request.leaveType === 'CASUAL') {
                balanceUpdate.casualUsed = request.employee.leaveBalance.casualUsed + request.daysCount;
            }
            await this.prisma.leaveBalance.update({
                where: { id: request.employee.leaveBalance.id },
                data: balanceUpdate,
            });
        }
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
};
LeavesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], LeavesService);
export { LeavesService };
//# sourceMappingURL=leaves.service.js.map