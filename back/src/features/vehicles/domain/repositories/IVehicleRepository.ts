import { Vehicle } from "../entities/Vehicle";
import { VehicleType } from "@/shared/types/VehicleType";

export interface CreateVehicleData {
  type: VehicleType;
  brand: string;
  modelName: string;
  color: string;
  engineSize: string;
  year: number;
  price: number;
  images: string[];
  description: string;
}

export interface UpdateVehicleData {
  type?: VehicleType;
  brand?: string;
  modelName?: string;
  color?: string;
  engineSize?: string;
  year?: number;
  price?: number;
  images?: string[];
  description?: string;
}

export interface VehicleSearchFilters {
  type?: VehicleType;
  brand?: string;
  modelName?: string;
  color?: string;
  engineSize?: string;
  year?: number;
  yearMin?: number;
  yearMax?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface VehicleSearchResult {
  vehicles: Vehicle[];
  total: number;
  page: number;
  limit: number;
}

export interface IVehicleRepository {
  create(vehicleData: CreateVehicleData): Promise<Vehicle>;
  findById(id: string): Promise<Vehicle | null>;
  findAll(
    filters?: VehicleSearchFilters,
    page?: number,
    limit?: number
  ): Promise<VehicleSearchResult>;
  update(id: string, vehicleData: UpdateVehicleData): Promise<Vehicle | null>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
}
