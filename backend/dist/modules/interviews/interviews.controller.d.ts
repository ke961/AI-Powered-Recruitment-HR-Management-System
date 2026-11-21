import { InterviewsService } from './interviews.service.js';
import { ScheduleInterviewDto, SubmitScorecardDto, UpdateInterviewStatusDto } from './dto/schedule-interview.dto.js';
export declare class InterviewsController {
    private readonly interviewsService;
    constructor(interviewsService: InterviewsService);
    schedule(dto: ScheduleInterviewDto): Promise<{
        interviewer: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        type: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        location: string | null;
        notes: string | null;
        applicationId: string;
        interviewerId: string;
        scheduledAt: Date;
        durationMinutes: number;
        meetingLink: string | null;
    }>;
    findAll(interviewerId?: string, applicationId?: string, status?: string): Promise<({
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
        scorecards: {
            id: string;
            interviewerId: string;
            technicalRating: number;
            behavioralRating: number;
            communicationRating: number;
            problemSolvingRating: number;
            overallRecommendation: string;
            feedbackNotes: string;
            submittedAt: Date;
            interviewId: string;
        }[];
        interviewer: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        type: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        location: string | null;
        notes: string | null;
        applicationId: string;
        interviewerId: string;
        scheduledAt: Date;
        durationMinutes: number;
        meetingLink: string | null;
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
        scorecards: ({
            interviewer: {
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            interviewerId: string;
            technicalRating: number;
            behavioralRating: number;
            communicationRating: number;
            problemSolvingRating: number;
            overallRecommendation: string;
            feedbackNotes: string;
            submittedAt: Date;
            interviewId: string;
        })[];
        interviewer: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        type: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        location: string | null;
        notes: string | null;
        applicationId: string;
        interviewerId: string;
        scheduledAt: Date;
        durationMinutes: number;
        meetingLink: string | null;
    }>;
    updateStatus(id: string, dto: UpdateInterviewStatusDto): Promise<{
        type: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        location: string | null;
        notes: string | null;
        applicationId: string;
        interviewerId: string;
        scheduledAt: Date;
        durationMinutes: number;
        meetingLink: string | null;
    }>;
    submitScorecard(id: string, userId: string, dto: SubmitScorecardDto): Promise<{
        id: string;
        interviewerId: string;
        technicalRating: number;
        behavioralRating: number;
        communicationRating: number;
        problemSolvingRating: number;
        overallRecommendation: string;
        feedbackNotes: string;
        submittedAt: Date;
        interviewId: string;
    }>;
}
