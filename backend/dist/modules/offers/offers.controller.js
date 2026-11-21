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
import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OffersService } from './offers.service.js';
import { CandidateOfferResponseDto, CreateOfferDto, UpdateOfferStatusDto, } from './dto/create-offer.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Role } from '../../common/enums/index.js';
let OffersController = class OffersController {
    offersService;
    constructor(offersService) {
        this.offersService = offersService;
    }
    create(userId, dto) {
        return this.offersService.create(userId, dto);
    }
    findAll(status) {
        return this.offersService.findAll(status);
    }
    findOne(id) {
        return this.offersService.findOne(id);
    }
    updateStatus(id, userId, dto) {
        return this.offersService.updateStatus(id, userId, dto);
    }
    candidateResponse(id, userId, dto) {
        return this.offersService.candidateResponse(offerIdOrParam(id), userId, dto);
    }
};
__decorate([
    Roles(Role.ADMIN, Role.RECRUITER),
    Post(),
    ApiOperation({ summary: 'Generate a new job offer for an application' }),
    __param(0, CurrentUser('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateOfferDto]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "create", null);
__decorate([
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER),
    Get(),
    ApiOperation({ summary: 'List all offers with optional status filter' }),
    ApiQuery({ name: 'status', required: false }),
    __param(0, Query('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "findAll", null);
__decorate([
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER, Role.CANDIDATE),
    Get(':id'),
    ApiOperation({ summary: 'Get offer details by ID' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "findOne", null);
__decorate([
    Roles(Role.ADMIN, Role.RECRUITER),
    Patch(':id/status'),
    ApiOperation({ summary: 'Update offer workflow status (APPROVE, SEND, etc.)' }),
    __param(0, Param('id')),
    __param(1, CurrentUser('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, UpdateOfferStatusDto]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "updateStatus", null);
__decorate([
    Roles(Role.CANDIDATE, Role.ADMIN),
    Patch(':id/respond'),
    ApiOperation({ summary: 'Candidate accepts or declines job offer' }),
    __param(0, Param('id')),
    __param(1, CurrentUser('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, CandidateOfferResponseDto]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "candidateResponse", null);
OffersController = __decorate([
    ApiTags('9. Offer & Hiring Management'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('offers'),
    __metadata("design:paramtypes", [OffersService])
], OffersController);
export { OffersController };
function offerIdOrParam(id) {
    return id;
}
//# sourceMappingURL=offers.controller.js.map