import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmploymentType, ExperienceLevel, JobStatus } from '../../../common/enums/index.js';

export class CreateJobDto {
  @ApiProperty({ example: 'Senior Full-Stack Engineer' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'We are seeking an experienced Full-Stack Engineer with React & NestJS experience...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: '5+ years experience with TypeScript, PostgreSQL, and AWS' })
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiProperty({ example: 'Engineering' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({ example: 'San Francisco, CA / Remote' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiPropertyOptional({ enum: EmploymentType, default: EmploymentType.FULL_TIME })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @ApiPropertyOptional({ enum: ExperienceLevel, default: ExperienceLevel.MID })
  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @ApiPropertyOptional({ example: 120000 })
  @IsOptional()
  @IsNumber()
  salaryMin?: number;

  @ApiPropertyOptional({ example: 160000 })
  @IsOptional()
  @IsNumber()
  salaryMax?: number;

  @ApiPropertyOptional({ example: 'USD', default: 'USD' })
  @IsOptional()
  @IsString()
  salaryCurrency?: string;

  @ApiProperty({ example: ['TypeScript', 'Next.js', 'NestJS', 'PostgreSQL', 'Docker'] })
  @IsNotEmpty()
  skills: string[] | string;

  @ApiPropertyOptional({ enum: JobStatus, default: JobStatus.PUBLISHED })
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;
}
