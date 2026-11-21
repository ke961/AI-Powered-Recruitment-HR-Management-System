import { SettingsService } from './settings.service.js';
import { CreateDepartmentDto, UpdateCompanySettingsDto } from './dto/settings.dto.js';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<{
        departments: {
            description: string | null;
            id: string;
            createdAt: Date;
            name: string;
            companyId: string;
        }[];
        settings: {
            id: string;
            updatedAt: Date;
            companyId: string;
            timezone: string;
            dateFormat: string;
            enableAiScreening: boolean;
            autoShortlistScore: number;
            emailNotifications: boolean;
        } | null;
    } & {
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        domain: string | null;
        website: string | null;
        logoUrl: string | null;
    }>;
    updateSettings(dto: UpdateCompanySettingsDto): Promise<{
        id: string;
        updatedAt: Date;
        companyId: string;
        timezone: string;
        dateFormat: string;
        enableAiScreening: boolean;
        autoShortlistScore: number;
        emailNotifications: boolean;
    }>;
    getDepartments(): Promise<({
        _count: {
            jobPostings: number;
        };
    } & {
        description: string | null;
        id: string;
        createdAt: Date;
        name: string;
        companyId: string;
    })[]>;
    createDepartment(dto: CreateDepartmentDto): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        name: string;
        companyId: string;
    }>;
}
