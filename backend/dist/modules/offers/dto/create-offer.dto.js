var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OfferStatus } from '../../../common/enums/index.js';
export class CreateOfferDto {
    applicationId;
    baseSalary;
    bonus;
    equity;
    joiningDate;
    expiryDate;
    offerLetterUrl;
}
__decorate([
    ApiProperty({ example: 'app-uuid-here' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateOfferDto.prototype, "applicationId", void 0);
__decorate([
    ApiProperty({ example: 140000 }),
    IsNumber(),
    __metadata("design:type", Number)
], CreateOfferDto.prototype, "baseSalary", void 0);
__decorate([
    ApiPropertyOptional({ example: 15000 }),
    IsOptional(),
    IsNumber(),
    __metadata("design:type", Number)
], CreateOfferDto.prototype, "bonus", void 0);
__decorate([
    ApiPropertyOptional({ example: '0.1% stock options vesting over 4 years' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateOfferDto.prototype, "equity", void 0);
__decorate([
    ApiProperty({ example: '2026-12-01T09:00:00.000Z' }),
    IsDateString(),
    __metadata("design:type", String)
], CreateOfferDto.prototype, "joiningDate", void 0);
__decorate([
    ApiProperty({ example: '2026-11-30T18:00:00.000Z' }),
    IsDateString(),
    __metadata("design:type", String)
], CreateOfferDto.prototype, "expiryDate", void 0);
__decorate([
    ApiPropertyOptional({ example: 'https://storage.hireflow.ai/offers/offer-letter-101.pdf' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateOfferDto.prototype, "offerLetterUrl", void 0);
export class UpdateOfferStatusDto {
    status;
}
__decorate([
    ApiProperty({ enum: OfferStatus, example: OfferStatus.APPROVED }),
    IsEnum(OfferStatus),
    __metadata("design:type", String)
], UpdateOfferStatusDto.prototype, "status", void 0);
export class CandidateOfferResponseDto {
    decision;
    comments;
}
__decorate([
    ApiProperty({ enum: ['ACCEPTED', 'DECLINED'], example: 'ACCEPTED' }),
    IsString(),
    __metadata("design:type", String)
], CandidateOfferResponseDto.prototype, "decision", void 0);
__decorate([
    ApiPropertyOptional({ example: 'Thank you for the opportunity! Excited to join.' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CandidateOfferResponseDto.prototype, "comments", void 0);
//# sourceMappingURL=create-offer.dto.js.map