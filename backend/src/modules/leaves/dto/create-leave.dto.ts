import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum LeaveTypeEnum {
  ANNUAL = 'ANNUAL',
  SICK = 'SICK',
  CASUAL = 'CASUAL',
  UNPAID = 'UNPAID',
}

export class CreateLeaveRequestDto {
  @ApiProperty({ enum: LeaveTypeEnum, example: LeaveTypeEnum.ANNUAL })
  @IsEnum(LeaveTypeEnum)
  leaveType: LeaveTypeEnum;

  @ApiProperty({ example: '2026-12-20T00:00:00.000Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-12-23T00:00:00.000Z' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 'Family holiday travel' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class ReviewLeaveRequestDto {
  @ApiProperty({ enum: ['APPROVED', 'REJECTED'], example: 'APPROVED' })
  @IsString()
  status: 'APPROVED' | 'REJECTED';

  @ApiPropertyOptional({ example: 'Approved by department manager' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
