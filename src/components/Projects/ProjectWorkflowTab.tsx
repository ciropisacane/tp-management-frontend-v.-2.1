// src/components/Projects/ProjectWorkflowTab.tsx

import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, Clock, CheckCircle2, AlertCircle, LayoutList, Grid } from 'lucide-react';
import workflowService from '../../services/workflowService';
import userService from '../../services/userService';
import { WorkflowStepper } from '../Workflow/WorkflowStepper';
import { WorkflowStepCard } from '../Workflow/WorkflowStepCard';
import { WorkflowStepModal } from '../Workflow/WorkflowStepModal';
import type { ProjectWorkflow, ProjectWorkflowStep, UpdateWorkflowStepDto, WorkflowProgress } from '../../types/workflow.types';

interface ProjectWorkflowTabProps {
  projectId: string;
  projectName: string;
}

type ViewMode = 'timeline' | 'grid';

export const ProjectWorkflowTab = ({ projectId, projectName }: ProjectWorkflowTabProps) => {
  const [workflow, setWorkflow] = useState<ProjectWorkflow | null>(null);
  const [progress, setProgress] = useState<WorkflowProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  
  // Modal state
  const [selectedStep, setSelectedStep] = useState<ProjectWorkflowStep | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Users for assignment
  const [usersOptions, setUsersOptions] = useState<Array<{ id: string; firstName: string; lastName: string }>>([]);

  // Load data
  useEffect(() => {
    loadWorkflowData();
    loadUsers();
  }, [projectId]);

  const loadWorkflowData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [workflowData, progressData] = await Promise.all([
        workflowService.getProjectWorkflow(projectId),
        workflowService.getWorkflowProgress(projectId),
      ]);
      
      setWorkflow(workflowData);
      setProgress(progressData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load workflow');
      console.error('Error loading workflow:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const users = await userService.getUsers({ active: true });
      setUsersOptions(
        users.map((u) => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
        }))
      );
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleStepClick = (step: ProjectWorkflowStep) => {
    setSelectedStep(step);
    setIsModalOpen(true);
  };

  const handleSaveStep = async (data: UpdateWorkflowStepDto) => {
    if (!selectedStep) return;

    try {
      const updatedStep = await workflowService.updateWorkflowStep(
        projectId,
        selectedStep.id,
        data
      );

      // Update local state
      setWorkflow((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          steps: prev.steps.map((s) =>
            s.id === updatedStep.id ? updatedStep : s
          ),
        };
      });

      // Reload progress
      const progressData = await workflowService.getWorkflowProgress(projectId);
      setProgress(progressData);

      setIsModalOpen(false);
      setSelectedStep(null);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update step');
    }
  };

  const handleRefresh = async () => {
    await loadWorkflowData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Loading workflow...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-700 mb-2">
          <AlertCircle className="h-5 w-5" />
          <span className="font-semibold">Error Loading Workflow</span>
        </div>
        <p className="text-red-600">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!workflow || !workflow.steps || workflow.steps.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Workflow Configured
        </h3>
        <p className="text-gray-600">
          This project doesn't have a workflow template assigned yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Project Workflow</h3>
          <p className="text-sm text-gray-600 mt-1">
            {workflow.template.name} - {projectName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white rounded-lg border p-1">
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Timeline View"
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Progress Stats */}
      {progress && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Progress</span>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{progress.percentComplete}%</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progress.percentComplete}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Completed</span>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">
              {progress.completedSteps}/{progress.totalSteps}
            </p>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">In Progress</span>
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{progress.inProgressSteps}</p>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Status</span>
              <div className={`w-2 h-2 rounded-full ${progress.isOnTrack ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
            <p className={`text-sm font-medium ${progress.isOnTrack ? 'text-green-600' : 'text-red-600'}`}>
              {progress.isOnTrack ? 'On Track' : 'Behind Schedule'}
            </p>
          </div>
        </div>
      )}

      {/* Workflow View */}
      {viewMode === 'timeline' ? (
        <WorkflowStepper
          steps={workflow.steps}
          onStepClick={handleStepClick}
          activeStepId={selectedStep?.id}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...workflow.steps]
            .sort((a, b) => a.order - b.order)
            .map((step) => (
              <WorkflowStepCard
                key={step.id}
                step={step}
                isActive={selectedStep?.id === step.id}
                onClick={() => handleStepClick(step)}
              />
            ))}
        </div>
      )}

      {/* Step Modal */}
      <WorkflowStepModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStep(null);
        }}
        onSave={handleSaveStep}
        step={selectedStep}
        usersOptions={usersOptions}
      />
    </div>
  );
};