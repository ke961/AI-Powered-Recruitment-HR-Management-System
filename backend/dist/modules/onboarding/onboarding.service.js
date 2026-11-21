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
let OnboardingService = class OnboardingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTask(dto) {
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
    async getEmployeeOnboarding(employeeId) {
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
    async toggleComplete(taskId) {
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
    async initializeDefaultTasks(employeeId) {
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
};
OnboardingService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], OnboardingService);
export { OnboardingService };
//# sourceMappingURL=onboarding.service.js.map