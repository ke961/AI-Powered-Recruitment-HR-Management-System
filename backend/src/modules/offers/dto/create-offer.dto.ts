import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OfferStatus } from '../../../common/enums/index.js';

export class CreateOfferDto {
  @ApiProperty({ example: 'app-uuid-here' })
  @IsString()
  @IsNotEmpty()
  applicationId: string;

  @ApiProperty({ example: 140000 })
  @IsNumber()
  baseSalary: number;

  @ApiPropertyOptional({ example: 15000 })
  @IsOptional()
  @IsNumber()
  bonus?: number;

  @ApiPropertyOptional({ example: '0.1% stock options vesting over 4 years' })
  @IsOptional()
  @IsString()
  equity?: string;

  @ApiProperty({ example: '2026-12-01T09:00:00.000Z' })
  @IsDateString()
  joiningDate: string;

  @ApiProperty({ example: '2026-11-30T18:00:00.000Z' })
  @IsDateString()
  expiryDate: string;

  @ApiPropertyOptional({ example: 'https://storage.hireflow.ai/offers/offer-letter-101.pdf' })
  @IsOptional()
  @IsString()
  offerLetterUrl?: string;
}

export class UpdateOfferStatusDto {
  @ApiProperty({ enum: OfferStatus, example: OfferStatus.APPROVED })
  @IsEnum(OfferStatus)
  status: OfferStatus;
}

export class CandidateOfferResponseDto {
  @ApiProperty({ enum: ['ACCEPTED', 'DECLINED'], example: 'ACCEPTED' })
  @IsString()
  decision: 'ACCEPTED' | 'DECLINED';

  @ApiPropertyOptional({ example: 'Thank you for the opportunity! Excited to join.' })
  @IsOptional()
  @IsString()
  comments?: string;
}
