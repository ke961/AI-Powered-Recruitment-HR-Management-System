import { PrismaService } from '../../prisma/prisma.service.js';
import { ApplyJobDto, UpdateStageDto, AddRecruiterNotesDto } from './dto/apply-job.dto.js';
export declare class ApplicationsService {
    private prisma;
    constructor(prisma: PrismaService);
    apply(userId: string, dto: ApplyJobDto): Promise<{
        job: {
            department: string;
            title: string;
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
    }>;
    getMyApplications(userId: string): Promise<({
        offer: {
            id: string;
            status: string;
            baseSalary: number;
            joiningDate: Date;
            expiryDate: Date;
        } | null;
        job: {
            department: string;
            title: string;
            id: string;
            location: string;
            employmentType: string;
            slug: string;
        };
        aiAnalysis: {
            overallMatchScore: number;
            humanReviewStatus: string;
        } | null;
        interviews: {
            type: string;
            id: string;
            status: string;
            scheduledAt: Date;
            meetingLink: string | null;
        }[];
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
    })[]>;
    withdraw(userId: string, applicationId: string): Promise<{
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
    }>;
    findByJob(jobId: string, stage?: string): Promise<any[]>;
    findAll(stage?: string, jobId?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    updateStage(applicationId: string, performedById: string, dto: UpdateStageDto): Promise<any>;
    addNotes(applicationId: string, performedById: string, dto: AddRecruiterNotesDto): Promise<{
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
    }>;
    private formatApplication;
}
