import { GeminiClient } from "../../infrastructure/external/GeminiClient";
import { IAIService, VehicleDescriptionData } from "./IAIService";

export class GeminiService implements IAIService {
  private geminiClient: GeminiClient;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("GeminiService constructor called");
    console.log("GEMINI_API_KEY exists:", !!apiKey);
    console.log("GEMINI_API_KEY length:", apiKey ? apiKey.length : 0);
    if (!apiKey) {
      throw new Error('Gemini API key not found in environment variables');
    }
    this.geminiClient = new GeminiClient(apiKey);
    console.log("GeminiService initialized successfully");
  }

  async generateVehicleDescription(
    vehicleData: VehicleDescriptionData
  ): Promise<string> {
    try {
      console.log('GeminiService: Starting to generate description for:', vehicleData);

      // Convert VehicleType enum to string for the prompt
      const vehicleDataForPrompt = {
        ...vehicleData,
        type: vehicleData.type.toString(),
      };

      console.log('GeminiService: Calling Gemini client with data:', vehicleDataForPrompt);

      const description = await this.geminiClient.generateVehicleDescription(
        vehicleDataForPrompt
      );

      console.log('GeminiService: Successfully generated description from Gemini:', description.substring(0, 100) + '...');
      return description;
    } catch (error) {
      console.error("GeminiService: Error generating vehicle description with Gemini:", error);
      console.log("GeminiService: Falling back to predefined description");

      // Fallback description if Gemini fails
      return this.generateFallbackDescription(vehicleData);
    }
  }

  private generateFallbackDescription(
    vehicleData: VehicleDescriptionData
  ): string {
    const { type, brand, modelName, color, engineSize, year, price } =
      vehicleData;

    return (
      `Discover this exceptional ${year} ${brand} ${modelName} in stunning ${color}. ` +
      `Powered by a ${engineSize} engine, this ${type.toLowerCase()} offers outstanding performance and reliability. ` +
      `Priced at $${price.toLocaleString()}, it represents excellent value for money. ` +
      `Contact us today to schedule a test drive and experience the quality and craftsmanship firsthand.`
    );
  }

  async regenerateDescription(
    vehicleData: VehicleDescriptionData,
    customPrompt?: string
  ): Promise<string> {
    if (customPrompt) {
      // If custom prompt is provided, we could extend the Gemini client to handle custom prompts
      // For now, we'll use the standard generation
      return this.generateVehicleDescription(vehicleData);
    }

    return this.generateVehicleDescription(vehicleData);
  }

  isConfigured(): boolean {
    // Since the constructor throws if API key is missing, this will always return true if the service was created
    return true;
  }
}