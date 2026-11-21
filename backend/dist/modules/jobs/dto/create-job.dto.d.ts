import { EmploymentType, ExperienceLevel, JobStatus } from '../../../common/enums/index.js';
export declare class CreateJobDto {
    title: string;
    description: string;
    requirements?: string;
    department: string;
    location: string;
    employmentType?: EmploymentType;
    experienceLevel?: ExperienceLevel;
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency?: string;
    skills: string[] | string;
    status?: JobStatus;
}
