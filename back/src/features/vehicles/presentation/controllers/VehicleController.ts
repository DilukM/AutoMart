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
    console.log(
      "VehicleController created with vehicleService:",
      !!this.vehicleService
    );
    console.log(
      "VehicleController created with imageUploadService:",
      !!this.imageUploadService
    );
    console.log("VehicleController created with aiService:", !!this.aiService);

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
      console.log(
        "createVehicle called, vehicleService:",
        !!this.vehicleService
      );
      console.log("Request body:", req.body);
      console.log("Request files:", req.files);
      console.log("Request files type:", typeof req.files);
      console.log(
        "Request files keys:",
        req.files
          ? Array.isArray(req.files)
            ? "req.files is array"
            : Object.keys(req.files)
          : "req.files is null/undefined"
      );

      // Check all possible file field names
      if (Array.isArray(req.files)) {
        console.log(`Files array contains ${req.files.length} files`);
      } else if (req.files) {
        const possibleFields = ["images", "files", "photos", "pictures"];
        for (const field of possibleFields) {
          if (req.files[field]) {
            console.log(`Found files in field '${field}':`, req.files[field]);
          }
        }
      }

      console.log("Request headers content-type:", req.headers["content-type"]);
      console.log("Request headers:", req.headers);

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

      console.log("Extracted data:", {
        type,
        brand,
        modelName,
        color,
        engineSize,
        year,
        price,
        description,
      });

      // Handle file uploads (multer format with upload.any())
      let imageUrls: string[] = [];

      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        // upload.any() puts files in an array
        console.log(
          `Found ${req.files.length} files, uploading to Cloudinary...`
        );

        const uploadPromises = req.files.map((file) =>
          this.imageUploadService.uploadImage(
            file as unknown as Express.Multer.File,
            "automart"
          )
        );
        imageUrls = await Promise.all(uploadPromises);
        console.log("Images uploaded successfully:", imageUrls);
      } else if (req.files && !Array.isArray(req.files)) {
        // Fallback: check for specific field names (in case upload.any() didn't work as expected)
        const possibleFields = ["images", "files", "photos", "pictures"];

        for (const field of possibleFields) {
          if (req.files[field]) {
            const files = req.files[field];
            const fileArray = Array.isArray(files) ? files : [files];
            console.log(
              `Found ${fileArray.length} files in field '${field}', uploading to Cloudinary...`
            );

            const uploadPromises = fileArray.map((file) =>
              this.imageUploadService.uploadImage(
                file as unknown as Express.Multer.File,
                "automart"
              )
            );
            imageUrls = await Promise.all(uploadPromises);
            console.log("Images uploaded successfully:", imageUrls);
            break; // Use the first field that has files
          }
        }
      } else {
        console.log("No files found in request");
      }

      // Validate that at least one image is provided
      if (imageUrls.length === 0) {
        console.log("No images provided, returning error");
        res.status(400).json({
          success: false,
          error: "At least one image file is required",
        });
        return;
      }

      console.log("Creating vehicle data object");
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

      console.log("Vehicle data to create:", vehicleData);
      console.log("Calling vehicleService.createVehicle");

      const vehicle = await this.vehicleService.createVehicle(
        vehicleData as any
      );

      console.log("Vehicle created successfully:", vehicle.id);

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
      console.log(
        "getAllVehicles called, vehicleService:",
        !!this.vehicleService
      );
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

  async generateDescription(req: Request, res: Response): Promise<void> {
    try {
      console.log("generateDescription called");
      console.log("Request body:", req.body);

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

      console.log("Vehicle details extracted:", {
        type,
        brand,
        modelName,
        color,
        engineSize,
        year,
        price,
      });

      // Check if AI service is available
      if (!this.aiService || !this.aiService.isConfigured()) {
        console.log("AI service not available or not configured");
        console.log("aiService exists:", !!this.aiService);
        if (this.aiService) {
          console.log("isConfigured result:", this.aiService.isConfigured());
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

      console.log(
        "Generating description with AI service for:",
        descriptionData
      );

      // Generate description using AI service
      const generatedDescription =
        await this.aiService.generateVehicleDescription(descriptionData);

      console.log("Description generated successfully:", generatedDescription);

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
