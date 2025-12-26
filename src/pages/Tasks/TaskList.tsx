// src/pages/Tasks/TaskList.tsx

import { useState, useEffect } from 'react';
import { Plus, LayoutGrid, List, RefreshCw, AlertCircle } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { TaskStats } from '../../components/Tasks/TaskStats';
import { TaskFilters } from '../../components/Tasks/TaskFilters';
import { TaskKanban } from '../../components/Tasks/TaskKanban';
import { TaskTable } from '../../components/Tasks/TaskTable';
import { TaskModal } from '../../components/Tasks/TaskModal';
import projectService from '../../services/projectService';
import userService from '../../services/userService';
import type { Task, TaskStatus, CreateTaskDto, UpdateTaskDto } from '../../types/task.types';

type ViewMode = 'kanban' | 'table';

export const TaskList = () => {
  const {
    tasks,
    stats,
    filters,
    isLoading,
    error,
    updateFilters,
    resetFilters,
    updateStatus,
    createTask,
    updateTask,
    deleteTask,
    refresh,
  } = useTasks();

  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Options for filters/modal
  const [projectsOptions, setProjectsOptions] = useState<Array<{ id: string; projectName: string }>>([]);
  const [usersOptions, setUsersOptions] = useState<Array<{ id: string; firstName: string; lastName: string }>>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  // Load projects and users for filters
  useEffect(() => {
    const loadOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const [projectsResponse, users] = await Promise.all([
          projectService.getProjects({ page: 1, limit: 1000 }),
          userService.getUsers({ active: true }),
        ]);

        setProjectsOptions(
          projectsResponse.data.map((p) => ({
            id: p.id,
            projectName: p.projectName,
          }))
        );

        setUsersOptions(
          users.map((u) => ({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
          }))
        );
      } catch (error) {
        console.error('Error loading filter options:', error);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateStatus(taskId, newStatus);
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (data: CreateTaskDto | UpdateTaskDto) => {
    if (selectedTask) {
      // Update existing task
      await updateTask(selectedTask.id, data as UpdateTaskDto);
    } else {
      // Create new task
      await createTask(data as CreateTaskDto);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600 mt-1">
              Manage and track all your tasks
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white rounded-lg shadow p-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'kanban'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Kanban View"
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'table'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Table View"
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={refresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            {/* Create Task Button */}
            <button
              onClick={handleCreateTask}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              New Task
            </button>
          </div>
        </div>

        {/* Statistics */}
        <TaskStats stats={stats} isLoading={isLoading && !stats} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className="w-64 flex-shrink-0">
          <TaskFilters
            filters={filters}
            onFiltersChange={updateFilters}
            onReset={resetFilters}
            projectsOptions={projectsOptions}
            usersOptions={usersOptions}
          />
        </div>

        {/* Tasks View */}
        <div className="flex-1 min-w-0">
          {isLoading && tasks.length === 0 ? (
            // Loading state
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Loading tasks...</p>
              </div>
            </div>
          ) : tasks.length === 0 ? (
            // Empty state
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LayoutGrid className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No tasks found
                </h3>
                <p className="text-gray-600 mb-6">
                  Get started by creating your first task or adjust your filters.
                </p>
                <button
                  onClick={handleCreateTask}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5" />
                  Create Task
                </button>
              </div>
            </div>
          ) : viewMode === 'kanban' ? (
            <TaskKanban
              tasks={tasks}
              onTaskClick={handleTaskClick}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <TaskTable
              tasks={tasks}
              onTaskClick={handleTaskClick}
            />
          )}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        onDelete={selectedTask ? handleDeleteTask : undefined}
        task={selectedTask}
        projectsOptions={projectsOptions}
        usersOptions={usersOptions}
      />
    </div>
  );
};