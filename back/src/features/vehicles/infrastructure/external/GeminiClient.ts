import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateVehicleDescription(vehicleData: {
    type: string;
    brand: string;
    modelName: string;
    color: string;
    engineSize: string;
    year: number;
    price: number;
  }): Promise<string> {
    try {
      console.log(
        "GeminiClient: Building prompt for vehicle data:",
        vehicleData
      );
      const prompt = this.buildDescriptionPrompt(vehicleData);
      console.log(
        "GeminiClient: Generated prompt:",
        prompt.substring(0, 200) + "..."
      );

      console.log("GeminiClient: Making API call to Gemini...");
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const description = response.text().trim();

      if (!description) {
        console.error("GeminiClient: No description in response");
        throw new Error("Failed to generate description from Gemini");
      }

      console.log("GeminiClient: Successfully extracted description");
      return description;
    } catch (error) {
      console.error("GeminiClient: API error:", error);
      throw new Error("Failed to generate vehicle description");
    }
  }

  private buildDescriptionPrompt(vehicleData: {
    type: string;
    brand: string;
    modelName: string;
    color: string;
    engineSize: string;
    year: number;
    price: number;
  }): string {
    return `Create an professional sales description for this vehicle:

Type: ${vehicleData.type}
Brand: ${vehicleData.brand}
Model: ${vehicleData.modelName}
Color: ${vehicleData.color}
Engine: ${vehicleData.engineSize}
Year: ${vehicleData.year}
Price: $${vehicleData.price.toLocaleString()}

Focus on:
- Key features and specifications
- Performance and reliability
- Style and design
- Value for money
- Why this is a great choice

Make it persuasive and appealing to potential buyers. Keep the description between 300-500 words.`;
  }
}
