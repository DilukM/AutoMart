import { DataSource } from "typeorm";
import { VehicleEntity } from "../features/vehicles/infrastructure/database/entities/VehicleEntity";
import { UserEntity } from "../features/auth/infrastructure/database/entities/UserEntity";

// Build minimal SSL options (CA) for mysql2 driver
const buildSslOptions = () => {
  if (process.env.DB_SSL !== "true") return undefined;

  const ssl: any = { rejectUnauthorized: true };

  // Allow disabling certificate verification for self-signed certificates
  if (process.env.DB_SSL_REJECT_UNAUTHORIZED === "false") {
    ssl.rejectUnauthorized = false;
  }

  // Normalize PEM strings that may contain escaped newlines
  const normalize = (s: string) => s.replace(/\\n/g, "\n");

  if (process.env.DB_SSL_CA) ssl.ca = normalize(process.env.DB_SSL_CA);

  return ssl;
};

// Function to create DataSource with validation
export const createDataSource = () => {
  // Validate required environment variables
  const requiredEnvVars = [
    "DB_HOST",
    "DB_PORT",
    "DB_USERNAME",
    "DB_PASSWORD",
    "DB_DATABASE",
  ];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }

  return new DataSource({
    type: "mysql",
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!, 10),
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!,
    synchronize: process.env.NODE_ENV === "development",
    logging: process.env.NODE_ENV === "development",
    entities: [VehicleEntity, UserEntity],
    migrations: ["src/migrations/*.ts"],
    subscribers: ["src/subscribers/*.ts"],
  });
};

// Create DataSource instance
export const AppDataSource = createDataSource();

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established successfully");
  } catch (error) {
    console.error("Error during database initialization:", error);
    throw error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.destroy();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error closing database connection:", error);
    throw error;
  }
};
