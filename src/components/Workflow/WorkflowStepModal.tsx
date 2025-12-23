// src/components/Workflow/WorkflowStepModal.tsx

import { useState, useEffect } from 'react';
import { X, Save, User, Calendar, Clock, MessageSquare, Flag } from 'lucide-react';
import type { ProjectWorkflowStep, UpdateWorkflowStepDto, WorkflowStepStatus } from '../../types/workflow.types';
import { WORKFLOW_STATUS_CONFIG } from '../../types/workflow.types';

interface WorkflowStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateWorkflowStepDto) => Promise<void>;
  step: ProjectWorkflowStep | null;
  usersOptions?: Array<{ id: string; firstName: string; lastName: string }>;
}

const statusOptions: Array<{ value: WorkflowStepStatus; label: string }> = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'blocked', label: 'Blocked' },
];

export const WorkflowStepModal = ({
  isOpen,
  onClose,
  onSave,
  step,
  usersOptions = [],
}: WorkflowStepModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<UpdateWorkflowStepDto>({
    status: 'not_started',
    assignedToId: null,
    startDate: null,
    completedDate: null,
    actualDays: null,
    notes: null,
  });

  // Initialize form with step data
  useEffect(() => {
    if (step) {
      setFormData({
        status: step.status,
        assignedToId: step.assignedToId || null,
        startDate: step.startDate ? step.startDate.split('T')[0] : null,
        completedDate: step.completedDate ? step.completedDate.split('T')[0] : null,
        actualDays: step.actualDays,
        notes: step.notes || '',
      });
    }
  }, [step]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsLoading(true);

      // Clean data
      const dataToSave: UpdateWorkflowStepDto = {
        status: formData.status,
        assignedToId: formData.assignedToId || null,
        startDate: formData.startDate || null,
        completedDate: formData.completedDate || null,
        actualDays: formData.actualDays || null,
        notes: formData.notes?.trim() || null,
      };

      // Auto-set startDate when changing to in_progress
      if (dataToSave.status === 'in_progress' && !dataToSave.startDate && !step?.startDate) {
        dataToSave.startDate = new Date().toISOString().split('T')[0];
      }

      // Auto-set completedDate when changing to completed
      if (dataToSave.status === 'completed' && !dataToSave.completedDate && !step?.completedDate) {
        dataToSave.completedDate = new Date().toISOString().split('T')[0];
      }

      await onSave(dataToSave);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update workflow step');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !step) return null;

  const statusConfig = WORKFLOW_STATUS_CONFIG[step.status];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Workflow Step
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Step {step.order}: {step.stepName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Description (read-only) */}
              {step.description && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{step.description}</p>
                </div>
              )}

              {/* Status */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Flag className="h-4 w-4" />
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as WorkflowStepStatus })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assigned User */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4" />
                  Assigned To
                </label>
                <select
                  value={formData.assignedToId || ''}
                  onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Unassigned</option>
                  {usersOptions.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Completed Date */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4" />
                    Completed Date
                  </label>
                  <input
                    type="date"
                    value={formData.completedDate || ''}
                    onChange={(e) => setFormData({ ...formData, completedDate: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={formData.status !== 'completed'}
                  />
                  {formData.status !== 'completed' && (
                    <p className="mt-1 text-xs text-gray-500">
                      Available when status is "Completed"
                    </p>
                  )}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4" />
                  Actual Days Taken
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.actualDays || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    actualDays: e.target.value ? parseFloat(e.target.value) : null 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
                {step.estimatedDays && (
                  <p className="mt-1 text-xs text-gray-500">
                    Estimated: {step.estimatedDays} days
                  </p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="h-4 w-4" />
                  Notes
                </label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add notes about this step..."
                />
              </div>

              {/* Quick Actions Info */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Quick Tips</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Changing status to "In Progress" will auto-set start date if empty</li>
                  <li>• Changing status to "Completed" will auto-set completion date if empty</li>
                  <li>• Use "Blocked" status when the step cannot proceed</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};