// API client for backend communication

// Use relative URL to work with proxy
const API_BASE_URL = '/api/v1';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiClient {
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.text();
        return {
          success: false,
          error: error || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Task control endpoints
  async stopTask(): Promise<ApiResponse> {
    return this.request('/stop-task', {
      method: 'PUT',
    });
  }

  async pauseTask(): Promise<ApiResponse> {
    return this.request('/pause-task', {
      method: 'PUT',
    });
  }

  async resumeTask(): Promise<ApiResponse> {
    return this.request('/resume-task', {
      method: 'PUT',
    });
  }
}

export const api = new ApiClient();