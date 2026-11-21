export declare class UploadsController {
    uploadResume(file: Express.Multer.File): {
        message: string;
        fileName: string;
        originalName: string;
        size: number;
        mimetype: string;
        url: string;
    };
}
