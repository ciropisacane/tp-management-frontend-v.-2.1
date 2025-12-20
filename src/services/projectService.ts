import api from './api';
import type { Project, PaginatedResponse } from '../types';

export interface ProjectFilters {
  status?: string;
  priority?: string;
  search?: string;
  projectManagerId?: string;
  page?: number;
  limit?: number;
}

export interface CreateProjectData {
  clientId: string;
  projectName: string;
  deliverableType: string;
  status?: string;
  priority?: string;
  startDate?: string;
  deadline?: string;
  budget?: number;
  projectManagerId: string;
  description?: string;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  id: string;
}

class ProjectService {
  // Get all projects with filters and pagination
  async getProjects(filters: ProjectFilters = {}): Promise<PaginatedResponse<Project>> {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.search) params.append('search', filters.search);
    if (filters.projectManagerId) params.append('projectManagerId', filters.projectManagerId);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/projects?${params.toString()}`);
    return response.data;
  }

  // Get single project by ID
  async getProjectById(id: string): Promise<{ success: boolean; data: Project }> {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  }

  // Create new project
  async createProject(data: CreateProjectData): Promise<{ success: boolean; data: Project; message: string }> {
    const response = await api.post('/projects', data);
    return response.data;
  }

  // Update project
  async updateProject(id: string, data: Partial<CreateProjectData>): Promise<{ success: boolean; data: Project; message: string }> {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  }

  // Delete (archive) project
  async deleteProject(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  }

  // Change project status
  async changeStatus(id: string, status: string): Promise<{ success: boolean; data: Project; message: string }> {
    const response = await api.post(`/projects/${id}/status`, { status });
    return response.data;
  }

  // Get project workflow
  async getWorkflow(id: string): Promise<{ success: boolean; data: any }> {
    const response = await api.get(`/projects/${id}/workflow`);
    return response.data;
  }

  // Get project progress
  async getProgress(id: string): Promise<{ success: boolean; data: any }> {
    const response = await api.get(`/projects/${id}/progress`);
    return response.data;
  }

  // Get project stats
  async getStats(id: string): Promise<{ success: boolean; data: any }> {
    const response = await api.get(`/projects/${id}/stats`);
    return response.data;
  }

  // Get project team
  async getTeam(id: string): Promise<{ success: boolean; data: any[] }> {
    const response = await api.get(`/projects/${id}/team`);
    return response.data;
  }

  // Add team member
  async addTeamMember(id: string, data: { userId: string; roleInProject: string; allocationPercentage: number }): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.post(`/projects/${id}/team`, data);
    return response.data;
  }

  // Remove team member
  async removeTeamMember(id: string, teamMemberId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/projects/${id}/team/${teamMemberId}`);
    return response.data;
  }
}


export default new ProjectService();
