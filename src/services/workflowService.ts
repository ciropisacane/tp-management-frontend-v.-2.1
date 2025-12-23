// src/services/workflowService.ts

import api from './api';
import type {
  ProjectWorkflow,
  ProjectWorkflowStep,
  UpdateWorkflowStepDto,
  WorkflowProgress,
  WorkflowResponse,
  WorkflowProgressResponse,
} from '../types/workflow.types';

const workflowService = {
  /**
   * Get project workflow with all steps
   */
  async getProjectWorkflow(projectId: string): Promise<ProjectWorkflow> {
    const response = await api.get<WorkflowResponse>(
      `/projects/${projectId}/workflow`
    );
    return response.data.data;
  },

  /**
   * Get workflow progress/statistics
   */
  async getWorkflowProgress(projectId: string): Promise<WorkflowProgress> {
    const response = await api.get<WorkflowProgressResponse>(
      `/projects/${projectId}/workflow/progress`
    );
    return response.data.data;
  },

  /**
   * Update a specific workflow step
   */
  async updateWorkflowStep(
    projectId: string,
    stepId: string,
    data: UpdateWorkflowStepDto
  ): Promise<ProjectWorkflowStep> {
    const response = await api.put<{ success: boolean; data: ProjectWorkflowStep }>(
      `/projects/${projectId}/workflow/${stepId}`,
      data
    );
    return response.data.data;
  },

  /**
   * Start a workflow step (convenience method)
   */
  async startStep(projectId: string, stepId: string): Promise<ProjectWorkflowStep> {
    return this.updateWorkflowStep(projectId, stepId, {
      status: 'in_progress',
      startDate: new Date().toISOString(),
    });
  },

  /**
   * Complete a workflow step (convenience method)
   */
  async completeStep(
    projectId: string,
    stepId: string,
    actualDays?: number
  ): Promise<ProjectWorkflowStep> {
    return this.updateWorkflowStep(projectId, stepId, {
      status: 'completed',
      completedDate: new Date().toISOString(),
      actualDays,
    });
  },

  /**
   * Block a workflow step (convenience method)
   */
  async blockStep(
    projectId: string,
    stepId: string,
    notes: string
  ): Promise<ProjectWorkflowStep> {
    return this.updateWorkflowStep(projectId, stepId, {
      status: 'blocked',
      notes,
    });
  },

  /**
   * Assign user to workflow step (convenience method)
   */
  async assignStep(
    projectId: string,
    stepId: string,
    userId: string | null
  ): Promise<ProjectWorkflowStep> {
    return this.updateWorkflowStep(projectId, stepId, {
      assignedToId: userId,
    });
  },

  /**
   * Add/update notes for a workflow step
   */
  async updateStepNotes(
    projectId: string,
    stepId: string,
    notes: string
  ): Promise<ProjectWorkflowStep> {
    return this.updateWorkflowStep(projectId, stepId, { notes });
  },
};

export default workflowService;