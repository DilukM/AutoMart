export declare class ImageUploadService {
    constructor();
    uploadImage(file: Express.Multer.File, folder?: string): Promise<string>;
    uploadMultipleImages(files: Express.Multer.File[], folder?: string): Promise<string[]>;
    deleteImage(publicId: string): Promise<void>;
}
//# sourceMappingURL=ImageUploadService.d.ts.map