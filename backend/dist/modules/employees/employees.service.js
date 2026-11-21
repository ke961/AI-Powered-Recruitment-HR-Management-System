var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
let EmployeesService = class EmployeesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(department, status) {
        const where = {};
        if (department)
            where.department = department;
        if (status)
            where.employmentStatus = status;
        return this.prisma.employee.findMany({
            where,
            include: {
                user: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
                manager: {
                    include: {
                        user: { select: { firstName: true, lastName: true } },
                    },
                },
            },
            orderBy: { dateOfJoining: 'desc' },
        });
    }
    async findOne(id) {
        const employee = await this.prisma.employee.findUnique({
            where: { id },
            include: {
                user: true,
                manager: {
                    include: { user: { select: { firstName: true, lastName: true, email: true } } },
                },
                subordinates: {
                    include: { user: { select: { firstName: true, lastName: true, email: true } } },
                },
                onboardingTasks: true,
                leaveBalance: true,
                attendanceRecords: { take: 10, orderBy: { date: 'desc' } },
            },
        });
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${id} not found`);
        }
        return employee;
    }
    async findByUserId(userId) {
        const employee = await this.prisma.employee.findUnique({
            where: { userId },
            include: {
                user: true,
                manager: {
                    include: { user: { select: { firstName: true, lastName: true } } },
                },
                onboardingTasks: true,
                leaveBalance: true,
            },
        });
        if (!employee) {
            throw new NotFoundException('Employee record not found for this user');
        }
        return employee;
    }
    async update(id, dto) {
        await this.findOne(id);
        const data = { ...dto };
        if (dto.dateOfJoining) {
            data.dateOfJoining = new Date(dto.dateOfJoining);
        }
        return this.prisma.employee.update({
            where: { id },
            data,
            include: {
                user: { select: { firstName: true, lastName: true, email: true } },
            },
        });
    }
};
EmployeesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], EmployeesService);
export { EmployeesService };
//# sourceMappingURL=employees.service.js.map