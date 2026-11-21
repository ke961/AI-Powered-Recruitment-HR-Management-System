var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateCandidateProfileDto {
    phone;
    location;
    headline;
    bio;
    skills;
    experienceYears;
    resumeUrl;
    portfolioUrl;
    linkedinUrl;
    githubUrl;
}
__decorate([
    ApiPropertyOptional({ example: '+1 (555) 234-5678' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateCandidateProfileDto.prototype, "phone", void 0);
__decorate([
    ApiPropertyOptional({ example: 'San Francisco, CA' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateCandidateProfileDto.prototype, "location", void 0);
__decorate([
    ApiPropertyOptional({ example: 'Full-Stack Developer passionate about scalable web apps' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateCandidateProfileDto.prototype, "headline", void 0);
__decorate([
    ApiPropertyOptional({ example: 'Experienced in Next.js, Node.js, and cloud deployments.' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateCandidateProfileDto.prototype, "bio", void 0);
__decorate([
    ApiPropertyOptional({ example: ['JavaScript', 'TypeScript', 'React', 'NestJS', 'PostgreSQL'] }),
    IsOptional(),
    __metadata("design:type", Object)
], UpdateCandidateProfileDto.prototype, "skills", void 0);
__decorate([
    ApiPropertyOptional({ example: 4 }),
    IsOptional(),
    IsNumber(),
    __metadata("design:type", Number)
], UpdateCandidateProfileDto.prototype, "experienceYears", void 0);
__decorate([
    ApiPropertyOptional({ example: 'https://storage.hireflow.ai/resumes/john-doe.pdf' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateCandidateProfileDto.prototype, "resumeUrl", void 0);
__decorate([
    ApiPropertyOptional({ example: 'https://johndoe.dev' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateCandidateProfileDto.prototype, "portfolioUrl", void 0);
__decorate([
    ApiPropertyOptional({ example: 'https://linkedin.com/in/johndoe' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateCandidateProfileDto.prototype, "linkedinUrl", void 0);
__decorate([
    ApiPropertyOptional({ example: 'https://github.com/johndoe' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateCandidateProfileDto.prototype, "githubUrl", void 0);
//# sourceMappingURL=update-candidate.dto.js.map