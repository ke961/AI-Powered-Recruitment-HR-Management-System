var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateCompanySettingsDto {
    timezone;
    dateFormat;
    enableAiScreening;
    autoShortlistScore;
    emailNotifications;
}
__decorate([
    ApiPropertyOptional({ example: 'America/New_York' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateCompanySettingsDto.prototype, "timezone", void 0);
__decorate([
    ApiPropertyOptional({ example: 'YYYY-MM-DD' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateCompanySettingsDto.prototype, "dateFormat", void 0);
__decorate([
    ApiPropertyOptional({ example: true }),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], UpdateCompanySettingsDto.prototype, "enableAiScreening", void 0);
__decorate([
    ApiPropertyOptional({ example: 85, minimum: 50, maximum: 100 }),
    IsOptional(),
    IsInt(),
    Min(50),
    Max(100),
    __metadata("design:type", Number)
], UpdateCompanySettingsDto.prototype, "autoShortlistScore", void 0);
__decorate([
    ApiPropertyOptional({ example: true }),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], UpdateCompanySettingsDto.prototype, "emailNotifications", void 0);
export class CreateDepartmentDto {
    name;
    description;
}
__decorate([
    ApiProperty({ example: 'Data Science' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "name", void 0);
__decorate([
    ApiPropertyOptional({ example: 'Core analytics and ML modeling' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "description", void 0);
//# sourceMappingURL=settings.dto.js.map