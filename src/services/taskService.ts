// src/services/taskService.ts

import api from './api';
import type {
  Task,
  TaskFilters,
  TaskListResponse,
  TaskResponse,
  TaskStatsResponse,
  CreateTaskDto,
  UpdateTaskDto,
} from '../types/task.types';

const taskService = {
  /**
   * Get all tasks with optional filters and pagination
   */
  async getTasks(
    filters: TaskFilters = {},
    page: number = 1,
    limit: number = 50
  ): Promise<TaskListResponse> {
    const params: Record<string, any> = { page, limit };

    // Add filters to params
    if (filters.status && filters.status !== 'all') {
      params.status = filters.status;
    }
    if (filters.priority && filters.priority !== 'all') {
      params.priority = filters.priority;
    }
    if (filters.projectId) {
      params.projectId = filters.projectId;
    }
    if (filters.assignedTo) {
      params.assignedTo = filters.assignedTo;
    }
    if (filters.search) {
      params.search = filters.search;
    }
    if (filters.tags && filters.tags.length > 0) {
      params.tags = filters.tags.join(',');
    }
    if (filters.overdue) {
      params.overdue = 'true';
    }
    if (filters.dueDateFrom) {
      params.dueDateFrom = filters.dueDateFrom;
    }
    if (filters.dueDateTo) {
      params.dueDateTo = filters.dueDateTo;
    }

    const response = await api.get<TaskListResponse>('/tasks', { params });
    return response.data;
  },

  /**
   * Get my tasks (assigned to current user)
   */
  async getMyTasks(): Promise<Task[]> {
    const response = await api.get<{ success: boolean; data: Task[] }>(
      '/tasks/my/all'
    );
    return response.data.data;
  },

  /**
   * Get task statistics
   */
  async getTaskStats(projectId?: string): Promise<TaskStatsResponse> {
    const params = projectId ? { projectId } : {};
    const response = await api.get<TaskStatsResponse>('/tasks/stats', { params });
    return response.data;
  },

  /**
   * Get single task by ID
   */
  async getTask(id: string): Promise<Task> {
    const response = await api.get<TaskResponse>(`/tasks/${id}`);
    return response.data.data;
  },

  /**
   * Create new task
   */
  async createTask(data: CreateTaskDto): Promise<Task> {
    const response = await api.post<TaskResponse>('/tasks', data);
    return response.data.data;
  },

  /**
   * Update existing task
   */
  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    const response = await api.put<TaskResponse>(`/tasks/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete task
   */
  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  /**
   * Quick update task status
   */
  async updateTaskStatus(
    id: string,
    status: Task['status']
  ): Promise<Task> {
    return this.updateTask(id, { status });
  },

  /**
   * Quick update task priority
   */
  async updateTaskPriority(
    id: string,
    priority: Task['priority']
  ): Promise<Task> {
    return this.updateTask(id, { priority });
  },

  /**
   * Quick assign task to user
   */
  async assignTask(id: string, userId: string | null): Promise<Task> {
    return this.updateTask(id, { assignedToId: userId });
  },
};

export default taskService;