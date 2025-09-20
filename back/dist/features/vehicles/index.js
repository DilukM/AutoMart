"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleRoutes = exports.vehicleController = exports.openAIService = exports.vehicleService = exports.vehicleRepository = void 0;
const database_1 = require("../config/database");
const VehicleRepository_1 = require("./infrastructure/database/repositories/VehicleRepository");
const VehicleService_1 = require("./application/services/VehicleService");
const OpenAIService_1 = require("./application/services/OpenAIService");
const VehicleController_1 = require("./presentation/controllers/VehicleController");
const vehicleRoutes_1 = require("./presentation/routes/vehicleRoutes");
const auth_1 = require("../auth");
const vehicleRepository = new VehicleRepository_1.VehicleRepository(database_1.AppDataSource.getRepository('VehicleEntity'));
exports.vehicleRepository = vehicleRepository;
let openAIService;
const openaiApiKey = process.env.OPENAI_API_KEY;
if (openaiApiKey) {
    exports.openAIService = openAIService = new OpenAIService_1.OpenAIService(openaiApiKey);
}
const vehicleService = new VehicleService_1.VehicleService(vehicleRepository, openAIService);
exports.vehicleService = vehicleService;
const vehicleController = new VehicleController_1.VehicleController(vehicleService);
exports.vehicleController = vehicleController;
const vehicleRoutes = (0, vehicleRoutes_1.createVehicleRoutes)(vehicleController, auth_1.authMiddleware);
exports.vehicleRoutes = vehicleRoutes;
//# sourceMappingURL=index.js.map