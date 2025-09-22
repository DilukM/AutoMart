import { apiClient } from "./apiClient";
import {
  type User,
  type LoginRequest,
  type LoginResponse,
} from "../types/common";

class UserService {
  async getUsers(): Promise<User[]> {
    const response = await apiClient.get<any>("/api/auth/users");
    return response.data || response.users || [];
  }

  async registerUser(userData: LoginRequest): Promise<User> {
    return apiClient.post<User>("/api/auth/register", userData);
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/api/auth/login", credentials);
  }

  async deleteUser(id: string): Promise<void> {
    return apiClient.delete(`/api/auth/${id}`);
  }
}

export const userService = new UserService();
