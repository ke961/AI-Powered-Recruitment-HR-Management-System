import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateOnboardingTaskDto } from './dto/create-task.dto.js';
export declare class OnboardingService {
    private prisma;
    constructor(prisma: PrismaService);
    createTask(dto: CreateOnboardingTaskDto): Promise<{
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        employeeId: string;
        category: string;
        dueDate: Date | null;
        isCompleted: boolean;
        completedAt: Date | null;
    }>;
    getEmployeeOnboarding(employeeId: string): Promise<{
        totalTasks: number;
        completedTasks: number;
        progressPercent: number;
        tasks: {
            description: string | null;
            title: string;
            id: string;
            createdAt: Date;
            employeeId: string;
            category: string;
            dueDate: Date | null;
            isCompleted: boolean;
            completedAt: Date | null;
        }[];
    }>;
    toggleComplete(taskId: string): Promise<{
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        employeeId: string;
        category: string;
        dueDate: Date | null;
        isCompleted: boolean;
        completedAt: Date | null;
    }>;
    initializeDefaultTasks(employeeId: string): Promise<{
        totalTasks: number;
        completedTasks: number;
        progressPercent: number;
        tasks: {
            description: string | null;
            title: string;
            id: string;
            createdAt: Date;
            employeeId: string;
            category: string;
            dueDate: Date | null;
            isCompleted: boolean;
            completedAt: Date | null;
        }[];
    }>;
}
