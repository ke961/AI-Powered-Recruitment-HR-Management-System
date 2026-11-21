import { InterviewStatus, InterviewType, Recommendation } from '../../../common/enums/index.js';
export declare class ScheduleInterviewDto {
    applicationId: string;
    interviewerId: string;
    type: InterviewType;
    scheduledAt: string;
    durationMinutes?: number;
    meetingLink?: string;
    location?: string;
    notes?: string;
}
export declare class UpdateInterviewStatusDto {
    status: InterviewStatus;
    notes?: string;
}
export declare class SubmitScorecardDto {
    technicalRating: number;
    behavioralRating: number;
    communicationRating: number;
    problemSolvingRating: number;
    overallRecommendation: Recommendation;
    feedbackNotes: string;
}
