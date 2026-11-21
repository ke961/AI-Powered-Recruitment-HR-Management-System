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
import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EmployeesService } from './employees.service.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Role } from '../../common/enums/index.js';
let EmployeesController = class EmployeesController {
    employeesService;
    constructor(employeesService) {
        this.employeesService = employeesService;
    }
    findAll(department, status) {
        return this.employeesService.findAll(department, status);
    }
    getMyRecord(userId) {
        return this.employeesService.findByUserId(userId);
    }
    findOne(id) {
        return this.employeesService.findOne(id);
    }
    update(id, dto) {
        return this.employeesService.update(id, dto);
    }
};
__decorate([
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER),
    Get(),
    ApiOperation({ summary: 'Employee directory with department & status filter' }),
    ApiQuery({ name: 'department', required: false }),
    ApiQuery({ name: 'status', required: false }),
    __param(0, Query('department')),
    __param(1, Query('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "findAll", null);
__decorate([
    Get('me'),
    ApiOperation({ summary: 'Get current employee record' }),
    __param(0, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "getMyRecord", null);
__decorate([
    Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER),
    Get(':id'),
    ApiOperation({ summary: 'Get employee details by ID' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "findOne", null);
__decorate([
    Roles(Role.ADMIN, Role.RECRUITER),
    Patch(':id'),
    ApiOperation({ summary: 'Update employee designation, department, status, or manager' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateEmployeeDto]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "update", null);
EmployeesController = __decorate([
    ApiTags('11. Employee Management'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('employees'),
    __metadata("design:paramtypes", [EmployeesService])
], EmployeesController);
export { EmployeesController };
//# sourceMappingURL=employees.controller.js.map