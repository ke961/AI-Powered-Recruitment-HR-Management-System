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
import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiScreeningService } from './ai-screening.service.js';
import { CreateAiAnalysisDto, HumanOverrideDto } from './dto/ai-analysis.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { Role } from '../../common/enums/index.js';
let AiScreeningController = class AiScreeningController {
    aiScreeningService;
    constructor(aiScreeningService) {
        this.aiScreeningService = aiScreeningService;
    }
    trigger(applicationId) {
        return this.aiScreeningService.triggerScreening(applicationId);
    }
    saveWebhookAnalysis(dto) {
        return this.aiScreeningService.saveAnalysis(dto);
    }
    getByApplication(applicationId) {
        return this.aiScreeningService.getByApplication(applicationId);
    }
    override(applicationId, userId, dto) {
        return this.aiScreeningService.overrideAnalysis(applicationId, userId, dto);
    }
};
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER),
    Post('trigger/:applicationId'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Trigger AI screening & scoring for an application' }),
    __param(0, Param('applicationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiScreeningController.prototype, "trigger", null);
__decorate([
    Public(),
    Post('webhook'),
    ApiOperation({ summary: 'Webhook endpoint for Python/FastAPI microservice to save analysis' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAiAnalysisDto]),
    __metadata("design:returntype", void 0)
], AiScreeningController.prototype, "saveWebhookAnalysis", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER),
    Get(':applicationId'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get AI match analysis and explanation for an application' }),
    __param(0, Param('applicationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiScreeningController.prototype, "getByApplication", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER),
    Patch(':applicationId/override'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Human recruiter review & manual override of AI recommendation' }),
    __param(0, Param('applicationId')),
    __param(1, CurrentUser('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, HumanOverrideDto]),
    __metadata("design:returntype", void 0)
], AiScreeningController.prototype, "override", null);
AiScreeningController = __decorate([
    ApiTags('6. AI Resume Screening & Matching'),
    Controller('ai-screening'),
    __metadata("design:paramtypes", [AiScreeningService])
], AiScreeningController);
export { AiScreeningController };
//# sourceMappingURL=ai-screening.controller.js.map