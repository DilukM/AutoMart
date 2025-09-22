import { VehicleRepository } from './infrastructure/database/repositories/VehicleRepository';
import { VehicleService } from './application/services/VehicleService';
import { OpenAIService } from './application/services/OpenAIService';
import { VehicleController } from './presentation/controllers/VehicleController';
import { ImageUploadService } from './application/services/ImageUploadService';
declare const vehicleRepository: VehicleRepository;
declare let openAIService: OpenAIService | undefined;
declare const vehicleService: VehicleService;
declare const imageUploadService: ImageUploadService;
declare const vehicleController: VehicleController;
declare const vehicleRouter: import("express").Router;
export { vehicleRepository, vehicleService, imageUploadService, openAIService, vehicleController, vehicleRouter as vehicleRoutes };
//# sourceMappingURL=index.d.ts.map