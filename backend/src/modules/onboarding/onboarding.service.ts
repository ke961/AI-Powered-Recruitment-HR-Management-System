import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateOnboardingTaskDto } from './dto/create-task.dto.js';

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {}

  async createTask(dto: CreateOnboardingTaskDto) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: dto.employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.prisma.onboardingTask.create({
      data: {
        employeeId: dto.employeeId,
        title: dto.title,
        description: dto.description,
        category: dto.category || 'GENERAL',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      },
    });
  }

  async getEmployeeOnboarding(employeeId: string) {
    const tasks = await this.prisma.onboardingTask.findMany({
      where: { employeeId },
      orderBy: { createdAt: 'asc' },
    });

    const total = tasks.length;
    const completed = tasks.filter((t) => t.isCompleted).length;
    const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      totalTasks: total,
      completedTasks: completed,
      progressPercent,
      tasks,
    };
  }

  async toggleComplete(taskId: string) {
    const task = await this.prisma.onboardingTask.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const nextState = !task.isCompleted;

    return this.prisma.onboardingTask.update({
      where: { id: taskId },
      data: {
        isCompleted: nextState,
        completedAt: nextState ? new Date() : null,
      },
    });
  }

  async initializeDefaultTasks(employeeId: string) {
    const defaults = [
      { title: 'Sign Employment Contract & NDA', category: 'HR_DOCUMENTS', description: 'Review and sign the formal agreement.' },
      { title: 'Submit Identification & Bank Details', category: 'HR_DOCUMENTS', description: 'Provide passport/ID and payroll bank account details.' },
      { title: 'Set up Corporate Email & Slack', category: 'IT_SETUP', description: 'Configure 2FA on Google Workspace and join core team channels.' },
      { title: 'Complete Security & Data Privacy Training', category: 'COMPLIANCE', description: 'Review SOC2 and GDPR security guidelines.' },
      { title: 'Meet Team Lead & 1-on-1 Introduction', category: 'TRAINING', description: 'Schedule introductory session with your team manager.' },
    ];

    await this.prisma.onboardingTask.createMany({
      data: defaults.map((d) => ({
        employeeId,
        title: d.title,
        description: d.description,
        category: d.category,
      })),
    });

    return this.getEmployeeOnboarding(employeeId);
  }
}
