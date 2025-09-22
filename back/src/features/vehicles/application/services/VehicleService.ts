import { Vehicle } from "../../domain/entities/Vehicle";
import {
  IVehicleRepository,
  CreateVehicleData,
  UpdateVehicleData,
  VehicleSearchFilters,
  VehicleSearchResult,
} from "../../domain/repositories/IVehicleRepository";
import { VehicleType } from "@/shared/types/VehicleType";
import { IAIService, VehicleDescriptionData } from "./IAIService";

export class VehicleService {
  constructor(
    private readonly vehicleRepository: IVehicleRepository,
    private readonly aiService?: IAIService
  ) {}

  async createVehicle(vehicleData: CreateVehicleData): Promise<Vehicle> {
    // Validate required fields
    this.validateVehicleData(vehicleData);

    let description = vehicleData.description;

    // Generate AI description if not provided and AI service is available
    if (
      (!description || description.trim() === "") &&
      this.aiService?.isConfigured()
    ) {
      try {
        const descriptionData: VehicleDescriptionData = {
          type: vehicleData.type,
          brand: vehicleData.brand,
          modelName: vehicleData.modelName,
          color: vehicleData.color,
          engineSize: vehicleData.engineSize,
          year: vehicleData.year,
          price: vehicleData.price,
        };

        description = await this.aiService.generateVehicleDescription(
          descriptionData
        );
      } catch (error) {
        console.warn(
          "Failed to generate AI description, using default:",
          error
        );
        // Continue with empty description or a basic fallback
        description = `A ${vehicleData.year} ${vehicleData.brand} ${vehicleData.modelName} in ${vehicleData.color}.`;
      }
    }

    const vehicle = Vehicle.create(
      vehicleData.type,
      vehicleData.brand,
      vehicleData.modelName,
      vehicleData.color,
      vehicleData.engineSize,
      vehicleData.year,
      vehicleData.price,
      vehicleData.images,
      description
    );

    return await this.vehicleRepository.create({
      type: vehicle.type,
      brand: vehicle.brand,
      modelName: vehicle.modelName,
      color: vehicle.color,
      engineSize: vehicle.engineSize,
      year: vehicle.year,
      price: vehicle.price,
      images: vehicle.images,
      description: vehicle.description,
    });
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    if (!id || id.trim() === "") {
      throw new Error("Vehicle ID is required");
    }

    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    return vehicle;
  }

  async getAllVehicles(
    filters?: VehicleSearchFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<VehicleSearchResult> {
    // Validate pagination parameters
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    if (limit > 100) limit = 100; // Max limit

    return await this.vehicleRepository.findAll(filters, page, limit);
  }

  async updateVehicle(
    id: string,
    vehicleData: UpdateVehicleData
  ): Promise<Vehicle | null> {
    if (!id || id.trim() === "") {
      throw new Error("Vehicle ID is required");
    }

    // Check if vehicle exists
    const existingVehicle = await this.vehicleRepository.findById(id);
    if (!existingVehicle) {
      throw new Error("Vehicle not found");
    }

    // Validate update data if provided
    if (Object.keys(vehicleData).length > 0) {
      this.validatePartialVehicleData(vehicleData);
    }

    const updatedVehicle = await this.vehicleRepository.update(id, vehicleData);
    if (!updatedVehicle) {
      throw new Error("Failed to update vehicle");
    }

    return updatedVehicle;
  }

  async deleteVehicle(id: string): Promise<boolean> {
    if (!id || id.trim() === "") {
      throw new Error("Vehicle ID is required");
    }

    // Check if vehicle exists
    const existingVehicle = await this.vehicleRepository.findById(id);
    if (!existingVehicle) {
      throw new Error("Vehicle not found");
    }

    return await this.vehicleRepository.delete(id);
  }

  async regenerateVehicleDescription(
    id: string,
    customDescription?: string
  ): Promise<Vehicle | null> {
    if (!id || id.trim() === "") {
      throw new Error("Vehicle ID is required");
    }

    // Check if vehicle exists
    const existingVehicle = await this.vehicleRepository.findById(id);
    if (!existingVehicle) {
      throw new Error("Vehicle not found");
    }

    let newDescription = customDescription;

    // Generate new AI description if no custom description provided and AI service is available
    if (
      (!newDescription || newDescription.trim() === "") &&
      this.aiService?.isConfigured()
    ) {
      try {
        const descriptionData: VehicleDescriptionData = {
          type: existingVehicle.type,
          brand: existingVehicle.brand,
          modelName: existingVehicle.modelName,
          color: existingVehicle.color,
          engineSize: existingVehicle.engineSize,
          year: existingVehicle.year,
          price: existingVehicle.price,
        };

        newDescription = await this.aiService.generateVehicleDescription(
          descriptionData
        );
      } catch (error) {
        console.warn("Failed to regenerate AI description:", error);
        throw new Error("Failed to regenerate vehicle description");
      }
    }

    if (!newDescription || newDescription.trim() === "") {
      throw new Error("Description is required");
    }

    return await this.vehicleRepository.update(id, {
      description: newDescription,
    });
  }

  private validateVehicleData(data: CreateVehicleData): void {
    if (!data.type || !Object.values(VehicleType).includes(data.type)) {
      throw new Error("Valid vehicle type is required");
    }

    if (!data.brand || data.brand.trim() === "") {
      throw new Error("Brand is required");
    }

    if (!data.modelName || data.modelName.trim() === "") {
      throw new Error("Model name is required");
    }

    if (!data.color || data.color.trim() === "") {
      throw new Error("Color is required");
    }

    if (!data.engineSize || data.engineSize.trim() === "") {
      throw new Error("Engine size is required");
    }

    if (
      !data.year ||
      data.year < 1900 ||
      data.year > new Date().getFullYear() + 1
    ) {
      throw new Error("Valid year is required");
    }

    if (!data.price || data.price <= 0) {
      throw new Error("Valid price is required");
    }

    if (
      !data.images ||
      !Array.isArray(data.images) ||
      data.images.length === 0
    ) {
      throw new Error("At least one image is required");
    }

    if (!data.description || data.description.trim() === "") {
      throw new Error("Description is required");
    }
  }

  private validatePartialVehicleData(data: UpdateVehicleData): void {
    if (data.type && !Object.values(VehicleType).includes(data.type)) {
      throw new Error("Invalid vehicle type");
    }

    if (data.brand && data.brand.trim() === "") {
      throw new Error("Brand cannot be empty");
    }

    if (data.modelName && data.modelName.trim() === "") {
      throw new Error("Model name cannot be empty");
    }

    if (data.color && data.color.trim() === "") {
      throw new Error("Color cannot be empty");
    }

    if (data.engineSize && data.engineSize.trim() === "") {
      throw new Error("Engine size cannot be empty");
    }

    if (
      data.year &&
      (data.year < 1900 || data.year > new Date().getFullYear() + 1)
    ) {
      throw new Error("Invalid year");
    }

    if (data.price && data.price <= 0) {
      throw new Error("Price must be greater than 0");
    }

    if (
      data.images &&
      (!Array.isArray(data.images) || data.images.length === 0)
    ) {
      throw new Error("At least one image is required");
    }

    if (data.description && data.description.trim() === "") {
      throw new Error("Description cannot be empty");
    }
  }
}
