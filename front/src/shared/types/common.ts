export type VehicleType = 'Car' | 'Bike' | 'SUV' | 'Truck' | 'Van' | 'Electric' | 'Hybrid';

export interface Vehicle {
  id: string;
  type: VehicleType;
  brand: string;
  modelName: string;
  color: string;
  engineSize: string;
  year: number;
  price: number;
  images: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreateVehicleRequest {
  type: VehicleType;
  brand: string;
  modelName: string;
  color: string;
  engineSize: string;
  year: number;
  price: number;
  images: File[];
  description?: string; // Will be generated if not provided
}

export interface UpdateVehicleRequest extends Partial<CreateVehicleRequest> {
  id: string;
  imagesToRemove?: string[];
}

export interface VehicleFilters {
  type?: VehicleType;
  brand?: string;
  modelName?: string;
  color?: string;
  engineSize?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
}