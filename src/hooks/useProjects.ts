import { useState, useEffect, useCallback } from 'react';
import projectService from '../services/projectService';
import type { ProjectFilters } from '../services/projectService';
import type { Project, PaginatedResponse } from '../types';

interface UseProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UseProjectsReturn extends UseProjectsState {
  refetch: () => Promise<void>;
  setFilters: (filters: ProjectFilters) => void;
}

export const useProjects = (initialFilters: ProjectFilters = {}) => {
  const [state, setState] = useState<UseProjectsState>({
    projects: [],
    loading: true,
    error: null,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0
    }
  });

  const [filters, setFilters] = useState<ProjectFilters>(initialFilters);

  const fetchProjects = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response: PaginatedResponse<Project> = await projectService.getProjects(filters);
      
      setState({
        projects: response.data || [],
        loading: false,
        error: null,
        pagination: response.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        }
      });
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch projects'
      }));
    }
  }, [filters]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    ...state,
    refetch: fetchProjects,
    setFilters
  };
};

// Hook for single project
export const useProject = (id: string | undefined) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await projectService.getProjectById(id);
      setProject(response.data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching project:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch project');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    project,
    loading,
    error,
    refetch: fetchProject
  };
};
