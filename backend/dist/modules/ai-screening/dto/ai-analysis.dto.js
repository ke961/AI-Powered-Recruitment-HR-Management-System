var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HumanReviewStatus } from '../../../common/enums/index.js';
export class CreateAiAnalysisDto {
    applicationId;
    overallMatchScore;
    skillsMatched;
    skillsMissing;
    experienceMatch;
    strengths;
    redFlags;
    matchExplanation;
}
__decorate([
    ApiProperty({ example: 'app-uuid-here' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateAiAnalysisDto.prototype, "applicationId", void 0);
__decorate([
    ApiProperty({ example: 88, minimum: 0, maximum: 100 }),
    IsInt(),
    Min(0),
    Max(100),
    __metadata("design:type", Number)
], CreateAiAnalysisDto.prototype, "overallMatchScore", void 0);
__decorate([
    ApiProperty({ example: ['TypeScript', 'React', 'NestJS', 'PostgreSQL'] }),
    IsArray(),
    __metadata("design:type", Array)
], CreateAiAnalysisDto.prototype, "skillsMatched", void 0);
__decorate([
    ApiProperty({ example: ['Docker', 'AWS'] }),
    IsArray(),
    __metadata("design:type", Array)
], CreateAiAnalysisDto.prototype, "skillsMissing", void 0);
__decorate([
    ApiPropertyOptional({ example: 'HIGH' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateAiAnalysisDto.prototype, "experienceMatch", void 0);
__decorate([
    ApiPropertyOptional({ example: ['Strong background in full-stack TypeScript', 'Solid architectural patterns'] }),
    IsOptional(),
    IsArray(),
    __metadata("design:type", Array)
], CreateAiAnalysisDto.prototype, "strengths", void 0);
__decorate([
    ApiPropertyOptional({ example: ['No clear CI/CD pipeline experience mentioned'] }),
    IsOptional(),
    IsArray(),
    __metadata("design:type", Array)
], CreateAiAnalysisDto.prototype, "redFlags", void 0);
__decorate([
    ApiProperty({
        example: 'Candidate matches 80% of required technical skills. Holds 4 years of hands-on NestJS and React experience directly relevant to the vacancy.',
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateAiAnalysisDto.prototype, "matchExplanation", void 0);
export class HumanOverrideDto {
    humanReviewStatus;
    humanReviewNotes;
}
__decorate([
    ApiProperty({ enum: HumanReviewStatus, example: HumanReviewStatus.APPROVED }),
    IsEnum(HumanReviewStatus),
    __metadata("design:type", String)
], HumanOverrideDto.prototype, "humanReviewStatus", void 0);
__decorate([
    ApiPropertyOptional({ example: 'Approved AI recommendation. Fast-tracked candidate to Technical Interview.' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], HumanOverrideDto.prototype, "humanReviewNotes", void 0);
//# sourceMappingURL=ai-analysis.dto.js.map