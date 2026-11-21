var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service.js';
import { CreateDepartmentDto, UpdateCompanySettingsDto } from './dto/settings.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/enums/index.js';
let SettingsController = class SettingsController {
    settingsService;
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    getSettings() {
        return this.settingsService.getSettings();
    }
    updateSettings(dto) {
        return this.settingsService.updateSettings(dto);
    }
    getDepartments() {
        return this.settingsService.getDepartments();
    }
    createDepartment(dto) {
        return this.settingsService.createDepartment(dto);
    }
};
__decorate([
    Roles(Role.ADMIN, Role.RECRUITER),
    Get('company'),
    ApiOperation({ summary: 'Get company profile, departments, and configuration' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getSettings", null);
__decorate([
    Roles(Role.ADMIN),
    Patch('company'),
    ApiOperation({ summary: 'Update company recruitment & AI screening configuration' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateCompanySettingsDto]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "updateSettings", null);
__decorate([
    Get('departments'),
    ApiOperation({ summary: 'Get list of active departments' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getDepartments", null);
__decorate([
    Roles(Role.ADMIN),
    Post('departments'),
    ApiOperation({ summary: 'Create a new organizational department' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateDepartmentDto]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "createDepartment", null);
SettingsController = __decorate([
    ApiTags('16. Company & Department Settings'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('settings'),
    __metadata("design:paramtypes", [SettingsService])
], SettingsController);
export { SettingsController };
//# sourceMappingURL=settings.controller.js.map