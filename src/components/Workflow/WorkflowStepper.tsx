// src/components/Workflow/WorkflowStepper.tsx

import { CheckCircle2, Circle, PlayCircle, XCircle } from 'lucide-react';
import type { ProjectWorkflowStep } from '../../types/workflow.types';
import { WORKFLOW_STATUS_CONFIG } from '../../types/workflow.types';

interface WorkflowStepperProps {
  steps: ProjectWorkflowStep[];
  onStepClick: (step: ProjectWorkflowStep) => void;
  activeStepId?: string;
}

export const WorkflowStepper = ({ steps, onStepClick, activeStepId }: WorkflowStepperProps) => {
  // Sort steps by order
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

  const getStepIcon = (status: ProjectWorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return CheckCircle2;
      case 'in_progress':
        return PlayCircle;
      case 'blocked':
        return XCircle;
      default:
        return Circle;
    }
  };

  const getConnectorColor = (currentStep: ProjectWorkflowStep, nextStep?: ProjectWorkflowStep) => {
    // If current step is completed, connector is green
    if (currentStep.status === 'completed') {
      return 'bg-green-500';
    }
    // If current step is in progress, connector is blue
    if (currentStep.status === 'in_progress') {
      return 'bg-blue-500';
    }
    // If current step is blocked, connector is red
    if (currentStep.status === 'blocked') {
      return 'bg-red-500';
    }
    // Otherwise gray
    return 'bg-gray-300';
  };

  return (
    <div className="relative">
      {/* Timeline Container */}
      <div className="space-y-8">
        {sortedSteps.map((step, index) => {
          const isActive = step.id === activeStepId;
          const statusConfig = WORKFLOW_STATUS_CONFIG[step.status];
          const StepIcon = getStepIcon(step.status);
          const nextStep = sortedSteps[index + 1];
          const connectorColor = getConnectorColor(step, nextStep);

          return (
            <div key={step.id} className="relative">
              {/* Step Item */}
              <div
                onClick={() => onStepClick(step)}
                className={`
                  relative flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-all
                  hover:bg-gray-50
                  ${isActive ? 'bg-blue-50 border-2 border-blue-500' : 'border border-gray-200'}
                `}
              >
                {/* Icon Circle */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
                      ${statusConfig.bgColor} ${statusConfig.borderColor}
                    `}
                  >
                    <StepIcon className={`h-6 w-6 ${statusConfig.textColor}`} />
                  </div>
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-xs font-bold">
                    {step.order}
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {step.stepName}
                      </h4>
                      {step.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {step.description}
                        </p>
                      )}
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`
                        ml-4 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap
                        ${statusConfig.bgColor} ${statusConfig.textColor}
                      `}
                    >
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Meta Information */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {step.assignedTo && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Assigned:</span>
                        <span>{step.assignedTo.firstName} {step.assignedTo.lastName}</span>
                      </div>
                    )}

                    {step.estimatedDays && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Duration:</span>
                        <span>
                          {step.actualDays 
                            ? `${step.actualDays}/${step.estimatedDays} days`
                            : `${step.estimatedDays} days`
                          }
                        </span>
                      </div>
                    )}

                    {step.startDate && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Started:</span>
                        <span>{new Date(step.startDate).toLocaleDateString()}</span>
                      </div>
                    )}

                    {step.completedDate && (
                      <div className="flex items-center gap-1 text-green-600">
                        <span className="font-medium">Completed:</span>
                        <span>{new Date(step.completedDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes Preview */}
                  {step.notes && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-gray-700">
                      <span className="font-medium">Note:</span> {step.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Connector Line to Next Step */}
              {nextStep && (
                <div className="relative flex justify-center">
                  <div
                    className={`
                      w-1 h-8 rounded-full transition-colors
                      ${connectorColor}
                    `}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};