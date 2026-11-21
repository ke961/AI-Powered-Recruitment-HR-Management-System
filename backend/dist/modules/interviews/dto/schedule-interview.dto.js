var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InterviewStatus, InterviewType, Recommendation, } from '../../../common/enums/index.js';
export class ScheduleInterviewDto {
    applicationId;
    interviewerId;
    type;
    scheduledAt;
    durationMinutes;
    meetingLink;
    location;
    notes;
}
__decorate([
    ApiProperty({ example: 'app-uuid-here' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], ScheduleInterviewDto.prototype, "applicationId", void 0);
__decorate([
    ApiProperty({ example: 'interviewer-user-uuid-here' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], ScheduleInterviewDto.prototype, "interviewerId", void 0);
__decorate([
    ApiProperty({ enum: InterviewType, example: InterviewType.TECHNICAL }),
    IsEnum(InterviewType),
    __metadata("design:type", String)
], ScheduleInterviewDto.prototype, "type", void 0);
__decorate([
    ApiProperty({ example: '2026-11-25T14:00:00.000Z' }),
    IsDateString(),
    __metadata("design:type", String)
], ScheduleInterviewDto.prototype, "scheduledAt", void 0);
__decorate([
    ApiPropertyOptional({ example: 45, default: 45 }),
    IsOptional(),
    IsInt(),
    __metadata("design:type", Number)
], ScheduleInterviewDto.prototype, "durationMinutes", void 0);
__decorate([
    ApiPropertyOptional({ example: 'https://meet.google.com/abc-defg-hij' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ScheduleInterviewDto.prototype, "meetingLink", void 0);
__decorate([
    ApiPropertyOptional({ example: 'Virtual Google Meet' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ScheduleInterviewDto.prototype, "location", void 0);
__decorate([
    ApiPropertyOptional({ example: 'Focus on distributed systems and system architecture' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ScheduleInterviewDto.prototype, "notes", void 0);
export class UpdateInterviewStatusDto {
    status;
    notes;
}
__decorate([
    ApiProperty({ enum: InterviewStatus, example: InterviewStatus.COMPLETED }),
    IsEnum(InterviewStatus),
    __metadata("design:type", String)
], UpdateInterviewStatusDto.prototype, "status", void 0);
__decorate([
    ApiPropertyOptional({ example: 'Candidate rescheduled due to time zone conflict' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateInterviewStatusDto.prototype, "notes", void 0);
export class SubmitScorecardDto {
    technicalRating;
    behavioralRating;
    communicationRating;
    problemSolvingRating;
    overallRecommendation;
    feedbackNotes;
}
__decorate([
    ApiProperty({ example: 5, minimum: 1, maximum: 5 }),
    IsInt(),
    Min(1),
    Max(5),
    __metadata("design:type", Number)
], SubmitScorecardDto.prototype, "technicalRating", void 0);
__decorate([
    ApiProperty({ example: 4, minimum: 1, maximum: 5 }),
    IsInt(),
    Min(1),
    Max(5),
    __metadata("design:type", Number)
], SubmitScorecardDto.prototype, "behavioralRating", void 0);
__decorate([
    ApiProperty({ example: 4, minimum: 1, maximum: 5 }),
    IsInt(),
    Min(1),
    Max(5),
    __metadata("design:type", Number)
], SubmitScorecardDto.prototype, "communicationRating", void 0);
__decorate([
    ApiProperty({ example: 5, minimum: 1, maximum: 5 }),
    IsInt(),
    Min(1),
    Max(5),
    __metadata("design:type", Number)
], SubmitScorecardDto.prototype, "problemSolvingRating", void 0);
__decorate([
    ApiProperty({ enum: Recommendation, example: Recommendation.STRONG_HIRE }),
    IsEnum(Recommendation),
    __metadata("design:type", String)
], SubmitScorecardDto.prototype, "overallRecommendation", void 0);
__decorate([
    ApiProperty({ example: 'Excellent problem solving skills. Wrote clean TypeScript architecture.' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], SubmitScorecardDto.prototype, "feedbackNotes", void 0);
//# sourceMappingURL=schedule-interview.dto.js.map