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
import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CandidatesService } from './candidates.service.js';
import { UpdateCandidateProfileDto } from './dto/update-candidate.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Role } from '../../common/enums/index.js';
let CandidatesController = class CandidatesController {
    candidatesService;
    constructor(candidatesService) {
        this.candidatesService = candidatesService;
    }
    getMyProfile(userId) {
        return this.candidatesService.getProfile(userId);
    }
    updateMyProfile(userId, dto) {
        return this.candidatesService.updateProfile(userId, dto);
    }
    findAll(skill) {
        return this.candidatesService.findAll(skill);
    }
};
__decorate([
    Get('me'),
    Roles(Role.CANDIDATE, Role.ADMIN),
    ApiOperation({ summary: 'Get current candidate profile' }),
    __param(0, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CandidatesController.prototype, "getMyProfile", null);
__decorate([
    Put('me'),
    Roles(Role.CANDIDATE, Role.ADMIN),
    ApiOperation({ summary: 'Update candidate profile & resume URL' }),
    __param(0, CurrentUser('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateCandidateProfileDto]),
    __metadata("design:returntype", void 0)
], CandidatesController.prototype, "updateMyProfile", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER),
    ApiOperation({ summary: 'List all candidates (for recruiters)' }),
    ApiQuery({ name: 'skill', required: false }),
    __param(0, Query('skill')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CandidatesController.prototype, "findAll", null);
CandidatesController = __decorate([
    ApiTags('4. Candidate Profiles'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('candidates'),
    __metadata("design:paramtypes", [CandidatesService])
], CandidatesController);
export { CandidatesController };
//# sourceMappingURL=candidates.controller.js.map