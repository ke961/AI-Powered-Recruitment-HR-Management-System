var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export var LeaveTypeEnum;
(function (LeaveTypeEnum) {
    LeaveTypeEnum["ANNUAL"] = "ANNUAL";
    LeaveTypeEnum["SICK"] = "SICK";
    LeaveTypeEnum["CASUAL"] = "CASUAL";
    LeaveTypeEnum["UNPAID"] = "UNPAID";
})(LeaveTypeEnum || (LeaveTypeEnum = {}));
export class CreateLeaveRequestDto {
    leaveType;
    startDate;
    endDate;
    reason;
}
__decorate([
    ApiProperty({ enum: LeaveTypeEnum, example: LeaveTypeEnum.ANNUAL }),
    IsEnum(LeaveTypeEnum),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "leaveType", void 0);
__decorate([
    ApiProperty({ example: '2026-12-20T00:00:00.000Z' }),
    IsDateString(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "startDate", void 0);
__decorate([
    ApiProperty({ example: '2026-12-23T00:00:00.000Z' }),
    IsDateString(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "endDate", void 0);
__decorate([
    ApiProperty({ example: 'Family holiday travel' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "reason", void 0);
export class ReviewLeaveRequestDto {
    status;
    rejectionReason;
}
__decorate([
    ApiProperty({ enum: ['APPROVED', 'REJECTED'], example: 'APPROVED' }),
    IsString(),
    __metadata("design:type", String)
], ReviewLeaveRequestDto.prototype, "status", void 0);
__decorate([
    ApiPropertyOptional({ example: 'Approved by department manager' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ReviewLeaveRequestDto.prototype, "rejectionReason", void 0);
//# sourceMappingURL=create-leave.dto.js.map