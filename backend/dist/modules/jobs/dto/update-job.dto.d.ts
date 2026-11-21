import { CreateJobDto } from './create-job.dto.js';
import { EmploymentType, ExperienceLevel, JobStatus } from '../../../common/enums/index.js';
declare const UpdateJobDto_base: import("@nestjs/common").Type<Partial<CreateJobDto>>;
export declare class UpdateJobDto extends UpdateJobDto_base {
}
export declare class JobQueryDto {
    search?: string;
    department?: string;
    employmentType?: EmploymentType;
    experienceLevel?: ExperienceLevel;
    status?: JobStatus;
    page?: number;
    limit?: number;
}
export {};
