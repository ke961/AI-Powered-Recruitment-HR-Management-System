var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStage } from '../../../common/enums/index.js';
export class ApplyJobDto {
    jobId;
    resumeUrl;
    coverLetter;
}
__decorate([
    ApiProperty({ example: 'job-uuid-here' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], ApplyJobDto.prototype, "jobId", void 0);
__decorate([
    ApiProperty({ example: 'https://storage.hireflow.ai/resumes/john-doe.pdf' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], ApplyJobDto.prototype, "resumeUrl", void 0);
__decorate([
    ApiPropertyOptional({ example: 'I am excited to apply for this role because...' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ApplyJobDto.prototype, "coverLetter", void 0);
export class UpdateStageDto {
    stage;
    notes;
    rejectionReason;
}
__decorate([
    ApiProperty({ enum: ApplicationStage, example: ApplicationStage.SHORTLISTED }),
    IsEnum(ApplicationStage),
    __metadata("design:type", String)
], UpdateStageDto.prototype, "stage", void 0);
__decorate([
    ApiPropertyOptional({ example: 'Candidate demonstrated strong technical communication' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateStageDto.prototype, "notes", void 0);
__decorate([
    ApiPropertyOptional({ example: 'Lacks required cloud infrastructure experience' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateStageDto.prototype, "rejectionReason", void 0);
export class AddRecruiterNotesDto {
    notes;
}
__decorate([
    ApiProperty({ example: 'Discussed salary expectations ($130k). Ready for technical round.' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], AddRecruiterNotesDto.prototype, "notes", void 0);
//# sourceMappingURL=apply-job.dto.js.map