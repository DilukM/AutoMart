import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { initializeDatabase, AppDataSource } from "./config/database";
import { swaggerSpec } from "./config/swagger";
import { authRoutes } from "./features/auth/presentation/routes/authRoutes";
import { vehicleRoutes } from "./features/vehicles/presentation/routes/vehicleRoutes";
import { errorHandler } from "./shared/middleware/errorHandler";
import { AuthService } from "./features/auth/application/services/AuthService";
import { VehicleService } from "./features/vehicles/application/services/VehicleService";
import { OpenAIService } from "./features/vehicles/application/services/OpenAIService";
import { AuthController } from "./features/auth/presentation/controllers/AuthController";
import { VehicleController } from "./features/vehicles/presentation/controllers/VehicleController";
import { AuthMiddleware } from "./features/auth/infrastructure/web/middlewares/AuthMiddleware";
import { UserRepository } from "./features/auth/infrastructure/database/repositories/UserRepository";
import { VehicleRepository } from "./features/vehicles/infrastructure/database/repositories/VehicleRepository";
import { UserEntity } from "./features/auth/infrastructure/database/entities/UserEntity";
import { VehicleEntity } from "./features/vehicles/infrastructure/database/entities/VehicleEntity";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes will be set up after database initialization

// Health check endpoint
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Check if the API is running and healthy
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Vehicle Sales Management System is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Vehicle Sales Management System is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();

    // Get repositories from DataSource
    const userRepository = new UserRepository(
      AppDataSource.getRepository(UserEntity)
    );
    const vehicleRepository = new VehicleRepository(
      AppDataSource.getRepository(VehicleEntity)
    );

    // Create services
    const authService = new AuthService(
      userRepository,
      process.env.JWT_SECRET || "default-secret",
      process.env.JWT_EXPIRES_IN || "24h"
    );

    const openAIService = process.env.OPENAI_API_KEY
      ? new OpenAIService(process.env.OPENAI_API_KEY)
      : undefined;

    const vehicleService = new VehicleService(vehicleRepository, openAIService);

    // Create controllers
    const authController = new AuthController(authService);
    const vehicleController = new VehicleController(vehicleService);

    // Create middleware
    const authMiddleware = new AuthMiddleware(authService);

    // Create route routers
    const authRouter = authRoutes(authController, authMiddleware);
    const vehicleRouter = vehicleRoutes(vehicleController, authMiddleware);

    // Use routers
    app.use("/api/auth", authRouter);
    app.use("/api/vehicles", vehicleRouter);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Promise Rejection:", err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1);
});

startServer();

export default app;
