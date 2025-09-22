import { Request, Response } from "express";
import { VehicleService } from "../../application/services/VehicleService";
import { ImageUploadService } from "../../application/services/ImageUploadService";
import {
  IAIService,
  VehicleDescriptionData,
} from "../../application/services/IAIService";
import { CreateVehicleDTO } from "../dto/CreateVehicleDTO";
import { UpdateVehicleDTO } from "../dto/UpdateVehicleDTO";
import { VehicleType } from "@/shared/types/VehicleType";

export class VehicleController {
  constructor(
    private readonly vehicleService: VehicleService,
    private readonly imageUploadService: ImageUploadService,
    private readonly aiService?: IAIService
  ) {
    // Bind methods to preserve 'this' context when used as Express callbacks
    this.createVehicle = this.createVehicle.bind(this);
    this.getVehicleById = this.getVehicleById.bind(this);
    this.getAllVehicles = this.getAllVehicles.bind(this);
    this.updateVehicle = this.updateVehicle.bind(this);
    this.deleteVehicle = this.deleteVehicle.bind(this);
    this.generateDescription = this.generateDescription.bind(this);
  }

  async createVehicle(req: Request, res: Response): Promise<void> {
    try {
      // Extract form data
      const {
        type,
        brand,
        modelName,
        color,
        engineSize,
        year,
        price,
        description,
      } = req.body;

      // Handle file uploads (multer format with upload.any())
      let imageUrls: string[] = [];

      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        // upload.any() puts files in an array
        const uploadPromises = req.files.map((file) =>
          this.imageUploadService.uploadImage(
            file as unknown as Express.Multer.File,
            "automart"
          )
        );
        imageUrls = await Promise.all(uploadPromises);
      } else if (req.files && !Array.isArray(req.files)) {
        // Fallback: check for specific field names (in case upload.any() didn't work as expected)
        const possibleFields = ["images", "files", "photos", "pictures"];

        for (const field of possibleFields) {
          if (req.files[field]) {
            const files = req.files[field];
            const fileArray = Array.isArray(files) ? files : [files];

            const uploadPromises = fileArray.map((file) =>
              this.imageUploadService.uploadImage(
                file as unknown as Express.Multer.File,
                "automart"
              )
            );
            imageUrls = await Promise.all(uploadPromises);
            break; // Use the first field that has files
          }
        }
      }

      // Validate that at least one image is provided
      if (imageUrls.length === 0) {
        res.status(400).json({
          success: false,
          error: "At least one image file is required",
        });
        return;
      }

      // Create vehicle data object
      const vehicleData: CreateVehicleDTO = {
        type: type as VehicleType,
        brand,
        modelName,
        color,
        engineSize,
        year: parseInt(year),
        price: parseFloat(price),
        images: imageUrls,
        description,
      };

      const vehicle = await this.vehicleService.createVehicle(
        vehicleData as any
      );

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
      console.error("Error in createVehicle:", error);
      const statusCode = (error as any).statusCode || 500;
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



      // Get the existing vehicle data first
      const existingVehicle = await this.vehicleService.getVehicleById(id);

      if (!existingVehicle) {
        res.status(404).json({
          success: false,
          error: "Vehicle not found",
        });
        return;
      }

      // Extract update data from request body
      const vehicleData: UpdateVehicleDTO = { ...req.body };

      // Handle new image uploads
      let newImageUrls: string[] = [];
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const uploadPromises = req.files.map((file) =>
          this.imageUploadService.uploadImage(
            file as unknown as Express.Multer.File,
            "automart"
          )
        );
        newImageUrls = await Promise.all(uploadPromises);
      }

      // Handle image management
      let finalImages = [...existingVehicle.images]; // Start with existing images

      // Remove specified images if imagesToRemove is provided
      if (vehicleData.imagesToRemove && vehicleData.imagesToRemove.length > 0) {
        finalImages = finalImages.filter(
          (imageUrl) => !vehicleData.imagesToRemove!.includes(imageUrl)
        );
      }

      // Add new images if any were uploaded
      if (newImageUrls.length > 0) {
        finalImages = [...finalImages, ...newImageUrls];
      }

      // If images array is explicitly provided in the request (for complete replacement)
      if (
        vehicleData.images &&
        !vehicleData.imagesToRemove &&
        newImageUrls.length === 0
      ) {
        finalImages = vehicleData.images;
      }

      // Ensure we have at least one image
      if (finalImages.length === 0) {
        res.status(400).json({
          success: false,
          error: "Vehicle must have at least one image",
        });
        return;
      }

      // Update the vehicle data with the final images array
      vehicleData.images = finalImages;

      // Remove imagesToRemove from the data sent to service (it's not part of the entity)
      delete vehicleData.imagesToRemove;


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
      console.error("Error in updateVehicle:", error);
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

  async generateDescription(req: Request, res: Response): Promise<void> {
    try {
   

      // Extract vehicle details from request body
      const { type, brand, modelName, color, engineSize, year, price } =
        req.body;

      // Validate required fields
      if (!type || !brand || !modelName || !color || !year || !price) {
        res.status(400).json({
          success: false,
          error:
            "Missing required vehicle details: type, brand, modelName, color, year, and price are required",
        });
        return;
      }



      // Check if AI service is available
      if (!this.aiService || !this.aiService.isConfigured()) {

        if (this.aiService) {
        }
        res.status(503).json({
          success: false,
          error: "AI description generation service is not available",
        });
        return;
      }

      // Prepare data for OpenAI
      const descriptionData: VehicleDescriptionData = {
        type: type as VehicleType,
        brand,
        modelName,
        color,
        engineSize,
        year: parseInt(year),
        price: parseFloat(price),
      };



      // Generate description using AI service
      const generatedDescription =
        await this.aiService.generateVehicleDescription(descriptionData);


      res.status(200).json({
        success: true,
        data: {
          description: generatedDescription,
        },
        message: "AI-generated description created successfully",
      });
    } catch (error) {
      console.error("Error in generateDescription:", error);
      const statusCode = (error as any).statusCode || 500;
      res.status(statusCode).json({
        success: false,
        error: (error as Error).message,
      });
    }
  }
}
