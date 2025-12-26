// src/components/Projects/ProjectTasksTab.tsx

import { useState, useEffect } from 'react';
import { Plus, LayoutGrid, List, RefreshCw } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { TaskStats } from '../../components/Tasks/TaskStats';
import { TaskKanban } from '../../components/Tasks/TaskKanban';
import { TaskTable } from '../../components/Tasks/TaskTable';
import { TaskModal } from '../../components/Tasks/TaskModal';
import userService from '../../services/userService';
import type { Task, TaskStatus, CreateTaskDto, UpdateTaskDto } from '../../types/task.types';

interface ProjectTasksTabProps {
  projectId: string;
  projectName: string;
}

type ViewMode = 'kanban' | 'table';

export const ProjectTasksTab = ({ projectId, projectName }: ProjectTasksTabProps) => {
  const {
    tasks,
    stats,
    isLoading,
    error,
    updateStatus,
    createTask,
    updateTask,
    deleteTask,
    refresh,
  } = useTasks({ projectId });

  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Users for assignment dropdown
  const [usersOptions, setUsersOptions] = useState<Array<{ id: string; firstName: string; lastName: string }>>([]);

  // Load users for assignment
  useEffect(() => {
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

    loadUsers();
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
    // Ensure projectId is set when creating from project context
    const taskData = {
      ...data,
      projectId: projectId,
    };

    if (selectedTask) {
      await updateTask(selectedTask.id, taskData as UpdateTaskDto);
    } else {
      await createTask(taskData as CreateTaskDto);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Project Tasks</h3>
          <p className="text-sm text-gray-600 mt-1">
            Tasks for {projectName}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white rounded-lg border p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Kanban View"
            >
              <LayoutGrid className="h-4 w-4" />
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
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Refresh */}
          <button
            onClick={refresh}
            disabled={isLoading}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Create Task Button */}
          <button
            onClick={handleCreateTask}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* Statistics */}
      <TaskStats stats={stats} isLoading={isLoading && !stats} />

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Tasks View */}
      {isLoading && tasks.length === 0 ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg border">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Loading tasks...</p>
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutGrid className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              No tasks yet
            </h4>
            <p className="text-gray-600 mb-6">
              Create your first task for this project.
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

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        onDelete={selectedTask ? handleDeleteTask : undefined}
        task={selectedTask}
        projectId={projectId}
        usersOptions={usersOptions}
      />
    </div>
  );
};