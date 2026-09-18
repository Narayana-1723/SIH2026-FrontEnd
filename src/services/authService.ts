import { apiClient, IS_DEMO_MODE, simulateLatency } from './api';
import { LoginCredentials, AuthResponse } from '../types/auth';
import { User } from '../types/user';
import { DEMO_USERS } from '../data/demoData';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    if (IS_DEMO_MODE) {
      await simulateLatency(400);
      // Check demo credentials or fallback to matched role
      const isEmail = credentials.username.includes('@');
      let matched = DEMO_USERS.find(
        (u) =>
          (isEmail && u.email.toLowerCase() === credentials.username.toLowerCase()) ||
          (!isEmail && u.employeeId.toLowerCase() === credentials.username.toLowerCase())
      );

      // If no exact match, assign User or Admin based on username keyword
      if (!matched) {
        if (credentials.username.toLowerCase().includes('admin')) {
          matched = DEMO_USERS[1]; // Admin
        } else {
          matched = DEMO_USERS[0]; // Regular CPSE User
        }
      }

      const dummyToken = `demo_jwt_token_${matched.id}_${Date.now()}`;
      localStorage.setItem('cpse_auth_token', dummyToken);
      localStorage.setItem('cpse_auth_user', JSON.stringify(matched));

      return {
        token: dummyToken,
        user: matched,
      };
    }

    // Production Spring Boot REST call: POST /api/auth/login
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('cpse_auth_token', response.data.token);
      localStorage.setItem('cpse_auth_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    if (IS_DEMO_MODE) {
      const stored = localStorage.getItem('cpse_auth_user');
      if (stored) {
        return JSON.parse(stored);
      }
      return DEMO_USERS[0];
    }

    // Production Spring Boot REST call: GET /api/auth/me
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      if (!IS_DEMO_MODE) {
        await apiClient.post('/auth/logout');
      }
    } finally {
      localStorage.removeItem('cpse_auth_token');
      localStorage.removeItem('cpse_auth_user');
    }
  },
};
