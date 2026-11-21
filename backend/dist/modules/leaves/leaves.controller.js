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
import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LeavesService } from './leaves.service.js';
import { CreateLeaveRequestDto, ReviewLeaveRequestDto } from './dto/create-leave.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Role } from '../../common/enums/index.js';
let LeavesController = class LeavesController {
    leavesService;
    constructor(leavesService) {
        this.leavesService = leavesService;
    }
    apply(userId, dto) {
        return this.leavesService.apply(userId, dto);
    }
    getMyLeaves(userId) {
        return this.leavesService.getMyLeaves(userId);
    }
    findAll(status) {
        return this.leavesService.findAll(status);
    }
    review(id, userId, dto) {
        return this.leavesService.review(id, userId, dto);
    }
};
__decorate([
    Post('apply'),
    ApiOperation({ summary: 'Employee submits a leave request' }),
    __param(0, CurrentUser('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateLeaveRequestDto]),
    __metadata("design:returntype", void 0)
], LeavesController.prototype, "apply", null);
__decorate([
    Get('my-leaves'),
    ApiOperation({ summary: 'Get current employee leave balance and history' }),
    __param(0, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeavesController.prototype, "getMyLeaves", null);
__decorate([
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER),
    Get(),
    ApiOperation({ summary: 'List all employee leave requests (HR/Manager)' }),
    ApiQuery({ name: 'status', required: false }),
    __param(0, Query('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeavesController.prototype, "findAll", null);
__decorate([
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER),
    Patch(':id/review'),
    ApiOperation({ summary: 'Approve or reject a leave request' }),
    __param(0, Param('id')),
    __param(1, CurrentUser('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, ReviewLeaveRequestDto]),
    __metadata("design:returntype", void 0)
], LeavesController.prototype, "review", null);
LeavesController = __decorate([
    ApiTags('12. Leave Management'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('leaves'),
    __metadata("design:paramtypes", [LeavesService])
], LeavesController);
export { LeavesController };
//# sourceMappingURL=leaves.controller.js.map