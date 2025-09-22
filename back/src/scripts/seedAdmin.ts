import dotenv from "dotenv";

// Load environment variables FIRST
dotenv.config();

import bcrypt from "bcrypt";
import { AppDataSource } from "../config/database";
import { UserEntity } from "../features/auth/infrastructure/database/entities/UserEntity";

const seedAdmin = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected for seeding");

    const userRepository = AppDataSource.getRepository(UserEntity);

    // Check if admin user already exists
    const existingAdmin = await userRepository.findOne({
      where: { username: process.env.ADMIN_USERNAME || "admin" },
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      console.log(`Username: ${existingAdmin.username}`);
      console.log(`Password: ${process.env.ADMIN_PASSWORD}`);
      return;
    }

    // Create admin user
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    const adminUser = userRepository.create({
      username: process.env.ADMIN_USERNAME || "admin",
      passwordHash,
    });

    await userRepository.save(adminUser);
    console.log("Admin user created successfully");
    console.log(`Username: ${adminUser.username}`);
    console.log(`Password: ${adminPassword}`);
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    await AppDataSource.destroy();
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  seedAdmin();
}

export { seedAdmin };
