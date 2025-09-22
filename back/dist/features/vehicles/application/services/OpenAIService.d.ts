import { VehicleType } from "@/shared/types/VehicleType";
export interface VehicleDescriptionData {
    type: VehicleType;
    brand: string;
    modelName: string;
    color: string;
    engineSize: string;
    year: number;
    price: number;
}
export declare class OpenAIService {
    private openAIClient;
    constructor(apiKey: string);
    generateVehicleDescription(vehicleData: VehicleDescriptionData): Promise<string>;
    private generateFallbackDescription;
    regenerateDescription(vehicleData: VehicleDescriptionData, customPrompt?: string): Promise<string>;
    isConfigured(): boolean;
}
//# sourceMappingURL=OpenAIService.d.ts.map