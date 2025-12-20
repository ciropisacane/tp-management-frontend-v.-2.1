// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'partner' | 'manager' | 'senior' | 'consultant' | 'support';
  hourlyRate?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
  };
}

// Client Types
export interface Client {
  id: string;
  name: string;
  industry?: string;
  country?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  billingAddress?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Project Types
export interface Project {
  id: string;
  projectName: string;
  deliverableType: string;
  status: string;
  priority: string;
  startDate: string | null;
  deadline: string | null;
  budget?: number | null;
  actualCost?: number | null;
  riskLevel?: string;
  description?: string;
  clientId: string;
  projectManagerId: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  client?: Client;
  projectManager?: User;
  team?: ProjectTeamMember[];
  _count?: {
    tasks?: number;
    documents?: number;
  };
}

export interface ProjectTeamMember {
  id: string;
  projectId: string;
  userId: string;
  roleInProject: string;
  allocationPercentage: number;
  startDate: string;
  endDate?: string | null;
  createdAt: string;
  user?: User;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'blocked' | 'in_review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string | null;
  completedAt?: string | null;
  estimatedHours?: number | null;
  actualHours?: number | null;
  tags?: string[] | null;
  projectId?: string | null;
  workflowStepId?: string | null;
  assignedTo?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  project?: Project;
  assignee?: User;
  creator?: User;
}

// Workflow Types
export interface WorkflowStep {
  id: string;
  projectId: string;
  stepName: string;
  stepOrder: number;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  assignedTo?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  estimatedDays?: number | null;
  actualDays?: number | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  assignee?: User;
}

// Document Types
export interface Document {
  id: string;
  projectId: string;
  documentType: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType?: string;
  version?: string;
  isFinal: boolean;
  isClientFacing: boolean;
  uploadedBy: string;
  workflowStepId?: string | null;
  description?: string;
  uploadedAt: string;
  updatedAt: string;
  // Relations
  uploader?: User;
  project?: Project;
}

// Milestone Types
export interface Milestone {
  id: string;
  projectId: string;
  milestoneName: string;
  description?: string;
  dueDate: string;
  completedAt?: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  createdAt: string;
  updatedAt: string;
}

// Time Entry Types
export interface TimeEntry {
  id: string;
  projectId?: string | null;
  taskId?: string | null;
  workflowStepId?: string | null;
  userId: string;
  date: string;
  hours: number;
  description?: string;
  billable: boolean;
  hourlyRate?: number | null;
  createdAt: string;
  updatedAt: string;
  // Relations
  user?: User;
  project?: Project;
  task?: Task;
}

// Pagination Types
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationInfo;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
}

// Filter Types
export interface BaseFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProjectFilters extends BaseFilters {
  status?: string;
  priority?: string;
  projectManagerId?: string;
  clientId?: string;
  startDate?: string;
  endDate?: string;
}

export interface TaskFilters extends BaseFilters {
  status?: string;
  priority?: string;
  assignedTo?: string;
  projectId?: string;
  dueDate?: string;
}