import { AiScreeningService } from './ai-screening.service.js';
import { CreateAiAnalysisDto, HumanOverrideDto } from './dto/ai-analysis.dto.js';
export declare class AiScreeningController {
    private readonly aiScreeningService;
    constructor(aiScreeningService: AiScreeningService);
    trigger(applicationId: string): Promise<any>;
    saveWebhookAnalysis(dto: CreateAiAnalysisDto): Promise<any>;
    getByApplication(applicationId: string): Promise<any>;
    override(applicationId: string, userId: string, dto: HumanOverrideDto): Promise<any>;
}
