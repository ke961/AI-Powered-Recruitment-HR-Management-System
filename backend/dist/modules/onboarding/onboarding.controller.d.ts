import { OnboardingService } from './onboarding.service.js';
import { CreateOnboardingTaskDto } from './dto/create-task.dto.js';
export declare class OnboardingController {
    private readonly onboardingService;
    constructor(onboardingService: OnboardingService);
    getEmployeeTasks(employeeId: string): Promise<{
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
    toggleTask(taskId: string): Promise<{
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
    initializeDefaults(employeeId: string): Promise<{
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
