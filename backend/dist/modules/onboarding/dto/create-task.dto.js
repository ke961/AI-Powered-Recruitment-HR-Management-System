var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateOnboardingTaskDto {
    employeeId;
    title;
    description;
    category;
    dueDate;
}
__decorate([
    ApiProperty({ example: 'employee-uuid-here' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateOnboardingTaskDto.prototype, "employeeId", void 0);
__decorate([
    ApiProperty({ example: 'Complete IT setup & configure 2FA' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateOnboardingTaskDto.prototype, "title", void 0);
__decorate([
    ApiPropertyOptional({ example: 'Install company VPN, configure Google Workspace and password manager' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateOnboardingTaskDto.prototype, "description", void 0);
__decorate([
    ApiPropertyOptional({ example: 'IT_SETUP', enum: ['IT_SETUP', 'HR_DOCUMENTS', 'COMPLIANCE', 'TRAINING', 'GENERAL'] }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateOnboardingTaskDto.prototype, "category", void 0);
__decorate([
    ApiPropertyOptional({ example: '2026-12-05T00:00:00.000Z' }),
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], CreateOnboardingTaskDto.prototype, "dueDate", void 0);
//# sourceMappingURL=create-task.dto.js.map