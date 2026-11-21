import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/login.dto.js';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        message: string;
        user: {
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            id: string;
            status: string;
            createdAt: Date;
        };
        accessToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        accessToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            status: string;
        };
    }>;
    getProfile(userId: string): Promise<{
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
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
        resetToken?: undefined;
    } | {
        message: string;
        resetToken: `${string}-${string}-${string}-${string}-${string}`;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    private generateToken;
}
