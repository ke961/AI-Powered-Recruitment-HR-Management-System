import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOnboardingTaskDto {
  @ApiProperty({ example: 'employee-uuid-here' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ example: 'Complete IT setup & configure 2FA' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Install company VPN, configure Google Workspace and password manager' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'IT_SETUP', enum: ['IT_SETUP', 'HR_DOCUMENTS', 'COMPLIANCE', 'TRAINING', 'GENERAL'] })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: '2026-12-05T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
