import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import type { LoginRequest, LoginResponse } from "../types/common";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        // Remove default Content-Type for FormData to let axios set it to multipart/form-data
        if (config.data instanceof FormData) {
          delete config.headers["Content-Type"];
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle 401
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<any> = await this.client.post(
        "/api/auth/login",
        data
      );

      // Extract the actual login data from the nested response
      const loginData = response.data.data || response.data;
      return {
        token: loginData.accessToken || loginData.token,
        user: loginData.user,
      };
    } catch (error: any) {
      console.error(
        "ApiClient login error:",
        error.response?.data || error.message
      );

      // Try alternative endpoints if the first one fails
      if (error.response?.status === 404) {
        try {
          const altResponse: AxiosResponse<LoginResponse> =
            await this.client.post("/auth/login", data);
          return altResponse.data;
        } catch (altError: any) {
          console.error(
            "Alternative endpoint also failed:",
            altError.response?.data || altError.message
          );
        }

        try {
          const altResponse2: AxiosResponse<LoginResponse> =
            await this.client.post("/login", data);
          return altResponse2.data;
        } catch (altError2: any) {
          console.error(
            "Second alternative endpoint also failed:",
            altError2.response?.data || altError2.message
          );
        }
      }

      throw error;
    }
  }

  async logout(): Promise<void> {
    await this.client.post("/api/auth/logout");
  }

  // Generic methods
  async get<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url);
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url);
    return response.data;
  }
}

export const apiClient = new ApiClient();
