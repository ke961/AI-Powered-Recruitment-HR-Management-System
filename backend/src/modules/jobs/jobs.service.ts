import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateJobDto } from './dto/create-job.dto.js';
import { JobQueryDto, UpdateJobDto } from './dto/update-job.dto.js';
import { JobStatus } from '../../common/enums/index.js';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  private slugify(text: string): string {
    const base = text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const suffix = Math.random().toString(36).substring(2, 7);
    return `${base}-${suffix}`;
  }

  async create(createdById: string, dto: CreateJobDto) {
    const slug = this.slugify(dto.title);
    const skillsString = Array.isArray(dto.skills) ? dto.skills.join(',') : dto.skills;

    return this.prisma.jobPosting.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        requirements: dto.requirements,
        department: dto.department,
        location: dto.location,
        employmentType: dto.employmentType || 'FULL_TIME',
        experienceLevel: dto.experienceLevel || 'MID',
        salaryMin: dto.salaryMin,
        salaryMax: dto.salaryMax,
        salaryCurrency: dto.salaryCurrency || 'USD',
        skills: skillsString,
        status: dto.status || 'PUBLISHED',
        createdById,
      },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  async findAll(query: JobQueryDto, publicOnly = false) {
    const { search, department, employmentType, experienceLevel, status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (publicOnly) {
      where.status = JobStatus.PUBLISHED;
    } else if (status) {
      where.status = status;
    }

    if (department) {
      where.department = department;
    }

    if (employmentType) {
      where.employmentType = employmentType;
    }

    if (experienceLevel) {
      where.experienceLevel = experienceLevel;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { skills: { contains: search } },
      ];
    }

    const [total, jobs] = await Promise.all([
      this.prisma.jobPosting.count({ where }),
      this.prisma.jobPosting.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { applications: true },
          },
          createdBy: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),
    ]);

    return {
      data: jobs.map((job) => ({
        ...job,
        skills: job.skills.split(',').map((s) => s.trim()).filter(Boolean),
        applicationsCount: job._count.applications,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(idOrSlug: string) {
    const job = await this.prisma.jobPosting.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!job) {
      throw new NotFoundException(`Job posting not found`);
    }

    return {
      ...job,
      skills: job.skills.split(',').map((s) => s.trim()).filter(Boolean),
      applicationsCount: job._count.applications,
    };
  }

  async update(id: string, dto: UpdateJobDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.skills) {
      data.skills = Array.isArray(dto.skills) ? dto.skills.join(',') : dto.skills;
    }

    return this.prisma.jobPosting.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.jobPosting.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: JobStatus) {
    await this.findOne(id);
    return this.prisma.jobPosting.update({
      where: { id },
      data: { status },
    });
  }
}
