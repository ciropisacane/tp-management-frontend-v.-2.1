// src/hooks/useTasks.ts

import { useState, useEffect, useCallback } from 'react';
import taskService from '../services/taskService';
import type {
  Task,
  TaskFilters,
  TaskStats,
  CreateTaskDto,
  UpdateTaskDto,
} from '../types/task.types';

interface UseTasksOptions {
  autoLoad?: boolean;
  initialFilters?: TaskFilters;
  projectId?: string;
}

export const useTasks = (options: UseTasksOptions = {}) => {
  const { autoLoad = true, initialFilters = {}, projectId } = options;

  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [filters, setFilters] = useState<TaskFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load tasks from API
   */
  const loadTasks = useCallback(
    async (resetPage = false) => {
      try {
        setIsLoading(true);
        setError(null);

        const currentPage = resetPage ? 1 : page;
        const activeFilters = projectId 
          ? { ...filters, projectId } 
          : filters;

        const response = await taskService.getTasks(
          activeFilters,
          currentPage,
          limit
        );

        setTasks(response.data);
        setTotalPages(response.pagination.totalPages);
        if (resetPage) setPage(1);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load tasks');
        console.error('Error loading tasks:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [filters, page, limit, projectId]
  );

  /**
   * Load task statistics
   */
  const loadStats = useCallback(async () => {
    try {
      const response = await taskService.getTaskStats(projectId);
      setStats(response.data);
    } catch (err) {
      console.error('Error loading task stats:', err);
    }
  }, [projectId]);

  /**
   * Create new task
   */
  const createTask = async (data: CreateTaskDto): Promise<Task> => {
    try {
      setError(null);
      const newTask = await taskService.createTask(data);
      await loadTasks(true); // Reload first page
      await loadStats(); // Refresh stats
      return newTask;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to create task';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  /**
   * Update existing task
   */
  const updateTask = async (
    id: string,
    data: UpdateTaskDto
  ): Promise<Task> => {
    try {
      setError(null);
      const updatedTask = await taskService.updateTask(id, data);
      
      // Update local state
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
      await loadStats(); // Refresh stats
      return updatedTask;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update task';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  /**
   * Delete task
   */
  const deleteTask = async (id: string): Promise<void> => {
    try {
      setError(null);
      await taskService.deleteTask(id);
      
      // Remove from local state
      setTasks((prev) => prev.filter((task) => task.id !== id));
      await loadStats(); // Refresh stats
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete task';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  /**
   * Quick actions
   */
  const updateStatus = async (id: string, status: Task['status']) => {
    return updateTask(id, { status });
  };

  const updatePriority = async (id: string, priority: Task['priority']) => {
    return updateTask(id, { priority });
  };

  const assignTask = async (id: string, userId: string | null) => {
    return updateTask(id, { assignedToId: userId });
  };

  /**
   * Filter management
   */
  const updateFilters = (newFilters: Partial<TaskFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  /**
   * Pagination
   */
  const nextPage = () => {
    if (page < totalPages) {
      setPage((p) => p + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage((p) => p - 1);
    }
  };

  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum);
    }
  };

  /**
   * Refresh all data
   */
  const refresh = async () => {
    await Promise.all([loadTasks(true), loadStats()]);
  };

  // Auto-load on mount and when dependencies change
  useEffect(() => {
    if (autoLoad) {
      loadTasks();
    }
  }, [filters, page, projectId]); // loadTasks changes when these change

  // Load stats on mount
  useEffect(() => {
    if (autoLoad) {
      loadStats();
    }
  }, [projectId]); // loadStats changes when projectId changes

  return {
    // State
    tasks,
    stats,
    filters,
    page,
    totalPages,
    isLoading,
    error,

    // Actions
    createTask,
    updateTask,
    deleteTask,
    updateStatus,
    updatePriority,
    assignTask,

    // Filters
    updateFilters,
    resetFilters,

    // Pagination
    nextPage,
    prevPage,
    goToPage,

    // Refresh
    refresh,
    loadTasks,
  };
};