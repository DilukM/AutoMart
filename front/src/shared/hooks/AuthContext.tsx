import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type User, type LoginRequest } from "../types/common";
import { apiClient } from "../services/apiClient";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and user on mount
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      console.log("AuthContext login called with:", credentials);
      const response = await apiClient.login(credentials);
      console.log("Login API response:", response);

      // Handle different possible response structures
      const responseData = response as any; // Type assertion for flexibility
      const token = responseData.token || responseData.accessToken;
      const user = responseData.user;

      console.log("AuthContext login - extracted token:", token);
      console.log("AuthContext login - extracted user:", user);

      if (!token || !user) {
        throw new Error("Invalid response structure from login API");
      }

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      console.log("AuthContext login - setting user state:", user);
      setUser(user);
      console.log("AuthContext login - user state updated successfully");
      console.log("User state set, isAuthenticated should be true");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };

  console.log("AuthContext render - user:", user, "isAuthenticated:", !!user);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
