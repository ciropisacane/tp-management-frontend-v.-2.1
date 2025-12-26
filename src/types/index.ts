// TypeScript Interfaces matching Prisma Schema

export type UserRole = 'admin' | 'partner' | 'manager' | 'senior' | 'consultant' | 'support';
export type DeliverableType = 'LOCAL_FILE' | 'MASTER_FILE' | 'BENCHMARK_ANALYSIS' | 'IC_AGREEMENT' | 'TP_POLICY' | 'AOA_REPORT' | 'TRANSACTION_REPORT' | 'TP_AUDIT_SUPPORT' | 'SETTLEMENT_PROCEDURE' | 'APA_MAP_NEGOTIATION' | 'TP_PLANNING' | 'DISPUTE_RESOLUTION' | 'IP_VALUATION' | 'CBCR_SUPPORT' | 'LF_COMMENT_REVIEW' | 'MF_COMMENT_REVIEW';
export type ProjectStatus = 'NOT_STARTED' | 'PLANNING' | 'DATA_GATHERING' | 'ANALYSIS' | 'DRAFTING' | 'INTERNAL_REVIEW' | 'CLIENT_REVIEW' | 'FINALIZATION' | 'DELIVERED' | 'ARCHIVED' | 'ON_HOLD' | 'WAITING_CLIENT' | 'WAITING_THIRD_PARTY' | 'REVISION_REQUIRED';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Organization {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  organizationId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  active: boolean;
  hourlyRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  organizationId: string;
  name: string;
  industry?: string;
  country?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  billingAddress?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  organizationId: string;
  clientId: string;
  client?: Client;
  projectName: string;
  deliverableType: DeliverableType;
  status: ProjectStatus;
  priority: Priority;
  startDate?: string;
  deadline?: string;
  estimatedHours?: number;
  actualHours?: number;
  budget?: number;
  actualCost?: number;
  projectManagerId: string;
  projectManager?: User;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  organization?: Organization;
}