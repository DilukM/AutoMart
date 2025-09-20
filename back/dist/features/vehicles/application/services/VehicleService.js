"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleService = void 0;
const Vehicle_1 = require("../../domain/entities/Vehicle");
const VehicleType_1 = require("../../../shared/types/VehicleType");
class VehicleService {
    constructor(vehicleRepository, openAIService) {
        this.vehicleRepository = vehicleRepository;
        this.openAIService = openAIService;
    }
    async createVehicle(vehicleData) {
        this.validateVehicleData(vehicleData);
        let description = vehicleData.description;
        if ((!description || description.trim() === '') && this.openAIService?.isConfigured()) {
            try {
                const descriptionData = {
                    type: vehicleData.type,
                    brand: vehicleData.brand,
                    modelName: vehicleData.modelName,
                    color: vehicleData.color,
                    engineSize: vehicleData.engineSize,
                    year: vehicleData.year,
                    price: vehicleData.price
                };
                description = await this.openAIService.generateVehicleDescription(descriptionData);
                console.log('AI-generated description created for vehicle');
            }
            catch (error) {
                console.warn('Failed to generate AI description, using default:', error);
                description = `A ${vehicleData.year} ${vehicleData.brand} ${vehicleData.modelName} in ${vehicleData.color}.`;
            }
        }
        const vehicle = Vehicle_1.Vehicle.create(vehicleData.type, vehicleData.brand, vehicleData.modelName, vehicleData.color, vehicleData.engineSize, vehicleData.year, vehicleData.price, vehicleData.images, description);
        return await this.vehicleRepository.create({
            type: vehicle.type,
            brand: vehicle.brand,
            modelName: vehicle.modelName,
            color: vehicle.color,
            engineSize: vehicle.engineSize,
            year: vehicle.year,
            price: vehicle.price,
            images: vehicle.images,
            description: vehicle.description
        });
    }
    async getVehicleById(id) {
        if (!id || id.trim() === '') {
            throw new Error('Vehicle ID is required');
        }
        const vehicle = await this.vehicleRepository.findById(id);
        if (!vehicle) {
            throw new Error('Vehicle not found');
        }
        return vehicle;
    }
    async getAllVehicles(filters, page = 1, limit = 10) {
        if (page < 1)
            page = 1;
        if (limit < 1)
            limit = 10;
        if (limit > 100)
            limit = 100;
        return await this.vehicleRepository.findAll(filters, page, limit);
    }
    async updateVehicle(id, vehicleData) {
        if (!id || id.trim() === '') {
            throw new Error('Vehicle ID is required');
        }
        const existingVehicle = await this.vehicleRepository.findById(id);
        if (!existingVehicle) {
            throw new Error('Vehicle not found');
        }
        if (Object.keys(vehicleData).length > 0) {
            this.validatePartialVehicleData(vehicleData);
        }
        const updatedVehicle = await this.vehicleRepository.update(id, vehicleData);
        if (!updatedVehicle) {
            throw new Error('Failed to update vehicle');
        }
        return updatedVehicle;
    }
    async deleteVehicle(id) {
        if (!id || id.trim() === '') {
            throw new Error('Vehicle ID is required');
        }
        const existingVehicle = await this.vehicleRepository.findById(id);
        if (!existingVehicle) {
            throw new Error('Vehicle not found');
        }
        return await this.vehicleRepository.delete(id);
    }
    async regenerateVehicleDescription(id, customDescription) {
        if (!id || id.trim() === '') {
            throw new Error('Vehicle ID is required');
        }
        const existingVehicle = await this.vehicleRepository.findById(id);
        if (!existingVehicle) {
            throw new Error('Vehicle not found');
        }
        let newDescription = customDescription;
        if ((!newDescription || newDescription.trim() === '') && this.openAIService?.isConfigured()) {
            try {
                const descriptionData = {
                    type: existingVehicle.type,
                    brand: existingVehicle.brand,
                    modelName: existingVehicle.modelName,
                    color: existingVehicle.color,
                    engineSize: existingVehicle.engineSize,
                    year: existingVehicle.year,
                    price: existingVehicle.price
                };
                newDescription = await this.openAIService.generateVehicleDescription(descriptionData);
                console.log('AI-generated description regenerated for vehicle');
            }
            catch (error) {
                console.warn('Failed to regenerate AI description:', error);
                throw new Error('Failed to regenerate vehicle description');
            }
        }
        if (!newDescription || newDescription.trim() === '') {
            throw new Error('Description is required');
        }
        return await this.vehicleRepository.update(id, { description: newDescription });
    }
    validateVehicleData(data) {
        if (!data.type || !Object.values(VehicleType_1.VehicleType).includes(data.type)) {
            throw new Error('Valid vehicle type is required');
        }
        if (!data.brand || data.brand.trim() === '') {
            throw new Error('Brand is required');
        }
        if (!data.modelName || data.modelName.trim() === '') {
            throw new Error('Model name is required');
        }
        if (!data.color || data.color.trim() === '') {
            throw new Error('Color is required');
        }
        if (!data.engineSize || data.engineSize.trim() === '') {
            throw new Error('Engine size is required');
        }
        if (!data.year || data.year < 1900 || data.year > new Date().getFullYear() + 1) {
            throw new Error('Valid year is required');
        }
        if (!data.price || data.price <= 0) {
            throw new Error('Valid price is required');
        }
        if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
            throw new Error('At least one image is required');
        }
        if (!data.description || data.description.trim() === '') {
            throw new Error('Description is required');
        }
    }
    validatePartialVehicleData(data) {
        if (data.type && !Object.values(VehicleType_1.VehicleType).includes(data.type)) {
            throw new Error('Invalid vehicle type');
        }
        if (data.brand && data.brand.trim() === '') {
            throw new Error('Brand cannot be empty');
        }
        if (data.modelName && data.modelName.trim() === '') {
            throw new Error('Model name cannot be empty');
        }
        if (data.color && data.color.trim() === '') {
            throw new Error('Color cannot be empty');
        }
        if (data.engineSize && data.engineSize.trim() === '') {
            throw new Error('Engine size cannot be empty');
        }
        if (data.year && (data.year < 1900 || data.year > new Date().getFullYear() + 1)) {
            throw new Error('Invalid year');
        }
        if (data.price && data.price <= 0) {
            throw new Error('Price must be greater than 0');
        }
        if (data.images && (!Array.isArray(data.images) || data.images.length === 0)) {
            throw new Error('At least one image is required');
        }
        if (data.description && data.description.trim() === '') {
            throw new Error('Description cannot be empty');
        }
    }
}
exports.VehicleService = VehicleService;
//# sourceMappingURL=VehicleService.js.map