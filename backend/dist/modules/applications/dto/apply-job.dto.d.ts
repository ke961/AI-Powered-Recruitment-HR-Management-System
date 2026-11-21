import { ApplicationStage } from '../../../common/enums/index.js';
export declare class ApplyJobDto {
    jobId: string;
    resumeUrl: string;
    coverLetter?: string;
}
export declare class UpdateStageDto {
    stage: ApplicationStage;
    notes?: string;
    rejectionReason?: string;
}
export declare class AddRecruiterNotesDto {
    notes: string;
}
