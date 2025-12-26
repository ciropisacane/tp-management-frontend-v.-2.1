// Project Status
// Must match Prisma enum ProjectStatus
export const PROJECT_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  PLANNING: 'PLANNING',
  DATA_GATHERING: 'DATA_GATHERING',
  ANALYSIS: 'ANALYSIS',
  DRAFTING: 'DRAFTING',
  INTERNAL_REVIEW: 'INTERNAL_REVIEW',
  CLIENT_REVIEW: 'CLIENT_REVIEW',
  FINALIZATION: 'FINALIZATION',
  DELIVERED: 'DELIVERED',
  ARCHIVED: 'ARCHIVED',
  ON_HOLD: 'ON_HOLD',
  WAITING_CLIENT: 'WAITING_CLIENT',
  WAITING_THIRD_PARTY: 'WAITING_THIRD_PARTY',
  REVISION_REQUIRED: 'REVISION_REQUIRED'
} as const;

export type ProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  NOT_STARTED: 'Not Started',
  PLANNING: 'Planning',
  DATA_GATHERING: 'Data Gathering',
  ANALYSIS: 'Analysis',
  DRAFTING: 'Drafting',
  INTERNAL_REVIEW: 'Internal Review',
  CLIENT_REVIEW: 'Client Review',
  FINALIZATION: 'Finalization',
  DELIVERED: 'Delivered',
  ARCHIVED: 'Archived',
  ON_HOLD: 'On Hold',
  WAITING_CLIENT: 'Waiting Client',
  WAITING_THIRD_PARTY: 'Waiting Third Party',
  REVISION_REQUIRED: 'Revision Required'
};

export const PROJECT_STATUS_COLORS: Record<string, string> = {
  NOT_STARTED: 'bg-gray-100 text-gray-800',
  PLANNING: 'bg-blue-50 text-blue-700',
  DATA_GATHERING: 'bg-blue-100 text-blue-800',
  ANALYSIS: 'bg-indigo-100 text-indigo-800',
  DRAFTING: 'bg-purple-100 text-purple-800',
  INTERNAL_REVIEW: 'bg-yellow-100 text-yellow-800',
  CLIENT_REVIEW: 'bg-orange-100 text-orange-800',
  FINALIZATION: 'bg-cyan-100 text-cyan-800',
  DELIVERED: 'bg-green-100 text-green-800',
  ARCHIVED: 'bg-gray-200 text-gray-600',
  ON_HOLD: 'bg-gray-100 text-gray-600',
  WAITING_CLIENT: 'bg-amber-50 text-amber-700',
  WAITING_THIRD_PARTY: 'bg-amber-100 text-amber-800',
  REVISION_REQUIRED: 'bg-red-50 text-red-700'
};

// Priority
// Must match Prisma enum Priority
export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;

export const PRIORITY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent'
};

export const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-green-600',
  medium: 'text-yellow-600',
  high: 'text-orange-600',
  urgent: 'text-red-600'
};

export const PRIORITY_BG_COLORS: Record<string, string> = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

// Deliverable Types
// Must match Prisma enum DeliverableType
export const DELIVERABLE_TYPE = {
  LOCAL_FILE: 'LOCAL_FILE',
  MASTER_FILE: 'MASTER_FILE',
  BENCHMARK_ANALYSIS: 'BENCHMARK_ANALYSIS',
  IC_AGREEMENT: 'IC_AGREEMENT',
  TP_POLICY: 'TP_POLICY',
  AOA_REPORT: 'AOA_REPORT',
  TRANSACTION_REPORT: 'TRANSACTION_REPORT',
  TP_AUDIT_SUPPORT: 'TP_AUDIT_SUPPORT',
  SETTLEMENT_PROCEDURE: 'SETTLEMENT_PROCEDURE',
  APA_MAP_NEGOTIATION: 'APA_MAP_NEGOTIATION',
  TP_PLANNING: 'TP_PLANNING',
  DISPUTE_RESOLUTION: 'DISPUTE_RESOLUTION',
  IP_VALUATION: 'IP_VALUATION',
  CBCR_SUPPORT: 'CBCR_SUPPORT',
  LF_COMMENT_REVIEW: 'LF_COMMENT_REVIEW',
  MF_COMMENT_REVIEW: 'MF_COMMENT_REVIEW'
} as const;

export const DELIVERABLE_TYPE_LABELS: Record<string, string> = {
  LOCAL_FILE: 'Local File',
  MASTER_FILE: 'Master File',
  BENCHMARK_ANALYSIS: 'Benchmark Analysis',
  IC_AGREEMENT: 'Intercompany Agreement',
  TP_POLICY: 'TP Policy',
  AOA_REPORT: 'AOA Report',
  TRANSACTION_REPORT: 'Transaction Report',
  TP_AUDIT_SUPPORT: 'TP Audit Support',
  SETTLEMENT_PROCEDURE: 'Settlement Procedure',
  APA_MAP_NEGOTIATION: 'APA/MAP Negotiation',
  TP_PLANNING: 'TP Planning',
  DISPUTE_RESOLUTION: 'Dispute Resolution',
  IP_VALUATION: 'IP Valuation',
  CBCR_SUPPORT: 'CbCR Support',
  LF_COMMENT_REVIEW: 'Local File Review',
  MF_COMMENT_REVIEW: 'Master File Review'
};

// Task Status
// Must match Prisma enum TaskStatus: todo, in_progress, review, completed, cancelled
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const TASK_STATUS_LABELS: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

export const TASK_STATUS_COLORS: Record<string, string> = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  review: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-600'
};

// User Roles
// Must match Prisma enum UserRole
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