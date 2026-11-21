import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HumanReviewStatus } from '../../../common/enums/index.js';

export class CreateAiAnalysisDto {
  @ApiProperty({ example: 'app-uuid-here' })
  @IsString()
  @IsNotEmpty()
  applicationId: string;

  @ApiProperty({ example: 88, minimum: 0, maximum: 100 })
  @IsInt()
  @Min(0)
  @Max(100)
  overallMatchScore: number;

  @ApiProperty({ example: ['TypeScript', 'React', 'NestJS', 'PostgreSQL'] })
  @IsArray()
  skillsMatched: string[];

  @ApiProperty({ example: ['Docker', 'AWS'] })
  @IsArray()
  skillsMissing: string[];

  @ApiPropertyOptional({ example: 'HIGH' })
  @IsOptional()
  @IsString()
  experienceMatch?: string;

  @ApiPropertyOptional({ example: ['Strong background in full-stack TypeScript', 'Solid architectural patterns'] })
  @IsOptional()
  @IsArray()
  strengths?: string[];

  @ApiPropertyOptional({ example: ['No clear CI/CD pipeline experience mentioned'] })
  @IsOptional()
  @IsArray()
  redFlags?: string[];

  @ApiProperty({
    example:
      'Candidate matches 80% of required technical skills. Holds 4 years of hands-on NestJS and React experience directly relevant to the vacancy.',
  })
  @IsString()
  @IsNotEmpty()
  matchExplanation: string;
}

export class HumanOverrideDto {
  @ApiProperty({ enum: HumanReviewStatus, example: HumanReviewStatus.APPROVED })
  @IsEnum(HumanReviewStatus)
  humanReviewStatus: HumanReviewStatus;

  @ApiPropertyOptional({ example: 'Approved AI recommendation. Fast-tracked candidate to Technical Interview.' })
  @IsOptional()
  @IsString()
  humanReviewNotes?: string;
}
