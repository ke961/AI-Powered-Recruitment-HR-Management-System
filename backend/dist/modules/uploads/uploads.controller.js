var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
const uploadDir = './uploads';
if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
}
let UploadsController = class UploadsController {
    uploadResume(file) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        const host = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
        const fileUrl = `${host}/uploads/${file.filename}`;
        return {
            message: 'File uploaded successfully',
            fileName: file.filename,
            originalName: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            url: fileUrl,
        };
    }
};
__decorate([
    Post('resume'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard),
    ApiOperation({ summary: 'Upload resume document (PDF, DOC, DOCX up to 10MB)' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueId = randomUUID();
                const ext = extname(file.originalname);
                callback(null, `${uniqueId}${ext}`);
            },
        }),
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(pdf|doc|docx)$/i)) {
                return callback(new BadRequestException('Only PDF and DOC/DOCX files are supported!'), false);
            }
            callback(null, true);
        },
    })),
    __param(0, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UploadsController.prototype, "uploadResume", null);
UploadsController = __decorate([
    ApiTags('File Uploads (Resumes & Documents)'),
    Controller('uploads')
], UploadsController);
export { UploadsController };
//# sourceMappingURL=uploads.controller.js.map