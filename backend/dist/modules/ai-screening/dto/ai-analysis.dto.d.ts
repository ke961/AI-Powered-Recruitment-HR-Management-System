import { HumanReviewStatus } from '../../../common/enums/index.js';
export declare class CreateAiAnalysisDto {
    applicationId: string;
    overallMatchScore: number;
    skillsMatched: string[];
    skillsMissing: string[];
    experienceMatch?: string;
    strengths?: string[];
    redFlags?: string[];
    matchExplanation: string;
}
export declare class HumanOverrideDto {
    humanReviewStatus: HumanReviewStatus;
    humanReviewNotes?: string;
}
