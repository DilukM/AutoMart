import { apiClient } from "./apiClient";
import {
  type Vehicle,
  type CreateVehicleRequest,
  type UpdateVehicleRequest,
  type PaginatedVehiclesResponse,
  type VehicleApiFilters,
} from "../types/common";

class VehicleService {
  async getVehicles(
    filters?: VehicleApiFilters
  ): Promise<PaginatedVehiclesResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await apiClient.get<any>(`/api/vehicles${query}`);

    // Debug logging to see the actual response structure
   
    // API response format: { success: true, data: [...], pagination: {...} }
    // Try different possible structures
    const vehicles = response.data?.vehicles || response.data || [];
    const pagination = response.data?.pagination || response.data || {};

   
    return {
      vehicles: Array.isArray(vehicles) ? vehicles : [],
      total: pagination?.total || 0,
      page: pagination?.page || 1,
      limit: pagination?.limit || 10,
      totalPages: pagination?.totalPages || 0,
    };
  }

  async getVehicleById(id: string): Promise<Vehicle> {
    const response = await apiClient.get<any>(`/api/vehicles/${id}`);
    return response.data?.data || response.data || response;
  }

  async createVehicle(
    vehicle: CreateVehicleRequest | FormData
  ): Promise<Vehicle> {
    return apiClient.post<Vehicle>("/api/vehicles", vehicle);
  }

  async updateVehicle(vehicle: UpdateVehicleRequest): Promise<Vehicle> {
    const { id, ...updateData } = vehicle;
    return apiClient.put<Vehicle>(`/api/vehicles/${id}`, updateData);
  }

  async deleteVehicle(id: string): Promise<void> {
    return apiClient.delete(`/api/vehicles/${id}`);
  }

  async generateDescription(vehicleData: {
    type: string;
    brand: string;
    modelName: string;
    color: string;
    engineSize: string;
    year: number;
    price: number;
  }): Promise<any> {
    const response = await apiClient.post(
      "/api/vehicles/generate-description",
      vehicleData
    );
    return response;
  }
}

export const vehicleService = new VehicleService();
