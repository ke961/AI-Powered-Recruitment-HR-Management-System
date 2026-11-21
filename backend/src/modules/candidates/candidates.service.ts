import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UpdateCandidateProfileDto } from './dto/update-candidate.dto.js';

@Injectable()
export class CandidatesService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
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

  async updateProfile(userId: string, dto: UpdateCandidateProfileDto) {
    await this.getProfile(userId);

    const data: any = { ...dto };
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

  async findAll(skill?: string) {
    const where: any = {};
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
}
