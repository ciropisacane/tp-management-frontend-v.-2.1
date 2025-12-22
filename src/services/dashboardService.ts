// src/services/dashboardService.ts
import api from './api';

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalClients: number;
  projectsByStatus: {
    status: string;
    count: number;
  }[];
  projectsByPriority: {
    priority: string;
    count: number;
  }[];
  recentProjects: {
    id: string;
    projectName: string;
    client: {
      name: string;
    };
    status: string;
    priority: string;
    deadline: string;
    progress: number;
  }[];
  upcomingDeadlines: {
    id: string;
    projectName: string;
    client: {
      name: string;
    };
    deadline: string;
    daysUntilDeadline: number;
  }[];
}

class DashboardService {
  // Get dashboard statistics
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<{ success: boolean; data: DashboardStats }>('/dashboard/stats');
    return response.data.data;
  }

  // Get user activity summary
  async getActivity(days: number = 7): Promise<any> {
    const response = await api.get('/dashboard/activity', {
      params: { days }
    });
    return response.data.data;
  }

  // Get project progress overview
  async getProjectProgress(): Promise<any> {
    const response = await api.get('/dashboard/progress');
    return response.data.data;
  }
}

export default new DashboardService();