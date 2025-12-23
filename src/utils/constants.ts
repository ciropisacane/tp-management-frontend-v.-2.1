// Project Status
export const PROJECT_STATUS = {
  PLANNING: 'PLANNING',
  DATA_COLLECTION: 'DATA_COLLECTION',
  BENCHMARKING: 'BENCHMARKING',
  DRAFT_PREPARATION: 'DRAFT_PREPARATION',
  INTERNAL_REVIEW: 'INTERNAL_REVIEW',
  CLIENT_REVIEW: 'CLIENT_REVIEW',
  FINALIZATION: 'FINALIZATION',
  COMPLETED: 'COMPLETED',
  ON_HOLD: 'ON_HOLD',
  CANCELLED: 'CANCELLED'
} as const;

export type ProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  PLANNING: 'Planning',
  DATA_COLLECTION: 'Data Collection',
  BENCHMARKING: 'Benchmarking',
  DRAFT_PREPARATION: 'Draft Preparation',
  INTERNAL_REVIEW: 'Internal Review',
  CLIENT_REVIEW: 'Client Review',
  FINALIZATION: 'Finalization',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold',
  CANCELLED: 'Cancelled'
};

export const PROJECT_STATUS_COLORS: Record<string, string> = {
  PLANNING: 'bg-gray-100 text-gray-800',
  DATA_COLLECTION: 'bg-blue-100 text-blue-800',
  BENCHMARKING: 'bg-indigo-100 text-indigo-800',
  DRAFT_PREPARATION: 'bg-purple-100 text-purple-800',
  INTERNAL_REVIEW: 'bg-yellow-100 text-yellow-800',
  CLIENT_REVIEW: 'bg-orange-100 text-orange-800',
  FINALIZATION: 'bg-cyan-100 text-cyan-800',
  COMPLETED: 'bg-green-100 text-green-800',
  ON_HOLD: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-800'
};

// Priority
export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;

export const PRIORITY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical'
};

export const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-green-600',
  medium: 'text-yellow-600',
  high: 'text-orange-600',
  critical: 'text-red-600'
};

export const PRIORITY_BG_COLORS: Record<string, string> = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

// Deliverable Types
export const DELIVERABLE_TYPE = {
  LOCAL_FILE: 'LOCAL_FILE',
  MASTER_FILE: 'MASTER_FILE',
  CBCR: 'CBCR',
  BENCHMARKING_STUDY: 'BENCHMARKING_STUDY',
  APA_DOCUMENTATION: 'APA_DOCUMENTATION',
  DOCUMENTATION_UPDATE: 'DOCUMENTATION_UPDATE',
  TAX_ASSESSMENT_SUPPORT: 'TAX_ASSESSMENT_SUPPORT',
  OTHER: 'OTHER'
} as const;

export const DELIVERABLE_TYPE_LABELS: Record<string, string> = {
  LOCAL_FILE: 'Local File',
  MASTER_FILE: 'Master File',
  CBCR: 'CbCR',
  BENCHMARKING_STUDY: 'Benchmarking Study',
  APA_DOCUMENTATION: 'APA Documentation',
  DOCUMENTATION_UPDATE: 'Documentation Update',
  TAX_ASSESSMENT_SUPPORT: 'Tax Assessment Support',
  OTHER: 'Other'
};

// Task Status
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  BLOCKED: 'blocked',
  IN_REVIEW: 'in_review',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const TASK_STATUS_LABELS: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  blocked: 'Blocked',
  in_review: 'In Review',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

export const TASK_STATUS_COLORS: Record<string, string> = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  blocked: 'bg-red-100 text-red-800',
  in_review: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-600'
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  PARTNER: 'partner',
  MANAGER: 'manager',
  SENIOR: 'senior',
  CONSULTANT: 'consultant',
  SUPPORT: 'support'
} as const;

export const USER_ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  partner: 'Partner',
  manager: 'Manager',
  senior: 'Senior Consultant',
  consultant: 'Consultant',
  support: 'Support'
};

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  LIMITS: [10, 20, 50, 100]
} as const;