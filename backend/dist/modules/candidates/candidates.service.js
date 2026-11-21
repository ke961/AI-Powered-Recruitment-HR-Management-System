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
let CandidatesService = class CandidatesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
        let profile = await this.prisma.candidateProfile.findUnique({
            where: { userId },
            include: {
                user: {
                    select: { id: true, email: true, firstName: true, lastName: true, avatarUrl: true },
                },
            },
        });
        if (!profile) {
            profile = await this.prisma.candidateProfile.create({
                data: { userId },
                include: {
                    user: {
                        select: { id: true, email: true, firstName: true, lastName: true, avatarUrl: true },
                    },
                },
            });
        }
        return {
            ...profile,
            skills: profile.skills ? profile.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        };
    }
    async updateProfile(userId, dto) {
        await this.getProfile(userId);
        const data = { ...dto };
        if (dto.skills) {
            data.skills = Array.isArray(dto.skills) ? dto.skills.join(',') : dto.skills;
        }
        const updated = await this.prisma.candidateProfile.update({
            where: { userId },
            data,
            include: {
                user: {
                    select: { id: true, email: true, firstName: true, lastName: true, avatarUrl: true },
                },
            },
        });
        return {
            ...updated,
            skills: updated.skills ? updated.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        };
    }
    async findAll(skill) {
        const where = {};
        if (skill) {
            where.skills = { contains: skill };
        }
        const candidates = await this.prisma.candidateProfile.findMany({
            where,
            include: {
                user: {
                    select: { id: true, email: true, firstName: true, lastName: true, avatarUrl: true, createdAt: true },
                },
                _count: {
                    select: { applications: true },
                },
            },
        });
        return candidates.map((c) => ({
            ...c,
            skills: c.skills ? c.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
            applicationsCount: c._count.applications,
        }));
    }
};
CandidatesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], CandidatesService);
export { CandidatesService };
//# sourceMappingURL=candidates.service.js.map