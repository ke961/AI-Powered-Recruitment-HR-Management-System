var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
let SettingsService = class SettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async updateSettings(dto) {
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
    async createDepartment(dto) {
        const company = await this.getSettings();
        return this.prisma.department.create({
            data: {
                companyId: company.id,
                name: dto.name,
                description: dto.description,
            },
        });
    }
};
SettingsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], SettingsService);
export { SettingsService };
//# sourceMappingURL=settings.service.js.map