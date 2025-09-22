import OpenAI from "openai";

export class OpenAIClient {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey: apiKey,
    });
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
        "OpenAIClient: Building prompt for vehicle data:",
        vehicleData
      );
      const prompt = this.buildDescriptionPrompt(vehicleData);
      console.log(
        "OpenAIClient: Generated prompt:",
        prompt.substring(0, 200) + "..."
      );

      console.log("OpenAIClient: Making API call to OpenAI...");
      const response = await this.client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a professional car salesperson. Create engaging, persuasive vehicle descriptions that highlight key features and appeal to potential buyers. Keep descriptions between 100-200 words.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      console.log("OpenAIClient: Received response from OpenAI");
      const description = response.choices[0]?.message?.content?.trim();

      if (!description) {
        console.error("OpenAIClient: No description in response");
        throw new Error("Failed to generate description from OpenAI");
      }

      console.log("OpenAIClient: Successfully extracted description");
      return description;
    } catch (error) {
      console.error("OpenAIClient: API error:", error);
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
    return `Create an engaging sales description for this vehicle:

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

Make it persuasive and appealing to potential buyers.`;
  }
}
