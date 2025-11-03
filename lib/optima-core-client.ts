/**
 * Optima-Core TypeScript API Client
 * Connects R3AL app to Optima-Core Python backend
 */

import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { OPTIMA_CORE_BASE_URL } from "@/app/config/optima-core";

export interface OptimaHealthResponse {
  status: string;
  service: string;
  timestamp: string;
  gcp_connection?: boolean;
  vertex_ai?: boolean;
}

export interface OptimaPulseData {
  userId: string;
  timestamp?: string;
  mood?: string;
  activity?: string;
  location?: string;
  interactions?: number;
  metadata?: Record<string, any>;
}

export interface OptimaPulseResponse {
  success: boolean;
  message: string;
  pulseId?: string;
  timestamp?: string;
}

export interface OptimaAuthRegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface OptimaAuthLoginRequest {
  email: string;
  password: string;
}

export interface OptimaAuthResponse {
  success: boolean;
  token?: string;
  userId?: string;
  message?: string;
}

export interface OptimaHiveData {
  userId: string;
  connections: string[];
  timestamp?: string;
  graphData?: Record<string, any>;
}

export interface OptimaHiveResponse {
  success: boolean;
  message: string;
  hiveId?: string;
}

export interface OptimaNFTData {
  userId: string;
  nftType: string;
  metadata: Record<string, any>;
  credentialData?: Record<string, any>;
}

export interface OptimaNFTResponse {
  success: boolean;
  message: string;
  nftId?: string;
  tokenUri?: string;
}

/**
 * Optima-Core API Client Class
 */
class OptimaCoreClient {
  private client: AxiosInstance;

  constructor(baseURL: string = OPTIMA_CORE_BASE_URL) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    console.log("[Optima-Core Client] Initialized with URL:", baseURL);

    // Request interceptor for auth token
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available (implement token storage)
        const token = this.getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`[Optima-Core] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error("[Optima-Core] Request error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[Optima-Core] Response:`, response.status, response.data);
        return response;
      },
      (error) => {
        console.error("[Optima-Core] Response error:", error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  private getStoredToken(): string | null {
    // Implement token retrieval from secure storage
    // For now, return null - integrate with AuthContext later
    return null;
  }

  /**
   * Health Check
   */
  async health(): Promise<OptimaHealthResponse> {
    const response = await this.client.get<OptimaHealthResponse>("/health");
    return response.data;
  }

  /**
   * Root endpoint
   */
  async root(): Promise<{ message: string; service: string }> {
    const response = await this.client.get("/");
    return response.data;
  }

  /**
   * Pulse - Log user activity and behavioral data
   */
  async logPulse(data: OptimaPulseData): Promise<OptimaPulseResponse> {
    const response = await this.client.post<OptimaPulseResponse>("/pulse", data);
    return response.data;
  }

  /**
   * Auth - Register new user
   */
  async register(data: OptimaAuthRegisterRequest): Promise<OptimaAuthResponse> {
    const response = await this.client.post<OptimaAuthResponse>("/auth/register", data);
    return response.data;
  }

  /**
   * Auth - Login user
   */
  async login(data: OptimaAuthLoginRequest): Promise<OptimaAuthResponse> {
    const response = await this.client.post<OptimaAuthResponse>("/auth/login", data);
    return response.data;
  }

  /**
   * Hive - Submit user graph/network data
   */
  async submitHiveData(data: OptimaHiveData): Promise<OptimaHiveResponse> {
    const response = await this.client.post<OptimaHiveResponse>("/hive", data);
    return response.data;
  }

  /**
   * Market - Create NFT credential
   */
  async createNFT(data: OptimaNFTData): Promise<OptimaNFTResponse> {
    const response = await this.client.post<OptimaNFTResponse>("/market/nft", data);
    return response.data;
  }

  /**
   * Custom request method for future endpoints
   */
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.client.request<T>(config);
    return response.data;
  }
}

// Export singleton instance
export const optimaCoreClient = new OptimaCoreClient();

// Export class for custom instances
export { OptimaCoreClient };
