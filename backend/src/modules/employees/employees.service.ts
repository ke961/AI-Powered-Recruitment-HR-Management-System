import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async findAll(department?: string, status?: string) {
    const where: any = {};
    if (department) where.department = department;
    if (status) where.employmentStatus = status;

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

  async findOne(id: string) {
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

  async findByUserId(userId: string) {
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

  async update(id: string, dto: UpdateEmployeeDto) {
    await this.findOne(id);

    const data: any = { ...dto };
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
}
