import { IVehicleRepository, CreateVehicleData, UpdateVehicleData, VehicleSearchFilters, VehicleSearchResult } from '@/features/vehicles/domain/repositories/IVehicleRepository';
import { Vehicle } from '@/features/vehicles/domain/entities/Vehicle';

export class InMemoryVehicleRepository implements IVehicleRepository {
  private vehicles: Map<string, Vehicle> = new Map();

  async create(data: CreateVehicleData): Promise<Vehicle> {
    const v = Vehicle.create(
      data.type,
      data.brand,
      data.modelName,
      data.color,
      data.engineSize,
      data.year,
      data.price,
      data.images,
      data.description
    );
    this.vehicles.set(v.id, v);
    return v;
  }

  async findById(id: string): Promise<Vehicle | null> {
    return this.vehicles.get(id) ?? null;
  }

  async findAll(filters: VehicleSearchFilters = {}, page = 1, limit = 10): Promise<VehicleSearchResult> {
    let list = Array.from(this.vehicles.values());
    list = list.filter(v => {
      return (
        (filters.type ? v.type === filters.type : true) &&
        (filters.brand ? v.brand === filters.brand : true) &&
        (filters.modelName ? v.modelName === filters.modelName : true) &&
        (filters.color ? v.color === filters.color : true) &&
        (filters.engineSize ? v.engineSize === filters.engineSize : true) &&
        (filters.year ? v.year === filters.year : true) &&
        (filters.minPrice ? v.price >= filters.minPrice : true) &&
        (filters.maxPrice ? v.price <= filters.maxPrice : true)
      );
    });
    const total = list.length;
    const start = (page - 1) * limit;
    const vehicles = list.slice(start, start + limit);
    return { vehicles, total, page, limit };
  }

  async update(id: string, data: UpdateVehicleData): Promise<Vehicle | null> {
    const existing = this.vehicles.get(id);
    if (!existing) return null;
    const updated = existing.update(
      data.type,
      data.brand,
      data.modelName,
      data.color,
      data.engineSize,
      data.year,
      data.price,
      data.images,
      data.description
    );
    this.vehicles.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.vehicles.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.vehicles.has(id);
  }
}
