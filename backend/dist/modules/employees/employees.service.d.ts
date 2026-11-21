import { PrismaService } from '../../prisma/prisma.service.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
export declare class EmployeesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(department?: string, status?: string): Promise<({
        user: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
            avatarUrl: string | null;
        };
        manager: ({
            user: {
                firstName: string;
                lastName: string;
            };
        } & {
            department: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            employeeCode: string;
            designation: string;
            managerId: string | null;
            dateOfJoining: Date;
            employmentStatus: string;
        }) | null;
    } & {
        department: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        employeeCode: string;
        designation: string;
        managerId: string | null;
        dateOfJoining: Date;
        employmentStatus: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            id: string;
            passwordHash: string;
            status: string;
            emailVerified: boolean;
            verificationToken: string | null;
            resetPasswordToken: string | null;
            resetPasswordExpires: Date | null;
            avatarUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        leaveBalance: {
            id: string;
            year: number;
            employeeId: string;
            annualAllowed: number;
            annualUsed: number;
            sickAllowed: number;
            sickUsed: number;
            casualAllowed: number;
            casualUsed: number;
        } | null;
        manager: ({
            user: {
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            department: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            employeeCode: string;
            designation: string;
            managerId: string | null;
            dateOfJoining: Date;
            employmentStatus: string;
        }) | null;
        subordinates: ({
            user: {
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            department: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            employeeCode: string;
            designation: string;
            managerId: string | null;
            dateOfJoining: Date;
            employmentStatus: string;
        })[];
        onboardingTasks: {
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
        attendanceRecords: {
            id: string;
            status: string;
            createdAt: Date;
            notes: string | null;
            date: Date;
            employeeId: string;
            checkIn: Date | null;
            checkOut: Date | null;
        }[];
    } & {
        department: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        employeeCode: string;
        designation: string;
        managerId: string | null;
        dateOfJoining: Date;
        employmentStatus: string;
    }>;
    findByUserId(userId: string): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            id: string;
            passwordHash: string;
            status: string;
            emailVerified: boolean;
            verificationToken: string | null;
            resetPasswordToken: string | null;
            resetPasswordExpires: Date | null;
            avatarUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        leaveBalance: {
            id: string;
            year: number;
            employeeId: string;
            annualAllowed: number;
            annualUsed: number;
            sickAllowed: number;
            sickUsed: number;
            casualAllowed: number;
            casualUsed: number;
        } | null;
        manager: ({
            user: {
                firstName: string;
                lastName: string;
            };
        } & {
            department: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            employeeCode: string;
            designation: string;
            managerId: string | null;
            dateOfJoining: Date;
            employmentStatus: string;
        }) | null;
        onboardingTasks: {
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
    } & {
        department: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        employeeCode: string;
        designation: string;
        managerId: string | null;
        dateOfJoining: Date;
        employmentStatus: string;
    }>;
    update(id: string, dto: UpdateEmployeeDto): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        department: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        employeeCode: string;
        designation: string;
        managerId: string | null;
        dateOfJoining: Date;
        employmentStatus: string;
    }>;
}
