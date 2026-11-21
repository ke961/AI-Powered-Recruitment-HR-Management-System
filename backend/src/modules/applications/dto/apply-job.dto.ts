import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStage } from '../../../common/enums/index.js';

export class ApplyJobDto {
  @ApiProperty({ example: 'job-uuid-here' })
  @IsString()
  @IsNotEmpty()
  jobId: string;

  @ApiProperty({ example: 'https://storage.hireflow.ai/resumes/john-doe.pdf' })
  @IsString()
  @IsNotEmpty()
  resumeUrl: string;

  @ApiPropertyOptional({ example: 'I am excited to apply for this role because...' })
  @IsOptional()
  @IsString()
  coverLetter?: string;
}

export class UpdateStageDto {
  @ApiProperty({ enum: ApplicationStage, example: ApplicationStage.SHORTLISTED })
  @IsEnum(ApplicationStage)
  stage: ApplicationStage;

  @ApiPropertyOptional({ example: 'Candidate demonstrated strong technical communication' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'Lacks required cloud infrastructure experience' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

export class AddRecruiterNotesDto {
  @ApiProperty({ example: 'Discussed salary expectations ($130k). Ready for technical round.' })
  @IsString()
  @IsNotEmpty()
  notes: string;
}
