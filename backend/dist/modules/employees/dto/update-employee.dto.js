var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateEmployeeDto {
    department;
    designation;
    managerId;
    employmentStatus;
    dateOfJoining;
}
__decorate([
    ApiPropertyOptional({ example: 'Engineering' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "department", void 0);
__decorate([
    ApiPropertyOptional({ example: 'Senior Staff Engineer' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "designation", void 0);
__decorate([
    ApiPropertyOptional({ example: 'manager-employee-uuid-here' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "managerId", void 0);
__decorate([
    ApiPropertyOptional({ example: 'ACTIVE', enum: ['PROBATION', 'ACTIVE', 'TERMINATED', 'RESIGNED'] }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "employmentStatus", void 0);
__decorate([
    ApiPropertyOptional({ example: '2026-12-01T00:00:00.000Z' }),
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "dateOfJoining", void 0);
//# sourceMappingURL=update-employee.dto.js.map