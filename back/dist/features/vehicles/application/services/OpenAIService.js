"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIService = void 0;
const OpenAIClient_1 = require("../../infrastructure/external/OpenAIClient");
class OpenAIService {
    constructor(apiKey) {
        this.openAIClient = new OpenAIClient_1.OpenAIClient(apiKey);
    }
    async generateVehicleDescription(vehicleData) {
        try {
            const vehicleDataForPrompt = {
                ...vehicleData,
                type: vehicleData.type.toString()
            };
            const description = await this.openAIClient.generateVehicleDescription(vehicleDataForPrompt);
            return description;
        }
        catch (error) {
            console.error('Error generating vehicle description:', error);
            return this.generateFallbackDescription(vehicleData);
        }
    }
    generateFallbackDescription(vehicleData) {
        const { type, brand, modelName, color, engineSize, year, price } = vehicleData;
        return `Discover this exceptional ${year} ${brand} ${modelName} in stunning ${color}. ` +
            `Powered by a ${engineSize} engine, this ${type.toLowerCase()} offers outstanding performance and reliability. ` +
            `Priced at $${price.toLocaleString()}, it represents excellent value for money. ` +
            `Contact us today to schedule a test drive and experience the quality and craftsmanship firsthand.`;
    }
    async regenerateDescription(vehicleData, customPrompt) {
        if (customPrompt) {
            return this.generateVehicleDescription(vehicleData);
        }
        return this.generateVehicleDescription(vehicleData);
    }
    isConfigured() {
        return !!process.env.OPENAI_API_KEY;
    }
}
exports.OpenAIService = OpenAIService;
//# sourceMappingURL=OpenAIService.js.map