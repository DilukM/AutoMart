import { config } from "dotenv";

// Load environment variables first
config();

import { AppDataSource } from "../config/database";

async function addIsFeaturedColumn() {
  try {
    await AppDataSource.initialize();
    
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    // Check if column already exists
    const result = await queryRunner.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='vehicles' AND column_name='isFeatured'
    `);

    if (result.length === 0) {
      // Add the isFeatured column with default value false
      await queryRunner.query(`
        ALTER TABLE vehicles 
        ADD COLUMN isFeatured BOOLEAN DEFAULT FALSE
      `);
      
      console.log("Successfully added isFeatured column to vehicles table");
    } else {
      console.log("isFeatured column already exists");
    }

    await queryRunner.release();
    await AppDataSource.destroy();
  } catch (error) {
    console.error("Error adding isFeatured column:", error);
    process.exit(1);
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  addIsFeaturedColumn();
}

export { addIsFeaturedColumn };