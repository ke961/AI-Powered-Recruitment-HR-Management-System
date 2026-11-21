import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LeavesService } from './leaves.service.js';
import { CreateLeaveRequestDto, ReviewLeaveRequestDto } from './dto/create-leave.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Role } from '../../common/enums/index.js';

@ApiTags('12. Leave Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Post('apply')
  @ApiOperation({ summary: 'Employee submits a leave request' })
  apply(@CurrentUser('id') userId: string, @Body() dto: CreateLeaveRequestDto) {
    return this.leavesService.apply(userId, dto);
  }

  @Get('my-leaves')
  @ApiOperation({ summary: 'Get current employee leave balance and history' })
  getMyLeaves(@CurrentUser('id') userId: string) {
    return this.leavesService.getMyLeaves(userId);
  }

  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER)
  @Get()
  @ApiOperation({ summary: 'List all employee leave requests (HR/Manager)' })
  @ApiQuery({ name: 'status', required: false })
  findAll(@Query('status') status?: string) {
    return this.leavesService.findAll(status);
  }

  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER)
  @Patch(':id/review')
  @ApiOperation({ summary: 'Approve or reject a leave request' })
  review(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: ReviewLeaveRequestDto,
  ) {
    return this.leavesService.review(id, userId, dto);
  }
}
