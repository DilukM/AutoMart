"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIClient = void 0;
const openai_1 = __importDefault(require("openai"));
class OpenAIClient {
    constructor(apiKey) {
        this.client = new openai_1.default({
            apiKey: apiKey,
        });
    }
    async generateVehicleDescription(vehicleData) {
        try {
            const prompt = this.buildDescriptionPrompt(vehicleData);
            const response = await this.client.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional car salesperson. Create engaging, persuasive vehicle descriptions that highlight key features and appeal to potential buyers. Keep descriptions between 100-200 words.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 300,
                temperature: 0.7,
            });
            const description = response.choices[0]?.message?.content?.trim();
            if (!description) {
                throw new Error('Failed to generate description from OpenAI');
            }
            return description;
        }
        catch (error) {
            console.error('OpenAI API error:', error);
            throw new Error('Failed to generate vehicle description');
        }
    }
    buildDescriptionPrompt(vehicleData) {
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
exports.OpenAIClient = OpenAIClient;
//# sourceMappingURL=OpenAIClient.js.map