import { ApplicationsService } from './applications.service.js';
import { ApplyJobDto, UpdateStageDto, AddRecruiterNotesDto } from './dto/apply-job.dto.js';
export declare class ApplicationsController {
    private readonly applicationsService;
    constructor(applicationsService: ApplicationsService);
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
    withdraw(userId: string, id: string): Promise<{
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
    updateStage(id: string, userId: string, dto: UpdateStageDto): Promise<any>;
    addNotes(id: string, userId: string, dto: AddRecruiterNotesDto): Promise<{
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
}
