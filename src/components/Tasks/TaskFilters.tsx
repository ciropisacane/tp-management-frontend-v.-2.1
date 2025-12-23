// src/components/Tasks/TaskFilters.tsx

import { useState, useEffect } from 'react';
import { Search, X, RefreshCw } from 'lucide-react';
import type { TaskFilters as TaskFiltersType, TaskStatus, TaskPriority } from '../../types/task.types';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: Partial<TaskFiltersType>) => void;
  onReset: () => void;
  projectsOptions?: Array<{ id: string; projectName: string }>;
  usersOptions?: Array<{ id: string; firstName: string; lastName: string }>;
}

const statusOptions: Array<{ value: TaskStatus | 'all'; label: string; color: string }> = [
  { value: 'all', label: 'All Status', color: 'gray' },
  { value: 'todo', label: 'To Do', color: 'blue' },
  { value: 'in_progress', label: 'In Progress', color: 'yellow' },
  { value: 'review', label: 'In Review', color: 'purple' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'blocked', label: 'Blocked', color: 'red' },
];

const priorityOptions: Array<{ value: TaskPriority | 'all'; label: string; color: string }> = [
  { value: 'all', label: 'All Priorities', color: 'gray' },
  { value: 'low', label: 'Low', color: 'green' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'urgent', label: 'Urgent', color: 'red' },
];

export const TaskFilters = ({
  filters,
  onFiltersChange,
  onReset,
  projectsOptions = [],
  usersOptions = [],
}: TaskFiltersProps) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({ search: searchInput || undefined });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleStatusChange = (status: TaskStatus | 'all') => {
    onFiltersChange({ status });
  };

  const handlePriorityChange = (priority: TaskPriority | 'all') => {
    onFiltersChange({ priority });
  };

  const handleProjectChange = (projectId: string) => {
    onFiltersChange({ projectId: projectId || undefined });
  };

  const handleAssignedToChange = (userId: string) => {
    onFiltersChange({ assignedTo: userId || undefined });
  };

  const handleOverdueToggle = () => {
    onFiltersChange({ overdue: !filters.overdue });
  };

  const activeFiltersCount = [
    filters.status && filters.status !== 'all',
    filters.priority && filters.priority !== 'all',
    filters.projectId,
    filters.assignedTo,
    filters.search,
    filters.overdue,
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            Reset ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <div className="space-y-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                (filters.status || 'all') === option.value
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">{option.label}</span>
                {(filters.status || 'all') === option.value && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Priority
        </label>
        <div className="space-y-2">
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handlePriorityChange(option.value)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                (filters.priority || 'all') === option.value
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">{option.label}</span>
                {(filters.priority || 'all') === option.value && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Project Filter */}
      {projectsOptions.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project
          </label>
          <select
            value={filters.projectId || ''}
            onChange={(e) => handleProjectChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Projects</option>
            {projectsOptions.map((project) => (
              <option key={project.id} value={project.id}>
                {project.projectName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Assigned To Filter */}
      {usersOptions.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assigned To
          </label>
          <select
            value={filters.assignedTo || ''}
            onChange={(e) => handleAssignedToChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Users</option>
            {usersOptions.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Overdue Toggle */}
      <div>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={filters.overdue || false}
            onChange={handleOverdueToggle}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">
            Show only overdue tasks
          </span>
        </label>
      </div>
    </div>
  );
};