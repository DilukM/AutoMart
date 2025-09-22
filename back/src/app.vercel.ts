import dotenv from "dotenv";

// Load environment variables FIRST
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import fileUpload from "express-fileupload";
import { initializeDatabase, AppDataSource } from "./config/database";
import { swaggerSpec } from "./config/swagger";
import { authRoutes } from "./features/auth/presentation/routes/authRoutes";
import { vehicleRoutes } from "./features/vehicles/presentation/routes/vehicleRoutes";
import { errorHandler } from "./shared/middleware/errorHandler";
import { AuthService } from "./features/auth/application/services/AuthService";
import { VehicleService } from "./features/vehicles/application/services/VehicleService";
import { ImageUploadService } from "./features/vehicles/application/services/ImageUploadService";
import { OpenAIService } from "./features/vehicles/application/services/OpenAIService";
import { GeminiService } from "./features/vehicles/application/services/GeminiService";
import { IAIService } from "./features/vehicles/application/services/IAIService";
import { AuthController } from "./features/auth/presentation/controllers/AuthController";
import { VehicleController } from "./features/vehicles/presentation/controllers/VehicleController";
import { AuthMiddleware } from "./features/auth/infrastructure/web/middlewares/AuthMiddleware";
import { UserRepository } from "./features/auth/infrastructure/database/repositories/UserRepository";
import { VehicleRepository } from "./features/vehicles/infrastructure/database/repositories/VehicleRepository";
import { UserEntity } from "./features/auth/infrastructure/database/entities/UserEntity";
import { VehicleEntity } from "./features/vehicles/infrastructure/database/entities/VehicleEntity";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

// Optional: DB health endpoint to verify DB connectivity and SSL status
app.get("/db-health", async (req, res) => {
  try {
    // Ensure DB is initialized
    if (!AppDataSource.isInitialized) {
      await initializeDatabase();
    }

    // Simple query to validate connection
    const result = await AppDataSource.query("SELECT 1 AS ok");

    res.status(200).json({
      status: "OK",
      dbConnected: true,
      sslEnabled: process.env.DB_SSL === "true",
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("/db-health error:", error);
    res.status(500).json({
      status: "ERROR",
      dbConnected: false,
      sslEnabled: process.env.DB_SSL === "true",
      error: error?.message || String(error),
      timestamp: new Date().toISOString(),
    });
  }
});

// Initialize database and setup routes
let isInitialized = false;

const initializeApp = async () => {
  if (isInitialized) return;

  try {
    console.log("🚀 Initializing application...");
    await initializeDatabase();
    console.log("Database initialized successfully");

    // Get repositories from DataSource
    const userRepository = new UserRepository(
      AppDataSource.getRepository(UserEntity)
    );
    const vehicleRepository = new VehicleRepository(
      AppDataSource.getRepository(VehicleEntity)
    );
    console.log("Repositories created");

    // Validate required JWT environment variables
    if (!process.env.JWT_SECRET) {
      throw new Error("Missing required environment variable: JWT_SECRET");
    }
    if (!process.env.JWT_EXPIRES_IN) {
      throw new Error("Missing required environment variable: JWT_EXPIRES_IN");
    }

    // Create services
    const authService = new AuthService(
      userRepository,
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRES_IN
    );

    // Initialize AI service based on configuration
    let aiService: IAIService | undefined;
    const aiServiceType = process.env.AI_SERVICE?.toLowerCase();

    if (aiServiceType === "gemini" && process.env.GEMINI_API_KEY) {
      aiService = new GeminiService();
      console.log("Using Gemini AI service");
    } else if (aiServiceType === "openai" && process.env.OPENAI_API_KEY) {
      aiService = new OpenAIService();
      console.log("Using OpenAI service");
    } else if (process.env.OPENAI_API_KEY) {
      // Fallback to OpenAI if no AI_SERVICE specified but OPENAI_API_KEY exists
      aiService = new OpenAIService();
      console.log("Using OpenAI service (fallback)");
    } else {
      console.log("No AI service configured");
    }

    const vehicleService = new VehicleService(vehicleRepository, aiService);
    const imageUploadService = new ImageUploadService();
    console.log("Services created");

    // Create controllers
    const authController = new AuthController(authService);
    const vehicleController = new VehicleController(
      vehicleService,
      imageUploadService,
      aiService
    );
    console.log("Controllers created");

    // Create middleware
    const authMiddleware = new AuthMiddleware(authService);

    // Create route routers
    const authRouter = authRoutes(authController, authMiddleware);
    const vehicleRouter = vehicleRoutes(vehicleController, authMiddleware);
    console.log("Routes created");

    // Use routers
    app.use("/api/auth", authRouter);
    app.use("/api/vehicles", vehicleRouter);
    console.log("Routes registered");

    isInitialized = true;
    console.log("Application initialized successfully");
  } catch (error) {
    console.error("Failed to initialize application:", error);
    throw error;
  }
};

// Lazy initialization: don't crash the serverless function on init failure
// and defer initialization until the first non-health request.
initializeApp().catch((error) => {
  console.error(
    "Application initialization failed (will retry on request):",
    error
  );
  // Do NOT exit in serverless environment; health endpoint should still work
});

// Middleware to ensure initialization on demand for non-health routes
app.use(async (req, res, next) => {
  try {
    if (!isInitialized && req.path !== "/health") {
      await initializeApp();
    }
    next();
  } catch (err) {
    console.error("Initialization during request failed:", err);
    res
      .status(500)
      .json({ success: false, error: "Service initialization failed" });
  }
});

// Error handling middleware (must be last)
app.use(errorHandler);

// For Vercel serverless functions
export default app;
