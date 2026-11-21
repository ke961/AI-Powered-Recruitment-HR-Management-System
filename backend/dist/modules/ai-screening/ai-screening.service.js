var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
let AiScreeningService = class AiScreeningService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async triggerScreening(applicationId) {
        const application = await this.prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                job: true,
                candidate: true,
            },
        });
        if (!application) {
            throw new NotFoundException('Application not found');
        }
        let analysisData;
        try {
            const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
            const response = await fetch(`${aiServiceUrl}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    applicationId: application.id,
                    jobTitle: application.job.title,
                    jobDescription: application.job.description,
                    jobSkills: application.job.skills,
                    candidateSkills: application.candidate.skills,
                    resumeUrl: application.resumeUrl,
                }),
                signal: AbortSignal.timeout(3000),
            });
            if (response.ok) {
                analysisData = await response.json();
            }
            else {
                analysisData = this.generateFallbackAnalysis(application);
            }
        }
        catch {
            analysisData = this.generateFallbackAnalysis(application);
        }
        return this.saveAnalysis(analysisData);
    }
    async saveAnalysis(dto) {
        const analysis = await this.prisma.aIAnalysis.upsert({
            where: { applicationId: dto.applicationId },
            create: {
                applicationId: dto.applicationId,
                overallMatchScore: dto.overallMatchScore,
                skillsMatched: JSON.stringify(dto.skillsMatched),
                skillsMissing: JSON.stringify(dto.skillsMissing),
                experienceMatch: dto.experienceMatch || 'HIGH',
                strengths: JSON.stringify(dto.strengths || []),
                redFlags: JSON.stringify(dto.redFlags || []),
                matchExplanation: dto.matchExplanation,
                humanReviewStatus: 'PENDING',
            },
            update: {
                overallMatchScore: dto.overallMatchScore,
                skillsMatched: JSON.stringify(dto.skillsMatched),
                skillsMissing: JSON.stringify(dto.skillsMissing),
                experienceMatch: dto.experienceMatch || 'HIGH',
                strengths: JSON.stringify(dto.strengths || []),
                redFlags: JSON.stringify(dto.redFlags || []),
                matchExplanation: dto.matchExplanation,
            },
        });
        return this.formatAnalysis(analysis);
    }
    async overrideAnalysis(applicationId, performedById, dto) {
        const existing = await this.prisma.aIAnalysis.findUnique({
            where: { applicationId },
        });
        if (!existing) {
            throw new NotFoundException('AI Analysis not found for this application');
        }
        const updated = await this.prisma.aIAnalysis.update({
            where: { applicationId },
            data: {
                humanReviewStatus: dto.humanReviewStatus,
                humanReviewNotes: dto.humanReviewNotes,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                userId: performedById,
                applicationId,
                action: 'AI_MATCH_HUMAN_OVERRIDE',
                entityType: 'AIAnalysis',
                entityId: existing.id,
                details: JSON.stringify({
                    status: dto.humanReviewStatus,
                    notes: dto.humanReviewNotes,
                }),
            },
        });
        return this.formatAnalysis(updated);
    }
    async getByApplication(applicationId) {
        const analysis = await this.prisma.aIAnalysis.findUnique({
            where: { applicationId },
        });
        if (!analysis) {
            throw new NotFoundException('No AI analysis generated yet for this application');
        }
        return this.formatAnalysis(analysis);
    }
    generateFallbackAnalysis(application) {
        const jobSkills = (application.job.skills || '')
            .split(',')
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean);
        const candSkills = (application.candidate.skills || 'TypeScript,React,Node.js,PostgreSQL,Git')
            .split(',')
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean);
        const matched = jobSkills.filter((s) => candSkills.some((cs) => cs.includes(s) || s.includes(cs)));
        const missing = jobSkills.filter((s) => !candSkills.some((cs) => cs.includes(s) || s.includes(cs)));
        const matchRatio = jobSkills.length > 0 ? matched.length / jobSkills.length : 0.8;
        const baseScore = Math.round(matchRatio * 70 + 25);
        const overallScore = Math.min(Math.max(baseScore, 45), 96);
        const formatCase = (arr) => arr.map((s) => s.charAt(0).toUpperCase() + s.slice(1));
        return {
            applicationId: application.id,
            overallMatchScore: overallScore,
            skillsMatched: formatCase(matched),
            skillsMissing: formatCase(missing),
            experienceMatch: overallScore >= 75 ? 'HIGH' : overallScore >= 60 ? 'MEDIUM' : 'LOW',
            strengths: [
                `Demonstrates relevant core technical proficiencies (${formatCase(matched).slice(0, 3).join(', ')})`,
                `Directly aligns with the ${application.job.department} department requirements`,
            ],
            redFlags: missing.length > 0 ? [`Missing explicit keywords for: ${formatCase(missing).join(', ')}`] : [],
            matchExplanation: `The applicant has an overall suitability score of ${overallScore}%. They possess ${matched.length} out of ${jobSkills.length} core job competencies. Human recruiter review is advised before scheduling interview rounds.`,
        };
    }
    formatAnalysis(record) {
        return {
            ...record,
            skillsMatched: typeof record.skillsMatched === 'string' ? JSON.parse(record.skillsMatched) : record.skillsMatched,
            skillsMissing: typeof record.skillsMissing === 'string' ? JSON.parse(record.skillsMissing) : record.skillsMissing,
            strengths: typeof record.strengths === 'string' ? JSON.parse(record.strengths) : record.strengths,
            redFlags: typeof record.redFlags === 'string' ? JSON.parse(record.redFlags) : record.redFlags,
        };
    }
};
AiScreeningService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AiScreeningService);
export { AiScreeningService };
//# sourceMappingURL=ai-screening.service.js.map