import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateJobDto } from './dto/create-job.dto.js';
import { JobQueryDto, UpdateJobDto } from './dto/update-job.dto.js';
import { JobStatus } from '../../common/enums/index.js';
export declare class JobsService {
    private prisma;
    constructor(prisma: PrismaService);
    private slugify;
    create(createdById: string, dto: CreateJobDto): Promise<{
        createdBy: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        department: string;
        description: string;
        title: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        skills: string;
        requirements: string | null;
        employmentType: string;
        experienceLevel: string;
        salaryMin: number | null;
        salaryMax: number | null;
        salaryCurrency: string;
        slug: string;
        createdById: string;
        companyId: string | null;
        departmentId: string | null;
    }>;
    findAll(query: JobQueryDto, publicOnly?: boolean): Promise<{
        data: {
            skills: string[];
            applicationsCount: number;
            _count: {
                applications: number;
            };
            createdBy: {
                firstName: string;
                lastName: string;
                id: string;
            };
            department: string;
            description: string;
            title: string;
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            location: string;
            requirements: string | null;
            employmentType: string;
            experienceLevel: string;
            salaryMin: number | null;
            salaryMax: number | null;
            salaryCurrency: string;
            slug: string;
            createdById: string;
            companyId: string | null;
            departmentId: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(idOrSlug: string): Promise<{
        skills: string[];
        applicationsCount: number;
        _count: {
            applications: number;
        };
        createdBy: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
        department: string;
        description: string;
        title: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        requirements: string | null;
        employmentType: string;
        experienceLevel: string;
        salaryMin: number | null;
        salaryMax: number | null;
        salaryCurrency: string;
        slug: string;
        createdById: string;
        companyId: string | null;
        departmentId: string | null;
    }>;
    update(id: string, dto: UpdateJobDto): Promise<{
        department: string;
        description: string;
        title: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        skills: string;
        requirements: string | null;
        employmentType: string;
        experienceLevel: string;
        salaryMin: number | null;
        salaryMax: number | null;
        salaryCurrency: string;
        slug: string;
        createdById: string;
        companyId: string | null;
        departmentId: string | null;
    }>;
    remove(id: string): Promise<{
        department: string;
        description: string;
        title: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        skills: string;
        requirements: string | null;
        employmentType: string;
        experienceLevel: string;
        salaryMin: number | null;
        salaryMax: number | null;
        salaryCurrency: string;
        slug: string;
        createdById: string;
        companyId: string | null;
        departmentId: string | null;
    }>;
    updateStatus(id: string, status: JobStatus): Promise<{
        department: string;
        description: string;
        title: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        skills: string;
        requirements: string | null;
        employmentType: string;
        experienceLevel: string;
        salaryMin: number | null;
        salaryMax: number | null;
        salaryCurrency: string;
        slug: string;
        createdById: string;
        companyId: string | null;
        departmentId: string | null;
    }>;
}
