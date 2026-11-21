import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  InterviewStatus,
  InterviewType,
  Recommendation,
} from '../../../common/enums/index.js';

export class ScheduleInterviewDto {
  @ApiProperty({ example: 'app-uuid-here' })
  @IsString()
  @IsNotEmpty()
  applicationId: string;

  @ApiProperty({ example: 'interviewer-user-uuid-here' })
  @IsString()
  @IsNotEmpty()
  interviewerId: string;

  @ApiProperty({ enum: InterviewType, example: InterviewType.TECHNICAL })
  @IsEnum(InterviewType)
  type: InterviewType;

  @ApiProperty({ example: '2026-11-25T14:00:00.000Z' })
  @IsDateString()
  scheduledAt: string;

  @ApiPropertyOptional({ example: 45, default: 45 })
  @IsOptional()
  @IsInt()
  durationMinutes?: number;

  @ApiPropertyOptional({ example: 'https://meet.google.com/abc-defg-hij' })
  @IsOptional()
  @IsString()
  meetingLink?: string;

  @ApiPropertyOptional({ example: 'Virtual Google Meet' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'Focus on distributed systems and system architecture' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateInterviewStatusDto {
  @ApiProperty({ enum: InterviewStatus, example: InterviewStatus.COMPLETED })
  @IsEnum(InterviewStatus)
  status: InterviewStatus;

  @ApiPropertyOptional({ example: 'Candidate rescheduled due to time zone conflict' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class SubmitScorecardDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  technicalRating: number;

  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  behavioralRating: number;

  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  communicationRating: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  problemSolvingRating: number;

  @ApiProperty({ enum: Recommendation, example: Recommendation.STRONG_HIRE })
  @IsEnum(Recommendation)
  overallRecommendation: Recommendation;

  @ApiProperty({ example: 'Excellent problem solving skills. Wrote clean TypeScript architecture.' })
  @IsString()
  @IsNotEmpty()
  feedbackNotes: string;
}
