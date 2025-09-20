import { Request, Response } from "express";
import { VehicleService } from "../../application/services/VehicleService";
import { CreateVehicleDTO } from "../dto/CreateVehicleDTO";
import { UpdateVehicleDTO } from "../dto/UpdateVehicleDTO";
import { VehicleType } from "@/shared/types/VehicleType";

export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  async createVehicle(req: Request, res: Response): Promise<void> {
    try {
      const vehicleData: CreateVehicleDTO = req.body;

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
    } catch (error) {
      const statusCode = (error as any).statusCode || 400;
      res.status(statusCode).json({
        success: false,
        error: (error as Error).message,
      });
    }
  }

  async getVehicleById(req: Request, res: Response): Promise<void> {
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
          id: vehicle!.id,
          type: vehicle!.type,
          brand: vehicle!.brand,
          modelName: vehicle!.modelName,
          color: vehicle!.color,
          engineSize: vehicle!.engineSize,
          year: vehicle!.year,
          price: vehicle!.price,
          images: vehicle!.images,
          description: vehicle!.description,
          createdAt: vehicle!.createdAt,
          updatedAt: vehicle!.updatedAt,
        },
      });
    } catch (error) {
      const statusCode = (error as any).statusCode || 404;
      res.status(statusCode).json({
        success: false,
        error: (error as Error).message,
      });
    }
  }

  async getAllVehicles(req: Request, res: Response): Promise<void> {
    try {
      const {
        type,
        brand,
        modelName,
        color,
        engineSize,
        year,
        minPrice,
        maxPrice,
        page = "1",
        limit = "10",
      } = req.query;

      const filters: any = {};
      if (type) filters.type = type as VehicleType;
      if (brand) filters.brand = brand as string;
      if (modelName) filters.modelName = modelName as string;
      if (color) filters.color = color as string;
      if (engineSize) filters.engineSize = engineSize as string;
      if (year) filters.year = parseInt(year as string);
      if (minPrice) filters.minPrice = parseFloat(minPrice as string);
      if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);

      const result = await this.vehicleService.getAllVehicles(
        filters,
        pageNum,
        limitNum
      );

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
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  }

  async updateVehicle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: "Vehicle ID is required",
        });
        return;
      }

      const vehicleData: UpdateVehicleDTO = req.body;

      const vehicle = await this.vehicleService.updateVehicle(id, vehicleData);

      res.status(200).json({
        success: true,
        data: {
          id: vehicle!.id,
          type: vehicle!.type,
          brand: vehicle!.brand,
          modelName: vehicle!.modelName,
          color: vehicle!.color,
          engineSize: vehicle!.engineSize,
          year: vehicle!.year,
          price: vehicle!.price,
          images: vehicle!.images,
          description: vehicle!.description,
          createdAt: vehicle!.createdAt,
          updatedAt: vehicle!.updatedAt,
        },
        message: "Vehicle updated successfully",
      });
    } catch (error) {
      const statusCode = (error as any).statusCode || 400;
      res.status(statusCode).json({
        success: false,
        error: (error as Error).message,
      });
    }
  }

  async deleteVehicle(req: Request, res: Response): Promise<void> {
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
      } else {
        res.status(404).json({
          success: false,
          error: "Vehicle not found",
        });
      }
    } catch (error) {
      const statusCode = (error as any).statusCode || 400;
      res.status(statusCode).json({
        success: false,
        error: (error as Error).message,
      });
    }
  }

  async regenerateDescription(req: Request, res: Response): Promise<void> {
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

      // Description is now optional - if not provided, AI will generate one
      if (
        description &&
        (typeof description !== "string" || description.trim() === "")
      ) {
        res.status(400).json({
          success: false,
          error: "Description must be a non-empty string if provided",
        });
        return;
      }

      const vehicle = await this.vehicleService.regenerateVehicleDescription(
        id,
        description
      );

      res.status(200).json({
        success: true,
        data: {
          id: vehicle!.id,
          description: vehicle!.description,
          updatedAt: vehicle!.updatedAt,
        },
        message: description
          ? "Vehicle description updated successfully"
          : "AI-generated description created successfully",
      });
    } catch (error) {
      const statusCode = (error as any).statusCode || 400;
      res.status(statusCode).json({
        success: false,
        error: (error as Error).message,
      });
    }
  }
}
