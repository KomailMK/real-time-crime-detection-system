const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
  [key: string]: any;
}

let backendAvailable: boolean | null = null;

export async function checkBackendAvailable(): Promise<boolean> {
  if (backendAvailable !== null) {
    return backendAvailable;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    });
    backendAvailable = response.ok;
    return backendAvailable;
  } catch {
    backendAvailable = false;
    return false;
  }
}

export async function apiCall<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: Record<string, any>
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const data = await response.json();
        errorMessage = data.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.log(`[v0] API Error [${method} ${endpoint}]: ${errorMessage}`);
    throw error;
  }
}

// Auth endpoints
export const authApi = {
  requestSignupCode: (userData: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    property_type?: string;
  }) => apiCall('/api/auth/request-signup-code', 'POST', userData),

  verifySignupCode: (email: string, code: string) =>
    apiCall('/api/auth/verify-signup-code', 'POST', { email, code }),

  requestLoginCode: (email: string) =>
    apiCall('/api/auth/request-login-code', 'POST', { email }),

  verifyLoginCode: (email: string, code: string) =>
    apiCall('/api/auth/verify-login-code', 'POST', { email, code }),

  getMe: () => apiCall('/api/users/me', 'GET'),

  updateMe: (userData: Record<string, any>) =>
    apiCall('/api/users/me', 'PUT', userData),

  logout: () => apiCall('/api/auth/logout', 'POST'),
};

// Camera endpoints
export const cameraApi = {
  getAll: () => apiCall('/api/cameras', 'GET'),

  add: (cameraData: {
    camera_id: string;
    name: string;
    stream_url: string;
    location?: string;
  }) => apiCall('/api/cameras', 'POST', cameraData),

  update: (id: number, cameraData: Record<string, any>) =>
    apiCall(`/api/cameras/${id}`, 'PUT', cameraData),

  delete: (id: number) => apiCall(`/api/cameras/${id}`, 'DELETE'),
};

// Incident endpoints
export const incidentApi = {
  getAll: (params?: {
    limit?: number;
    page?: number;
    camera_id?: number;
    type?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.page) query.append('page', params.page.toString());
    if (params?.camera_id) query.append('camera_id', params.camera_id.toString());
    if (params?.type) query.append('type', params.type);
    return apiCall(`/api/incidents${query.toString() ? `?${query}` : ''}`, 'GET');
  },
};

// Alert endpoints
export const alertApi = {
  getAll: (params?: { limit?: number; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.page) query.append('page', params.page.toString());
    return apiCall(`/api/alerts${query.toString() ? `?${query}` : ''}`, 'GET');
  },
};

// Health check
export const healthApi = {
  check: () => apiCall('/api/admin/health', 'GET'),
};
