// src/services/userService.ts

import api from './api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  hourlyRate?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  success: boolean;
  data: User[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  hourlyRate?: number;
  active?: boolean;
}

const userService = {
  /**
   * Get all users (for dropdowns, filters, etc.)
   */
  async getUsers(params?: {
    active?: boolean;
    role?: string;
    search?: string;
  }): Promise<User[]> {
    // Note: This endpoint might not exist yet in your backend
    // You may need to add it or adapt based on your actual API
    try {
      const response = await api.get<UserListResponse>('/users', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback: return empty array or handle gracefully
      return [];
    }
  },

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ success: boolean; data: { user: User } }>('/auth/me');
    return response.data.data.user;
  },

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    const response = await api.get<{ success: boolean; data: User }>(`/users/${id}`);
    return response.data.data;
  },

  /**
   * Create a new user
   */
  async createUser(payload: CreateUserPayload): Promise<User> {
    const response = await api.post<{ success: boolean; data: User }>('/users', payload);
    return response.data.data;
  },
};

export default userService;