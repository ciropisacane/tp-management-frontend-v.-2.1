// src/types/task.types.ts

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  estimatedHours: number | null;
  actualHours: number | null;
  tags: string[];
  projectId: string | null;
  workflowStepId: string | null;
  assignedToId: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations (from backend)
  project?: {
    id: string;
    projectName: string;
  };
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  workflowStep?: {
    id: string;
    stepName: string;
  };
}

export interface TaskStats {
  total: number;
  byStatus: {
    todo: number;
    in_progress: number;
    review: number;
    completed: number;
    blocked: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
}

export interface TaskFilters {
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
  projectId?: string;
  assignedTo?: string;
  search?: string;
  tags?: string[];
  overdue?: boolean;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  estimatedHours?: number;
  tags?: string[];
  projectId?: string;
  workflowStepId?: string;
  assignedToId?: string;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {
  actualHours?: number;
}

export interface TaskListResponse {
  success: boolean;
  data: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TaskResponse {
  success: boolean;
  data: Task;
  message?: string;
}

export interface TaskStatsResponse {
  success: boolean;
  data: TaskStats;
}