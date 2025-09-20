"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleController = void 0;
class VehicleController {
    constructor(vehicleService) {
        this.vehicleService = vehicleService;
    }
    async createVehicle(req, res) {
        try {
            const vehicleData = req.body;
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
                    updatedAt: vehicle.updatedAt
                },
                message: 'Vehicle created successfully'
            });
        }
        catch (error) {
            const statusCode = error.statusCode || 400;
            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }
    async getVehicleById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: 'Vehicle ID is required'
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
                    updatedAt: vehicle.updatedAt
                }
            });
        }
        catch (error) {
            const statusCode = error.statusCode || 404;
            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }
    async getAllVehicles(req, res) {
        try {
            const { type, brand, modelName, color, engineSize, year, minPrice, maxPrice, page = '1', limit = '10' } = req.query;
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
                    vehicles: result.vehicles.map(vehicle => ({
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
                        updatedAt: vehicle.updatedAt
                    })),
                    pagination: {
                        page: result.page,
                        limit: result.limit,
                        total: result.total,
                        totalPages: Math.ceil(result.total / result.limit)
                    }
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    async updateVehicle(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: 'Vehicle ID is required'
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
                    updatedAt: vehicle.updatedAt
                },
                message: 'Vehicle updated successfully'
            });
        }
        catch (error) {
            const statusCode = error.statusCode || 400;
            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }
    async deleteVehicle(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: 'Vehicle ID is required'
                });
                return;
            }
            const deleted = await this.vehicleService.deleteVehicle(id);
            if (deleted) {
                res.status(200).json({
                    success: true,
                    message: 'Vehicle deleted successfully'
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    error: 'Vehicle not found'
                });
            }
        }
        catch (error) {
            const statusCode = error.statusCode || 400;
            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }
    async regenerateDescription(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: 'Vehicle ID is required'
                });
                return;
            }
            const { description } = req.body;
            if (description && (typeof description !== 'string' || description.trim() === '')) {
                res.status(400).json({
                    success: false,
                    error: 'Description must be a non-empty string if provided'
                });
                return;
            }
            const vehicle = await this.vehicleService.regenerateVehicleDescription(id, description);
            res.status(200).json({
                success: true,
                data: {
                    id: vehicle.id,
                    description: vehicle.description,
                    updatedAt: vehicle.updatedAt
                },
                message: description ? 'Vehicle description updated successfully' : 'AI-generated description created successfully'
            });
        }
        catch (error) {
            const statusCode = error.statusCode || 400;
            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }
}
exports.VehicleController = VehicleController;
//# sourceMappingURL=VehicleController.js.map