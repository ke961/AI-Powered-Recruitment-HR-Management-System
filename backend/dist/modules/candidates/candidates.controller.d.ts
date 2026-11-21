import { CandidatesService } from './candidates.service.js';
import { UpdateCandidateProfileDto } from './dto/update-candidate.dto.js';
export declare class CandidatesController {
    private readonly candidatesService;
    constructor(candidatesService: CandidatesService);
    getMyProfile(userId: string): Promise<{
        skills: string[];
        user: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
            avatarUrl: string | null;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        location: string | null;
        headline: string | null;
        bio: string | null;
        experienceYears: number | null;
        resumeUrl: string | null;
        portfolioUrl: string | null;
        linkedinUrl: string | null;
        githubUrl: string | null;
        userId: string;
    }>;
    updateMyProfile(userId: string, dto: UpdateCandidateProfileDto): Promise<{
        skills: string[];
        user: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
            avatarUrl: string | null;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        location: string | null;
        headline: string | null;
        bio: string | null;
        experienceYears: number | null;
        resumeUrl: string | null;
        portfolioUrl: string | null;
        linkedinUrl: string | null;
        githubUrl: string | null;
        userId: string;
    }>;
    findAll(skill?: string): Promise<{
        skills: string[];
        applicationsCount: number;
        user: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
            avatarUrl: string | null;
            createdAt: Date;
        };
        _count: {
            applications: number;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        location: string | null;
        headline: string | null;
        bio: string | null;
        experienceYears: number | null;
        resumeUrl: string | null;
        portfolioUrl: string | null;
        linkedinUrl: string | null;
        githubUrl: string | null;
        userId: string;
    }[]>;
}
