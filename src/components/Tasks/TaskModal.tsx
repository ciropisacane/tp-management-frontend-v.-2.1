// src/pages/Tasks/TaskModal.tsx

import { useEffect, useMemo, useState } from 'react';
import { X, AlertCircle, Calendar, Tag, User, Briefcase } from 'lucide-react';
import type { Task, TaskPriority, TaskStatus, CreateTaskDto, UpdateTaskDto } from '../../types/task.types';
import { formatDateForApi, formatDateForInput, formatDateTime } from '../../utils/formatters';

interface TaskModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'view';
  task?: Task | null;
  projectsOptions?: Array<{ id: string; projectName: string }>;
  usersOptions?: Array<{ id: string; firstName: string; lastName: string }>;
  onClose: () => void;
  onSubmit: (payload: CreateTaskDto | UpdateTaskDto) => Promise<void>;
}

const statusOptions: Array<{ value: TaskStatus; label: string }> = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'In Review' },
  { value: 'completed', label: 'Completed' },
  { value: 'blocked', label: 'Blocked' },
];

const priorityOptions: Array<{ value: TaskPriority; label: string }> = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const defaultFormState = {
  title: '',
  description: '',
  status: 'todo' as TaskStatus,
  priority: 'medium' as TaskPriority,
  dueDate: '',
  estimatedHours: '',
  projectId: '',
  assignedToId: '',
  tags: '',
};

export const TaskModal = ({
  isOpen,
  mode,
  task,
  projectsOptions = [],
  usersOptions = [],
  onClose,
  onSubmit,
}: TaskModalProps) => {
  const [formData, setFormData] = useState(defaultFormState);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const isReadOnly = mode === 'view';
  const isEdit = mode === 'edit';

  const title = useMemo(() => {
    if (mode === 'create') return 'Create Task';
    if (mode === 'edit') return 'Edit Task';
    return 'Task Details';
  }, [mode]);

  useEffect(() => {
    if (!isOpen) return;

    if (task) {
      setFormData({
        title: task.title ?? '',
        description: task.description ?? '',
        status: task.status ?? 'todo',
        priority: task.priority ?? 'medium',
        dueDate: formatDateForInput(task.dueDate),
        estimatedHours: task.estimatedHours?.toString() ?? '',
        projectId: task.projectId ?? '',
        assignedToId: task.assignedToId ?? '',
        tags: task.tags?.join(', ') ?? '',
      });
    } else {
      setFormData(defaultFormState);
    }

    setError(null);
    setIsSaving(false);
  }, [isOpen, task]);

  const handleClose = () => {
    setFormData(defaultFormState);
    setError(null);
    setIsSaving(false);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isReadOnly) {
      handleClose();
      return;
    }

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const tags = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      const payload: CreateTaskDto | UpdateTaskDto = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status,
        priority: formData.priority,
        dueDate: formatDateForApi(formData.dueDate) || undefined,
        estimatedHours: formData.estimatedHours
          ? Number.parseFloat(formData.estimatedHours)
          : undefined,
        projectId: formData.projectId || undefined,
        assignedToId: formData.assignedToId || undefined,
        tags: tags.length > 0 ? tags : undefined,
      };

      await onSubmit(payload);
      handleClose();
    } catch (submitError: any) {
      console.error('Failed to save task:', submitError);
      setError(
        submitError?.response?.data?.message ||
          submitError?.message ||
          'Failed to save task'
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
            disabled={isSaving}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {error && (
            <div className="flex items-start rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="mt-1 text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(event) => setFormData({ ...formData, title: event.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder="Task title"
              disabled={isReadOnly || isSaving}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(event) => setFormData({ ...formData, description: event.target.value })}
              className="min-h-[120px] w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder="Add more details..."
              disabled={isReadOnly || isSaving}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(event) =>
                  setFormData({ ...formData, status: event.target.value as TaskStatus })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                disabled={isReadOnly || isSaving}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                value={formData.priority}
                onChange={(event) =>
                  setFormData({ ...formData, priority: event.target.value as TaskPriority })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                disabled={isReadOnly || isSaving}
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(event) => setFormData({ ...formData, dueDate: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  disabled={isReadOnly || isSaving}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Estimated Hours
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.estimatedHours}
                onChange={(event) => setFormData({ ...formData, estimatedHours: event.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 4"
                disabled={isReadOnly || isSaving}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Project</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  value={formData.projectId}
                  onChange={(event) => setFormData({ ...formData, projectId: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  disabled={isReadOnly || isSaving}
                >
                  <option value="">No project</option>
                  {projectsOptions.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.projectName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Assigned To</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  value={formData.assignedToId}
                  onChange={(event) =>
                    setFormData({ ...formData, assignedToId: event.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  disabled={isReadOnly || isSaving}
                >
                  <option value="">Unassigned</option>
                  {usersOptions.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.tags}
                onChange={(event) => setFormData({ ...formData, tags: event.target.value })}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="comma, separated, tags"
                disabled={isReadOnly || isSaving}
              />
            </div>
          </div>

          {task && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-700">Details</p>
              <div className="mt-2 grid gap-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium text-gray-700">Created:</span>{' '}
                  {formatDateTime(task.createdAt)}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Updated:</span>{' '}
                  {formatDateTime(task.updatedAt)}
                </div>
                {task.assignedTo && (
                  <div>
                    <span className="font-medium text-gray-700">Assignee:</span>{' '}
                    {task.assignedTo.firstName} {task.assignedTo.lastName}
                  </div>
                )}
                {task.project && (
                  <div>
                    <span className="font-medium text-gray-700">Project:</span>{' '}
                    {task.project.projectName}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              disabled={isSaving}
            >
              {isReadOnly ? 'Close' : 'Cancel'}
            </button>
            {!isReadOnly && (
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Task'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};