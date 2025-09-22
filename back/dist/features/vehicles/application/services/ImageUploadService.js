"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageUploadService = void 0;
const cloudinary_1 = require("cloudinary");
class ImageUploadService {
    constructor() {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        if (!cloudName || !apiKey || !apiSecret) {
            throw new Error('Cloudinary configuration is missing required environment variables');
        }
        cloudinary_1.v2.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
        });
    }
    async uploadImage(file, folder = 'automart') {
        try {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    folder: folder,
                    resource_type: 'auto',
                    public_id: `${Date.now()}-${file.originalname}`,
                }, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    else if (result) {
                        resolve(result);
                    }
                    else {
                        reject(new Error('Upload failed: No result returned'));
                    }
                });
                uploadStream.end(file.buffer);
            });
            return result.secure_url;
        }
        catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            throw new Error('Failed to upload image');
        }
    }
    async uploadMultipleImages(files, folder = 'automart') {
        try {
            const uploadPromises = files.map(file => this.uploadImage(file, folder));
            return await Promise.all(uploadPromises);
        }
        catch (error) {
            console.error('Error uploading multiple images to Cloudinary:', error);
            throw new Error('Failed to upload images');
        }
    }
    async deleteImage(publicId) {
        try {
            await cloudinary_1.v2.uploader.destroy(publicId);
        }
        catch (error) {
            console.error('Error deleting image from Cloudinary:', error);
            throw new Error('Failed to delete image');
        }
    }
}
exports.ImageUploadService = ImageUploadService;
//# sourceMappingURL=ImageUploadService.js.map