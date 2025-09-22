import { VehicleEntity } from './infrastructure/database/entities/VehicleEntity';
import { AppDataSource } from '../../config/database';
import { VehicleRepository } from './infrastructure/database/repositories/VehicleRepository';
import { VehicleService } from './application/services/VehicleService';
import { OpenAIService } from './application/services/OpenAIService';
import { VehicleController } from './presentation/controllers/VehicleController';
import { vehicleRoutes } from './presentation/routes/vehicleRoutes';
import { ImageUploadService } from './application/services/ImageUploadService';
import { authMiddleware } from '../auth';

// Initialize repositories
const vehicleRepository = new VehicleRepository(AppDataSource.getRepository(VehicleEntity));

// Initialize OpenAI service (optional)
let openAIService: OpenAIService | undefined;
const openaiApiKey = process.env.OPENAI_API_KEY;
if (openaiApiKey) {
  openAIService = new OpenAIService(openaiApiKey);
}

// Initialize services
const vehicleService = new VehicleService(vehicleRepository, openAIService);
const imageUploadService = new ImageUploadService();

// Initialize controllers
const vehicleController = new VehicleController(vehicleService, imageUploadService);

// Initialize routes
const vehicleRouter = vehicleRoutes(vehicleController, authMiddleware);

export {
  vehicleRepository,
  vehicleService,
  imageUploadService,
  openAIService,
  vehicleController,
  vehicleRouter as vehicleRoutes
};