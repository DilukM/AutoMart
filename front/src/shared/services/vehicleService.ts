import { apiClient } from "./apiClient";
import {
  type Vehicle,
  type CreateVehicleRequest,
  type UpdateVehicleRequest,
  type VehicleFilters,
} from "../types/common";

class VehicleService {
  async getVehicles(filters?: VehicleFilters): Promise<Vehicle[]> {
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
    return response.data?.vehicles || response.vehicles || [];
  }

  async getVehicleById(id: string): Promise<Vehicle> {
    const response = await apiClient.get<any>(`/api/vehicles/${id}`);
    return response.data?.data || response.data || response;
  }

  async createVehicle(vehicle: CreateVehicleRequest | FormData): Promise<Vehicle> {
    console.log("VehicleService: Creating vehicle");
    if (vehicle instanceof FormData) {
      console.log("Sending FormData:");
      for (const [key, value] of vehicle.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
    } else {
      console.log("Sending JSON data:", vehicle);
    }
    return apiClient.post<Vehicle>("/api/vehicles", vehicle);
  }

  async updateVehicle(vehicle: UpdateVehicleRequest): Promise<Vehicle> {
    const { id, ...updateData } = vehicle;
    return apiClient.put<Vehicle>(`/api/vehicles/${id}`, updateData);
  }

  async deleteVehicle(id: string): Promise<void> {
    return apiClient.delete(`/api/vehicles/${id}`);
  }

  async regenerateDescription(id: string): Promise<Vehicle> {
    return apiClient.post<Vehicle>(
      `/api/vehicles/${id}/regenerate-description`
    );
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
