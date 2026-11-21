import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateAiAnalysisDto, HumanOverrideDto } from './dto/ai-analysis.dto.js';
export declare class AiScreeningService {
    private prisma;
    constructor(prisma: PrismaService);
    triggerScreening(applicationId: string): Promise<any>;
    saveAnalysis(dto: CreateAiAnalysisDto): Promise<any>;
    overrideAnalysis(applicationId: string, performedById: string, dto: HumanOverrideDto): Promise<any>;
    getByApplication(applicationId: string): Promise<any>;
    private generateFallbackAnalysis;
    private formatAnalysis;
}
