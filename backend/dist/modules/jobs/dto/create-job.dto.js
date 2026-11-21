var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmploymentType, ExperienceLevel, JobStatus } from '../../../common/enums/index.js';
export class CreateJobDto {
    title;
    description;
    requirements;
    department;
    location;
    employmentType;
    experienceLevel;
    salaryMin;
    salaryMax;
    salaryCurrency;
    skills;
    status;
}
__decorate([
    ApiProperty({ example: 'Senior Full-Stack Engineer' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "title", void 0);
__decorate([
    ApiProperty({ example: 'We are seeking an experienced Full-Stack Engineer with React & NestJS experience...' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "description", void 0);
__decorate([
    ApiPropertyOptional({ example: '5+ years experience with TypeScript, PostgreSQL, and AWS' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "requirements", void 0);
__decorate([
    ApiProperty({ example: 'Engineering' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "department", void 0);
__decorate([
    ApiProperty({ example: 'San Francisco, CA / Remote' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "location", void 0);
__decorate([
    ApiPropertyOptional({ enum: EmploymentType, default: EmploymentType.FULL_TIME }),
    IsOptional(),
    IsEnum(EmploymentType),
    __metadata("design:type", String)
], CreateJobDto.prototype, "employmentType", void 0);
__decorate([
    ApiPropertyOptional({ enum: ExperienceLevel, default: ExperienceLevel.MID }),
    IsOptional(),
    IsEnum(ExperienceLevel),
    __metadata("design:type", String)
], CreateJobDto.prototype, "experienceLevel", void 0);
__decorate([
    ApiPropertyOptional({ example: 120000 }),
    IsOptional(),
    IsNumber(),
    __metadata("design:type", Number)
], CreateJobDto.prototype, "salaryMin", void 0);
__decorate([
    ApiPropertyOptional({ example: 160000 }),
    IsOptional(),
    IsNumber(),
    __metadata("design:type", Number)
], CreateJobDto.prototype, "salaryMax", void 0);
__decorate([
    ApiPropertyOptional({ example: 'USD', default: 'USD' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "salaryCurrency", void 0);
__decorate([
    ApiProperty({ example: ['TypeScript', 'Next.js', 'NestJS', 'PostgreSQL', 'Docker'] }),
    IsNotEmpty(),
    __metadata("design:type", Object)
], CreateJobDto.prototype, "skills", void 0);
__decorate([
    ApiPropertyOptional({ enum: JobStatus, default: JobStatus.PUBLISHED }),
    IsOptional(),
    IsEnum(JobStatus),
    __metadata("design:type", String)
], CreateJobDto.prototype, "status", void 0);
//# sourceMappingURL=create-job.dto.js.map