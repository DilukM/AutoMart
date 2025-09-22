"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const database_1 = require("./config/database");
const swagger_1 = require("./config/swagger");
const authRoutes_1 = require("./features/auth/presentation/routes/authRoutes");
const vehicleRoutes_1 = require("./features/vehicles/presentation/routes/vehicleRoutes");
const errorHandler_1 = require("./shared/middleware/errorHandler");
const AuthService_1 = require("./features/auth/application/services/AuthService");
const VehicleService_1 = require("./features/vehicles/application/services/VehicleService");
const ImageUploadService_1 = require("./features/vehicles/application/services/ImageUploadService");
const OpenAIService_1 = require("./features/vehicles/application/services/OpenAIService");
const AuthController_1 = require("./features/auth/presentation/controllers/AuthController");
const VehicleController_1 = require("./features/vehicles/presentation/controllers/VehicleController");
const AuthMiddleware_1 = require("./features/auth/infrastructure/web/middlewares/AuthMiddleware");
const UserRepository_1 = require("./features/auth/infrastructure/database/repositories/UserRepository");
const VehicleRepository_1 = require("./features/vehicles/infrastructure/database/repositories/VehicleRepository");
const UserEntity_1 = require("./features/auth/infrastructure/database/entities/UserEntity");
const VehicleEntity_1 = require("./features/vehicles/infrastructure/database/entities/VehicleEntity");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Vehicle Sales Management System is running",
        timestamp: new Date().toISOString(),
    });
});
app.use(errorHandler_1.errorHandler);
const startServer = async () => {
    console.log("🚀 startServer function called");
    try {
        console.log("Starting server initialization...");
        await (0, database_1.initializeDatabase)();
        console.log("Database initialized successfully");
        const userRepository = new UserRepository_1.UserRepository(database_1.AppDataSource.getRepository(UserEntity_1.UserEntity));
        const vehicleRepository = new VehicleRepository_1.VehicleRepository(database_1.AppDataSource.getRepository(VehicleEntity_1.VehicleEntity));
        console.log("Repositories created");
        const authService = new AuthService_1.AuthService(userRepository, process.env.JWT_SECRET || "default-secret", process.env.JWT_EXPIRES_IN || "24h");
        const openAIService = process.env.OPENAI_API_KEY
            ? new OpenAIService_1.OpenAIService(process.env.OPENAI_API_KEY)
            : undefined;
        const vehicleService = new VehicleService_1.VehicleService(vehicleRepository, openAIService);
        const imageUploadService = new ImageUploadService_1.ImageUploadService();
        console.log("Services created");
        const authController = new AuthController_1.AuthController(authService);
        const vehicleController = new VehicleController_1.VehicleController(vehicleService, imageUploadService);
        console.log("Controllers created");
        const authMiddleware = new AuthMiddleware_1.AuthMiddleware(authService);
        const authRouter = (0, authRoutes_1.authRoutes)(authController, authMiddleware);
        const vehicleRouter = (0, vehicleRoutes_1.vehicleRoutes)(vehicleController, authMiddleware);
        console.log("Routes created");
        app.use("/api/auth", authRouter);
        app.use("/api/vehicles", vehicleRouter);
        console.log("Routes registered");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Promise Rejection:", err.message);
    process.exit(1);
});
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err.message);
    process.exit(1);
});
startServer();
exports.default = app;
//# sourceMappingURL=app.js.map