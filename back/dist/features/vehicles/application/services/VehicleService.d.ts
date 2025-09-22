import { Vehicle } from "../../domain/entities/Vehicle";
import { IVehicleRepository, CreateVehicleData, UpdateVehicleData, VehicleSearchFilters, VehicleSearchResult } from "../../domain/repositories/IVehicleRepository";
import { OpenAIService } from "./OpenAIService";
export declare class VehicleService {
    private readonly vehicleRepository;
    private readonly openAIService?;
    constructor(vehicleRepository: IVehicleRepository, openAIService?: OpenAIService | undefined);
    createVehicle(vehicleData: CreateVehicleData): Promise<Vehicle>;
    getVehicleById(id: string): Promise<Vehicle | null>;
    getAllVehicles(filters?: VehicleSearchFilters, page?: number, limit?: number): Promise<VehicleSearchResult>;
    updateVehicle(id: string, vehicleData: UpdateVehicleData): Promise<Vehicle | null>;
    deleteVehicle(id: string): Promise<boolean>;
    regenerateVehicleDescription(id: string, customDescription?: string): Promise<Vehicle | null>;
    private validateVehicleData;
    private validatePartialVehicleData;
}
//# sourceMappingURL=VehicleService.d.ts.map