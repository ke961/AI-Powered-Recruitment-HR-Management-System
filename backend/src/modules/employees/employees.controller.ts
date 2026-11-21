import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EmployeesService } from './employees.service.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Role } from '../../common/enums/index.js';

@ApiTags('11. Employee Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER)
  @Get()
  @ApiOperation({ summary: 'Employee directory with department & status filter' })
  @ApiQuery({ name: 'department', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(@Query('department') department?: string, @Query('status') status?: string) {
    return this.employeesService.findAll(department, status);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current employee record' })
  getMyRecord(@CurrentUser('id') userId: string) {
    return this.employeesService.findByUserId(userId);
  }

  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER)
  @Get(':id')
  @ApiOperation({ summary: 'Get employee details by ID' })
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.RECRUITER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update employee designation, department, status, or manager' })
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.employeesService.update(id, dto);
  }
}
