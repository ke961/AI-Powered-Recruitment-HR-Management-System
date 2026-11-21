import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateDepartmentDto, UpdateCompanySettingsDto } from './dto/settings.dto.js';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let company = await this.prisma.company.findFirst({
      include: { settings: true, departments: true },
    });

    if (!company) {
      company = await this.prisma.company.create({
        data: {
          name: 'HireFlow Tech',
          domain: 'hireflow.ai',
          settings: {
            create: {
              timezone: 'UTC',
              dateFormat: 'YYYY-MM-DD',
              enableAiScreening: true,
              autoShortlistScore: 85,
            },
          },
        },
        include: { settings: true, departments: true },
      });
    }

    return company;
  }

  async updateSettings(dto: UpdateCompanySettingsDto) {
    const company = await this.getSettings();

    return this.prisma.companySetting.upsert({
      where: { companyId: company.id },
      create: {
        companyId: company.id,
        ...dto,
      },
      update: {
        ...dto,
      },
    });
  }

  async getDepartments() {
    return this.prisma.department.findMany({
      include: {
        _count: { select: { jobPostings: true } },
      },
    });
  }

  async createDepartment(dto: CreateDepartmentDto) {
    const company = await this.getSettings();
    return this.prisma.department.create({
      data: {
        companyId: company.id,
        name: dto.name,
        description: dto.description,
      },
    });
  }
}
