import { Repository } from 'typeorm';
import { VehicleEntity } from '../entities/VehicleEntity';
import { Vehicle } from '../../../domain/entities/Vehicle';
import { IVehicleRepository, CreateVehicleData, UpdateVehicleData, VehicleSearchFilters, VehicleSearchResult } from '../../../domain/repositories/IVehicleRepository';
export declare class VehicleRepository implements IVehicleRepository {
    private readonly vehicleRepository;
    constructor(vehicleRepository: Repository<VehicleEntity>);
    create(vehicleData: CreateVehicleData): Promise<Vehicle>;
    findById(id: string): Promise<Vehicle | null>;
    findAll(filters?: VehicleSearchFilters, page?: number, limit?: number): Promise<VehicleSearchResult>;
    update(id: string, vehicleData: UpdateVehicleData): Promise<Vehicle | null>;
    delete(id: string): Promise<boolean>;
    exists(id: string): Promise<boolean>;
    private mapEntityToDomain;
}
//# sourceMappingURL=VehicleRepository.d.ts.map