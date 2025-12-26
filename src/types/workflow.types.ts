// src/types/workflow.types.ts

export type WorkflowStepStatus = 'not_started' | 'in_progress' | 'completed' | 'blocked';

export interface WorkflowTemplate {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  deliverableType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  steps: WorkflowTemplateStep[];
}

export interface WorkflowTemplateStep {
  id: string;
  stepName: string;
  description: string | null;
  order: number;
  estimatedDays: number | null;
  requiredRole: string | null;
  templateId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectWorkflow {
  id: string;
  organizationId: string;
  projectId: string;
  templateId: string;
  createdAt: string;
  updatedAt: string;
  template: WorkflowTemplate;
  steps: ProjectWorkflowStep[];
}

export interface ProjectWorkflowStep {
  id: string;
  projectWorkflowId: string;
  templateStepId: string;
  stepName: string;
  description: string | null;
  order: number;
  status: WorkflowStepStatus;
  assignedToId: string | null;
  startDate: string | null;
  completedDate: string | null;
  estimatedDays: number | null;
  actualDays: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;

  // Relations
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  templateStep?: WorkflowTemplateStep;
}

export interface UpdateWorkflowStepDto {
  status?: WorkflowStepStatus;
  assignedToId?: string | null;
  startDate?: string | null;
  completedDate?: string | null;
  actualDays?: number | null;
  notes?: string | null;
}

export interface WorkflowProgress {
  totalSteps: number;
  completedSteps: number;
  inProgressSteps: number;
  notStartedSteps: number;
  blockedSteps: number;
  percentComplete: number;
  estimatedCompletionDate: string | null;
  isOnTrack: boolean;
}

export interface WorkflowResponse {
  success: boolean;
  data: ProjectWorkflow;
  message?: string;
}

export interface WorkflowProgressResponse {
  success: boolean;
  data: WorkflowProgress;
}

// Status configuration for UI
export const WORKFLOW_STATUS_CONFIG = {
  not_started: {
    label: 'Not Started',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300',
  },
  in_progress: {
    label: 'In Progress',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
  },
  completed: {
    label: 'Completed',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-300',
  },
  blocked: {
    label: 'Blocked',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    borderColor: 'border-red-300',
  },
} as const;
