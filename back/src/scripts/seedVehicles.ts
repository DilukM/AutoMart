import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

import { AppDataSource, initializeDatabase } from '../config/database';
import { VehicleService } from '../features/vehicles/application/services/VehicleService';
import { VehicleRepository } from '../features/vehicles/infrastructure/database/repositories/VehicleRepository';
import { OpenAIService } from '../features/vehicles/application/services/OpenAIService';
import { GeminiService } from '../features/vehicles/application/services/GeminiService';
import { VehicleEntity } from '../features/vehicles/infrastructure/database/entities/VehicleEntity';
import { VehicleType } from '../shared/types/VehicleType';

// Sample vehicle data - using proper VehicleType enum values
const vehicleData = [
  {
    type: VehicleType.CAR,
    brand: 'Toyota',
    modelName: 'Camry',
    color: 'Silver',
    engineSize: '2.5L',
    year: 2020,
    price: 25000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Reliable sedan with excellent fuel economy and modern features.'
  },
  {
    type: VehicleType.CAR,
    brand: 'Honda',
    modelName: 'Civic',
    color: 'Blue',
    engineSize: '2.0L',
    year: 2019,
    price: 22000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Compact car perfect for city driving with great handling.'
  },
  {
    type: VehicleType.TRUCK,
    brand: 'Ford',
    modelName: 'F-150',
    color: 'Black',
    engineSize: '3.5L',
    year: 2021,
    price: 35000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Powerful pickup truck with impressive towing capacity.'
  },
  {
    type: VehicleType.CAR,
    brand: 'BMW',
    modelName: '3 Series',
    color: 'White',
    engineSize: '2.0L',
    year: 2022,
    price: 45000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Luxury sedan with sporty performance and premium interior.'
  },
  {
    type: VehicleType.BIKE,
    brand: 'Harley-Davidson',
    modelName: 'Sportster',
    color: 'Red',
    engineSize: '1.2L',
    year: 2018,
    price: 12000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Classic cruiser motorcycle with iconic design.'
  },
  {
    type: VehicleType.CAR,
    brand: 'Nissan',
    modelName: 'Altima',
    color: 'Gray',
    engineSize: '2.5L',
    year: 2021,
    price: 24000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Comfortable sedan with advanced safety features.'
  },
  {
    type: VehicleType.TRUCK,
    brand: 'Chevrolet',
    modelName: 'Silverado',
    color: 'Blue',
    engineSize: '5.3L',
    year: 2020,
    price: 32000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Versatile truck ideal for work and recreation.'
  },
  {
    type: VehicleType.CAR,
    brand: 'Mercedes-Benz',
    modelName: 'C-Class',
    color: 'Black',
    engineSize: '2.0L',
    year: 2023,
    price: 50000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Elegant luxury car with cutting-edge technology.'
  },
  {
    type: VehicleType.BIKE,
    brand: 'Yamaha',
    modelName: 'YZF-R3',
    color: 'Green',
    engineSize: '0.3L',
    year: 2019,
    price: 8000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Sporty motorcycle for thrilling rides.'
  },
  {
    type: VehicleType.CAR,
    brand: 'Ford',
    modelName: 'Mustang',
    color: 'Red',
    engineSize: '5.0L',
    year: 2022,
    price: 55000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Iconic muscle car with powerful engine.'
  },
  {
    type: VehicleType.TRUCK,
    brand: 'Ram',
    modelName: '1500',
    color: 'White',
    engineSize: '3.6L',
    year: 2021,
    price: 38000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Reliable truck with spacious cabin.'
  },
  {
    type: VehicleType.CAR,
    brand: 'Audi',
    modelName: 'A4',
    color: 'Silver',
    engineSize: '2.0L',
    year: 2020,
    price: 42000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Premium sedan with superior handling.'
  },
  {
    type: VehicleType.BIKE,
    brand: 'Kawasaki',
    modelName: 'Ninja 400',
    color: 'Black',
    engineSize: '0.4L',
    year: 2022,
    price: 10000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Agile sportbike for urban commuting.'
  },
  {
    type: VehicleType.CAR,
    brand: 'Hyundai',
    modelName: 'Elantra',
    color: 'Blue',
    engineSize: '2.0L',
    year: 2019,
    price: 20000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Affordable sedan with warranty and comfort.'
  },
  {
    type: VehicleType.TRUCK,
    brand: 'GMC',
    modelName: 'Sierra',
    color: 'Red',
    engineSize: '6.2L',
    year: 2023,
    price: 45000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Heavy-duty truck for demanding tasks.'
  },
  {
    type: VehicleType.CAR,
    brand: 'Lexus',
    modelName: 'ES',
    color: 'White',
    engineSize: '3.5L',
    year: 2021,
    price: 48000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Luxurious sedan with hybrid efficiency.'
  },
  {
    type: VehicleType.BIKE,
    brand: 'Ducati',
    modelName: 'Monster',
    color: 'Yellow',
    engineSize: '0.8L',
    year: 2020,
    price: 15000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Stylish naked bike with Italian flair.'
  },
  {
    type: VehicleType.CAR,
    brand: 'Mazda',
    modelName: 'Mazda3',
    color: 'Gray',
    engineSize: '2.5L',
    year: 2022,
    price: 26000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Fun-to-drive hatchback with great fuel economy.'
  },
  {
    type: VehicleType.TRUCK,
    brand: 'Toyota',
    modelName: 'Tacoma',
    color: 'Green',
    engineSize: '3.5L',
    year: 2020,
    price: 33000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Compact truck with off-road capability.'
  },
  {
    type: VehicleType.CAR,
    brand: 'Volkswagen',
    modelName: 'Golf',
    color: 'Black',
    engineSize: '1.4L',
    year: 2018,
    price: 18000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Hatchback with practical design and efficiency.'
  },
  {
    type: VehicleType.BIKE,
    brand: 'Suzuki',
    modelName: 'GSX-R600',
    color: 'Blue',
    engineSize: '0.6L',
    year: 2021,
    price: 13000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'High-performance supersport motorcycle.'
  },
  {
    type: VehicleType.CAR,
    brand: 'Subaru',
    modelName: 'Impreza',
    color: 'Red',
    engineSize: '2.0L',
    year: 2019,
    price: 23000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'All-wheel-drive sedan for all-weather driving.'
  },
  {
    type: VehicleType.TRUCK,
    brand: 'Nissan',
    modelName: 'Titan',
    color: 'Silver',
    engineSize: '3.5L',
    year: 2022,
    price: 36000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Full-size truck with strong payload capacity.'
  },
  {
    type: VehicleType.CAR,
    brand: 'Tesla',
    modelName: 'Model 3',
    color: 'Pearl White',
    engineSize: 'Electric',
    year: 2023,
    price: 60000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Electric sedan with autopilot and long range.'
  },
  {
    type: VehicleType.BIKE,
    brand: 'Honda',
    modelName: 'CBR500R',
    color: 'Orange',
    engineSize: '0.5L',
    year: 2020,
    price: 9000.00,
    images: ['https://res.cloudinary.com/dvboumpup/image/upload/v1758542189/automart/1758542183618-_New%20Sedans%20%20Sports%20Cars%20Web%20Resized%20%20Watermarked._008.jpeg.jpg'],
    description: 'Beginner-friendly sportbike with balanced performance.'
  },
];

async function seedVehicles() {
  try {
    // Initialize database connection
    await initializeDatabase();
    console.log('Database connected successfully');

    // Initialize services
    const vehicleRepository = new VehicleRepository(AppDataSource.getRepository(VehicleEntity));

    // Initialize AI service based on configuration
    let aiService;
    const aiServiceType = process.env.AI_SERVICE?.toLowerCase();

    if (aiServiceType === 'gemini' && process.env.GEMINI_API_KEY) {
      aiService = new GeminiService();
      console.log('Using Gemini AI service for seeding');
    } else if (aiServiceType === 'openai' && process.env.OPENAI_API_KEY) {
      aiService = new OpenAIService();
      console.log('Using OpenAI service for seeding');
    } else if (process.env.OPENAI_API_KEY) {
      aiService = new OpenAIService();
      console.log('Using OpenAI service (fallback) for seeding');
    } else {
      console.log('No AI service configured for seeding');
    }

    const vehicleService = new VehicleService(vehicleRepository, aiService);

    console.log(`Starting bulk vehicle creation for ${vehicleData.length} vehicles...`);

    let successCount = 0;
    let errorCount = 0;

    // Process vehicles in batches to avoid overwhelming the database
    const batchSize = 10;
    for (let i = 0; i < vehicleData.length; i += batchSize) {
      const batch = vehicleData.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1} (${batch.length} vehicles)...`);

      const batchPromises = batch.map(async (data, index) => {
        try {
          const vehicle = await vehicleService.createVehicle(data);
          console.log(`✅ Created: ${data.brand} ${data.modelName} (ID: ${vehicle.id})`);
          return { success: true, vehicle };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error(`❌ Failed to create ${data.brand} ${data.modelName}:`, errorMessage);
          return { success: false, error: errorMessage };
        }
      });

      const results = await Promise.all(batchPromises);
      successCount += results.filter(r => r.success).length;
      errorCount += results.filter(r => !r.success).length;

      // Small delay between batches to be gentle on the database
      if (i + batchSize < vehicleData.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`\n🎉 Bulk seeding completed!`);
    console.log(`✅ Successfully created: ${successCount} vehicles`);
    console.log(`❌ Failed to create: ${errorCount} vehicles`);

  } catch (error) {
    console.error('❌ Error during vehicle seeding:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await AppDataSource.destroy();
    process.exit(0);
  }
}

// Run the seeding script
seedVehicles();