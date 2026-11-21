import { PrismaService } from '../../prisma/prisma.service.js';
import { UpdateUserRoleDto, UpdateUserStatusDto } from './dto/update-user.dto.js';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(role?: string, status?: string): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        id: string;
        status: string;
        avatarUrl: string | null;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        candidateProfile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            location: string | null;
            headline: string | null;
            bio: string | null;
            skills: string | null;
            experienceYears: number | null;
            resumeUrl: string | null;
            portfolioUrl: string | null;
            linkedinUrl: string | null;
            githubUrl: string | null;
            userId: string;
        } | null;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        id: string;
        status: string;
        avatarUrl: string | null;
        createdAt: Date;
        employeeRecord: {
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
        } | null;
    }>;
    updateStatus(id: string, dto: UpdateUserStatusDto): Promise<{
        email: string;
        id: string;
        status: string;
    }>;
    updateRole(id: string, dto: UpdateUserRoleDto): Promise<{
        email: string;
        role: string;
        id: string;
    }>;
}
