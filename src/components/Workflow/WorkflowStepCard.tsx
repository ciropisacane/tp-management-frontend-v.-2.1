// src/components/Workflow/WorkflowStepCard.tsx

import { 
    User, 
    Calendar, 
    Clock, 
    CheckCircle2, 
    Circle,
    PlayCircle,
    XCircle,
    Edit,
    MessageSquare
  } from 'lucide-react';
  import type { ProjectWorkflowStep } from '../../types/workflow.types';
  import { WORKFLOW_STATUS_CONFIG } from '../../types/workflow.types';
  
  interface WorkflowStepCardProps {
    step: ProjectWorkflowStep;
    isActive?: boolean;
    onClick: () => void;
  }
  
  export const WorkflowStepCard = ({ step, isActive = false, onClick }: WorkflowStepCardProps) => {
    const statusConfig = WORKFLOW_STATUS_CONFIG[step.status];
    
    // Calculate if step is overdue
    const isOverdue = 
      step.status !== 'completed' &&
      step.startDate &&
      step.estimatedDays &&
      new Date(step.startDate).getTime() + (step.estimatedDays * 24 * 60 * 60 * 1000) < Date.now();
  
    // Format date
    const formatDate = (date: string | null) => {
      if (!date) return null;
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };
  
    // Status icon
    const StatusIcon = {
      not_started: Circle,
      in_progress: PlayCircle,
      completed: CheckCircle2,
      blocked: XCircle,
    }[step.status];
  
    return (
      <div
        onClick={onClick}
        className={`
          relative bg-white rounded-lg border-2 p-4 cursor-pointer transition-all
          hover:shadow-md
          ${isActive ? 'border-blue-500 shadow-md' : statusConfig.borderColor}
          ${isOverdue && step.status !== 'completed' ? 'bg-red-50' : ''}
        `}
      >
        {/* Step Number Badge */}
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center font-semibold text-sm">
          {step.order}
        </div>
  
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 pr-2">
            <h4 className="font-semibold text-gray-900 mb-1">
              {step.stepName}
            </h4>
            {step.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {step.description}
              </p>
            )}
          </div>
  
          {/* Status Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
            <StatusIcon className="h-3 w-3" />
            {statusConfig.label}
          </div>
        </div>
  
        {/* Info Grid */}
        <div className="space-y-2 mb-3">
          {/* Assigned User */}
          {step.assignedTo ? (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{step.assignedTo.firstName} {step.assignedTo.lastName}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <User className="h-4 w-4" />
              <span className="italic">Unassigned</span>
            </div>
          )}
  
          {/* Dates */}
          <div className="flex items-center gap-4 text-sm">
            {step.startDate && (
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Started {formatDate(step.startDate)}</span>
              </div>
            )}
            {step.completedDate && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>Done {formatDate(step.completedDate)}</span>
              </div>
            )}
          </div>
  
          {/* Duration */}
          {step.estimatedDays && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                {step.actualDays 
                  ? `${step.actualDays}/${step.estimatedDays} days`
                  : `Est. ${step.estimatedDays} days`
                }
              </span>
              {step.actualDays && step.actualDays > step.estimatedDays && (
                <span className="text-red-600 font-medium">
                  (+{step.actualDays - step.estimatedDays} days over)
                </span>
              )}
            </div>
          )}
  
          {/* Notes indicator */}
          {step.notes && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MessageSquare className="h-4 w-4" />
              <span className="truncate">{step.notes}</span>
            </div>
          )}
        </div>
  
        {/* Overdue Warning */}
        {isOverdue && (
          <div className="flex items-center gap-2 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-700 font-medium">
            <XCircle className="h-4 w-4" />
            <span>Overdue - Action Required</span>
          </div>
        )}
  
        {/* Edit Indicator */}
        <div className="absolute bottom-2 right-2 text-gray-400 hover:text-gray-600">
          <Edit className="h-4 w-4" />
        </div>
      </div>
    );
  };