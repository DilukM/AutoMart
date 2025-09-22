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

export interface IAIService {
  generateVehicleDescription(vehicleData: VehicleDescriptionData): Promise<string>;
  regenerateDescription(vehicleData: VehicleDescriptionData, customPrompt?: string): Promise<string>;
  isConfigured(): boolean;
}