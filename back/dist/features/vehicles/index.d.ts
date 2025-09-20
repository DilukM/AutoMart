import { VehicleRepository } from './infrastructure/database/repositories/VehicleRepository';
import { VehicleService } from './application/services/VehicleService';
import { OpenAIService } from './application/services/OpenAIService';
import { VehicleController } from './presentation/controllers/VehicleController';
declare const vehicleRepository: VehicleRepository;
declare let openAIService: OpenAIService | undefined;
declare const vehicleService: VehicleService;
declare const vehicleController: VehicleController;
declare const vehicleRoutes: any;
export { vehicleRepository, vehicleService, openAIService, vehicleController, vehicleRoutes };
//# sourceMappingURL=index.d.ts.map