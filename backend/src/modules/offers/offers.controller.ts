import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OffersService } from './offers.service.js';
import {
  CandidateOfferResponseDto,
  CreateOfferDto,
  UpdateOfferStatusDto,
} from './dto/create-offer.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Role } from '../../common/enums/index.js';

@ApiTags('9. Offer & Hiring Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Roles(Role.ADMIN, Role.RECRUITER)
  @Post()
  @ApiOperation({ summary: 'Generate a new job offer for an application' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateOfferDto) {
    return this.offersService.create(userId, dto);
  }

  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER)
  @Get()
  @ApiOperation({ summary: 'List all offers with optional status filter' })
  @ApiQuery({ name: 'status', required: false })
  findAll(@Query('status') status?: string) {
    return this.offersService.findAll(status);
  }

  @Roles(Role.ADMIN, Role.RECRUITER, Role.HIRING_MANAGER, Role.CANDIDATE)
  @Get(':id')
  @ApiOperation({ summary: 'Get offer details by ID' })
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.RECRUITER)
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update offer workflow status (APPROVE, SEND, etc.)' })
  updateStatus(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateOfferStatusDto,
  ) {
    return this.offersService.updateStatus(id, userId, dto);
  }

  @Roles(Role.CANDIDATE, Role.ADMIN)
  @Patch(':id/respond')
  @ApiOperation({ summary: 'Candidate accepts or declines job offer' })
  candidateResponse(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CandidateOfferResponseDto,
  ) {
    return this.offersService.candidateResponse(offerIdOrParam(id), userId, dto);
  }
}

function offerIdOrParam(id: string) {
  return id;
}
