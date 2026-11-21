import { PrismaService } from '../../prisma/prisma.service.js';
import { CandidateOfferResponseDto, CreateOfferDto, UpdateOfferStatusDto } from './dto/create-offer.dto.js';
export declare class OffersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createdById: string, dto: CreateOfferDto): Promise<{
        application: {
            job: {
                department: string;
                description: string;
                title: string;
                id: string;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                location: string;
                skills: string;
                requirements: string | null;
                employmentType: string;
                experienceLevel: string;
                salaryMin: number | null;
                salaryMax: number | null;
                salaryCurrency: string;
                slug: string;
                createdById: string;
                companyId: string | null;
                departmentId: string | null;
            };
            candidate: {
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
            } & {
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
            };
        } & {
            id: string;
            updatedAt: Date;
            resumeUrl: string;
            jobId: string;
            coverLetter: string | null;
            stage: string;
            rejectionReason: string | null;
            candidateId: string;
            recruiterNotes: string | null;
            appliedAt: Date;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string;
        applicationId: string;
        baseSalary: number;
        bonus: number | null;
        equity: string | null;
        joiningDate: Date;
        expiryDate: Date;
        offerLetterUrl: string | null;
        candidateResponseNotes: string | null;
    }>;
    findAll(status?: string): Promise<({
        application: {
            job: {
                department: string;
                title: string;
                id: string;
            };
            candidate: {
                user: {
                    email: string;
                    firstName: string;
                    lastName: string;
                    id: string;
                };
            } & {
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
            };
        } & {
            id: string;
            updatedAt: Date;
            resumeUrl: string;
            jobId: string;
            coverLetter: string | null;
            stage: string;
            rejectionReason: string | null;
            candidateId: string;
            recruiterNotes: string | null;
            appliedAt: Date;
        };
        createdBy: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string;
        applicationId: string;
        baseSalary: number;
        bonus: number | null;
        equity: string | null;
        joiningDate: Date;
        expiryDate: Date;
        offerLetterUrl: string | null;
        candidateResponseNotes: string | null;
    })[]>;
    findOne(id: string): Promise<{
        application: {
            job: {
                department: string;
                description: string;
                title: string;
                id: string;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                location: string;
                skills: string;
                requirements: string | null;
                employmentType: string;
                experienceLevel: string;
                salaryMin: number | null;
                salaryMax: number | null;
                salaryCurrency: string;
                slug: string;
                createdById: string;
                companyId: string | null;
                departmentId: string | null;
            };
            candidate: {
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
            } & {
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
            };
        } & {
            id: string;
            updatedAt: Date;
            resumeUrl: string;
            jobId: string;
            coverLetter: string | null;
            stage: string;
            rejectionReason: string | null;
            candidateId: string;
            recruiterNotes: string | null;
            appliedAt: Date;
        };
        createdBy: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string;
        applicationId: string;
        baseSalary: number;
        bonus: number | null;
        equity: string | null;
        joiningDate: Date;
        expiryDate: Date;
        offerLetterUrl: string | null;
        candidateResponseNotes: string | null;
    }>;
    updateStatus(id: string, performedById: string, dto: UpdateOfferStatusDto): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string;
        applicationId: string;
        baseSalary: number;
        bonus: number | null;
        equity: string | null;
        joiningDate: Date;
        expiryDate: Date;
        offerLetterUrl: string | null;
        candidateResponseNotes: string | null;
    }>;
    candidateResponse(offerId: string, candidateUserId: string, dto: CandidateOfferResponseDto): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string;
        applicationId: string;
        baseSalary: number;
        bonus: number | null;
        equity: string | null;
        joiningDate: Date;
        expiryDate: Date;
        offerLetterUrl: string | null;
        candidateResponseNotes: string | null;
    }>;
}
