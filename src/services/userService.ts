import api from './api';
import type { User } from '../types';

export interface UserFilters {
  active?: boolean;
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}

class UserService {
  async getUsers(filters: UserFilters = {}): Promise<User[]> {
    const response = await api.get('/users', { params: filters });
    const payload = response.data as unknown;

    if (Array.isArray(payload)) {
      return payload as User[];
    }

    if (payload && typeof payload === 'object') {
      const objectPayload = payload as { data?: User[]; users?: User[] };
      if (Array.isArray(objectPayload.data)) {
        return objectPayload.data;
      }
      if (Array.isArray(objectPayload.users)) {
        return objectPayload.users;
      }
    }

    return [];
  }
}

export default new UserService();
