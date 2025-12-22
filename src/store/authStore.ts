import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api, { handleApiError } from '../services/api';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      // ✅ FIXED: Listen for logout events from API interceptor
      if (typeof window !== 'undefined') {
        window.addEventListener('auth:logout', () => {
          console.log('🔐 Logout event received - clearing auth state');
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            error: null,
          });
        });
      }

      return {
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.post('/auth/login', { email, password });
            const { user, accessToken } = response.data.data;
            
            localStorage.setItem('accessToken', accessToken);
            
            set({
              user,
              accessToken,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error: any) {
            const errorMessage = handleApiError(error);
            set({ error: errorMessage, isLoading: false });
            throw new Error(errorMessage);
          }
        },

        logout: async () => {
          try {
            await api.post('/auth/logout');
          } catch (error) {
            console.error('Logout error:', error);
          } finally {
            localStorage.removeItem('accessToken');
            set({
              user: null,
              accessToken: null,
              isAuthenticated: false,
            });
          }
        },

        clearError: () => {
          set({ error: null });
        },
      };
    },
    {
      name: 'auth-storage',
    }
  )
);