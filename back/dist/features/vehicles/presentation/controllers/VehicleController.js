"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleController = void 0;
class VehicleController {
    constructor(vehicleService, imageUploadService) {
        this.vehicleService = vehicleService;
        this.imageUploadService = imageUploadService;
        console.log("VehicleController created with vehicleService:", !!this.vehicleService);
        console.log("VehicleController created with imageUploadService:", !!this.imageUploadService);
        this.createVehicle = this.createVehicle.bind(this);
        this.getVehicleById = this.getVehicleById.bind(this);
        this.getAllVehicles = this.getAllVehicles.bind(this);
        this.updateVehicle = this.updateVehicle.bind(this);
        this.deleteVehicle = this.deleteVehicle.bind(this);
        this.regenerateDescription = this.regenerateDescription.bind(this);
    }
    async createVehicle(req, res) {
        try {
            console.log("createVehicle called, vehicleService:", !!this.vehicleService);
            const { type, brand, modelName, color, engineSize, year, price, description } = req.body;
            let imageUrls = [];
            if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                console.log(`Uploading ${req.files.length} images to Cloudinary...`);
                imageUrls = await this.imageUploadService.uploadMultipleImages(req.files, 'automart');
                console.log("Images uploaded successfully:", imageUrls);
            }
            if (imageUrls.length === 0) {
                res.status(400).json({
                    success: false,
                    error: "At least one image file is required",
                });
                return;
            }
            const vehicleData = {
                type: type,
                brand,
                modelName,
                color,
                engineSize,
                year: parseInt(year),
                price: parseFloat(price),
                images: imageUrls,
                description
            };
            const vehicle = await this.vehicleService.createVehicle(vehicleData);
            res.status(201).json({
                success: true,
                data: {
                    id: vehicle.id,
                    type: vehicle.type,
                    brand: vehicle.brand,
                    modelName: vehicle.modelName,
                    color: vehicle.color,
                    engineSize: vehicle.engineSize,
                    year: vehicle.year,
                    price: vehicle.price,
                    images: vehicle.images,
                    description: vehicle.description,
                    createdAt: vehicle.createdAt,
                    updatedAt: vehicle.updatedAt,
                },
                message: "Vehicle created successfully",
            });
        }
        catch (error) {
            console.error("Error in createVehicle:", error);
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({
                success: false,
                error: error.message,
            });
        }
    }
    async getVehicleById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: "Vehicle ID is required",
                });
                return;
            }
            const vehicle = await this.vehicleService.getVehicleById(id);
            res.status(200).json({
                success: true,
                data: {
                    id: vehicle.id,
                    type: vehicle.type,
                    brand: vehicle.brand,
                    modelName: vehicle.modelName,
                    color: vehicle.color,
                    engineSize: vehicle.engineSize,
                    year: vehicle.year,
                    price: vehicle.price,
                    images: vehicle.images,
                    description: vehicle.description,
                    createdAt: vehicle.createdAt,
                    updatedAt: vehicle.updatedAt,
                },
            });
        }
        catch (error) {
            const statusCode = error.statusCode || 404;
            res.status(statusCode).json({
                success: false,
                error: error.message,
            });
        }
    }
    async getAllVehicles(req, res) {
        try {
            console.log("getAllVehicles called, vehicleService:", !!this.vehicleService);
            const { type, brand, modelName, color, engineSize, year, minPrice, maxPrice, page = "1", limit = "10", } = req.query;
            const filters = {};
            if (type)
                filters.type = type;
            if (brand)
                filters.brand = brand;
            if (modelName)
                filters.modelName = modelName;
            if (color)
                filters.color = color;
            if (engineSize)
                filters.engineSize = engineSize;
            if (year)
                filters.year = parseInt(year);
            if (minPrice)
                filters.minPrice = parseFloat(minPrice);
            if (maxPrice)
                filters.maxPrice = parseFloat(maxPrice);
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const result = await this.vehicleService.getAllVehicles(filters, pageNum, limitNum);
            res.status(200).json({
                success: true,
                data: {
                    vehicles: result.vehicles.map((vehicle) => ({
                        id: vehicle.id,
                        type: vehicle.type,
                        brand: vehicle.brand,
                        modelName: vehicle.modelName,
                        color: vehicle.color,
                        engineSize: vehicle.engineSize,
                        year: vehicle.year,
                        price: vehicle.price,
                        images: vehicle.images,
                        description: vehicle.description,
                        createdAt: vehicle.createdAt,
                        updatedAt: vehicle.updatedAt,
                    })),
                    pagination: {
                        page: result.page,
                        limit: result.limit,
                        total: result.total,
                        totalPages: Math.ceil(result.total / result.limit),
                    },
                },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
    async updateVehicle(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: "Vehicle ID is required",
                });
                return;
            }
            const vehicleData = req.body;
            const vehicle = await this.vehicleService.updateVehicle(id, vehicleData);
            res.status(200).json({
                success: true,
                data: {
                    id: vehicle.id,
                    type: vehicle.type,
                    brand: vehicle.brand,
                    modelName: vehicle.modelName,
                    color: vehicle.color,
                    engineSize: vehicle.engineSize,
                    year: vehicle.year,
                    price: vehicle.price,
                    images: vehicle.images,
                    description: vehicle.description,
                    createdAt: vehicle.createdAt,
                    updatedAt: vehicle.updatedAt,
                },
                message: "Vehicle updated successfully",
            });
        }
        catch (error) {
            const statusCode = error.statusCode || 400;
            res.status(statusCode).json({
                success: false,
                error: error.message,
            });
        }
    }
    async deleteVehicle(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: "Vehicle ID is required",
                });
                return;
            }
            const deleted = await this.vehicleService.deleteVehicle(id);
            if (deleted) {
                res.status(200).json({
                    success: true,
                    message: "Vehicle deleted successfully",
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    error: "Vehicle not found",
                });
            }
        }
        catch (error) {
            const statusCode = error.statusCode || 400;
            res.status(statusCode).json({
                success: false,
                error: error.message,
            });
        }
    }
    async regenerateDescription(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: "Vehicle ID is required",
                });
                return;
            }
            const { description } = req.body;
            if (description &&
                (typeof description !== "string" || description.trim() === "")) {
                res.status(400).json({
                    success: false,
                    error: "Description must be a non-empty string if provided",
                });
                return;
            }
            const vehicle = await this.vehicleService.regenerateVehicleDescription(id, description);
            res.status(200).json({
                success: true,
                data: {
                    id: vehicle.id,
                    description: vehicle.description,
                    updatedAt: vehicle.updatedAt,
                },
                message: description
                    ? "Vehicle description updated successfully"
                    : "AI-generated description created successfully",
            });
        }
        catch (error) {
            const statusCode = error.statusCode || 400;
            res.status(statusCode).json({
                success: false,
                error: error.message,
            });
        }
    }
}
exports.VehicleController = VehicleController;
//# sourceMappingURL=VehicleController.js.map