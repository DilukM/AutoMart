import { OpenAIClient } from "../../infrastructure/external/OpenAIClient";
import { IAIService, VehicleDescriptionData } from "./IAIService";

// Re-export for backward compatibility
export { VehicleDescriptionData };

export class OpenAIService implements IAIService {
  private openAIClient: OpenAIClient;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OpenAI API key not found in environment variables");
    }
    this.openAIClient = new OpenAIClient(apiKey);
  }

  async generateVehicleDescription(
    vehicleData: VehicleDescriptionData
  ): Promise<string> {
    try {
      // Convert VehicleType enum to string for the prompt
      const vehicleDataForPrompt = {
        ...vehicleData,
        type: vehicleData.type.toString(),
      };

      const description = await this.openAIClient.generateVehicleDescription(
        vehicleDataForPrompt
      );

      return description;
    } catch (error) {
      console.error(
        "OpenAIService: Error generating vehicle description with OpenAI:",
        error
      );

      // Fallback description if OpenAI fails
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
      // If custom prompt is provided, we could extend the OpenAI client to handle custom prompts
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
