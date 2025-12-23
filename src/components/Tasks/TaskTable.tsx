// src/components/Tasks/TaskTable.tsx

import { 
    Calendar, 
    User, 
    Clock,
    Flag,
    MoreVertical,
    CheckCircle2,
    PlayCircle,
    AlertCircle,
    XCircle
  } from 'lucide-react';
  import type { Task } from '../../types/task.types';
  
  interface TaskTableProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
  }
  
  const statusConfig = {
    todo: { 
      icon: Clock, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      label: 'To Do' 
    },
    in_progress: { 
      icon: PlayCircle, 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-50',
      label: 'In Progress' 
    },
    review: { 
      icon: AlertCircle, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      label: 'Review' 
    },
    completed: { 
      icon: CheckCircle2, 
      color: 'text-green-600', 
      bg: 'bg-green-50',
      label: 'Completed' 
    },
    blocked: { 
      icon: XCircle, 
      color: 'text-red-600', 
      bg: 'bg-red-50',
      label: 'Blocked' 
    },
  };
  
  const priorityConfig = {
    low: { color: 'text-green-600', label: 'Low' },
    medium: { color: 'text-yellow-600', label: 'Medium' },
    high: { color: 'text-orange-600', label: 'High' },
    urgent: { color: 'text-red-600', label: 'Urgent' },
  };
  
  export const TaskTable = ({ tasks, onTaskClick }: TaskTableProps) => {
    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };
  
    const isOverdue = (task: Task) => {
      return task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
    };
  
    if (tasks.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No tasks found</p>
        </div>
      );
    }
  
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => {
                const StatusIcon = statusConfig[task.status].icon;
                const overdueTask = isOverdue(task);
  
                return (
                  <tr
                    key={task.id}
                    onClick={() => onTaskClick(task)}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      overdueTask ? 'bg-red-50' : ''
                    }`}
                  >
                    {/* Task Title */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {task.title}
                        </span>
                        {task.description && (
                          <span className="text-sm text-gray-500 line-clamp-1">
                            {task.description}
                          </span>
                        )}
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {task.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {task.tags.length > 2 && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                +{task.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
  
                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        statusConfig[task.status].bg
                      } ${statusConfig[task.status].color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig[task.status].label}
                      </span>
                    </td>
  
                    {/* Priority */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        priorityConfig[task.priority].color
                      }`}>
                        <Flag className="h-4 w-4" />
                        {priorityConfig[task.priority].label}
                      </div>
                    </td>
  
                    {/* Project */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {task.project ? (
                        <span className="text-sm text-gray-900">
                          {task.project.projectName}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
  
                    {/* Assigned To */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {task.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="text-sm text-gray-900">
                            {task.assignedTo.firstName} {task.assignedTo.lastName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Unassigned</span>
                      )}
                    </td>
  
                    {/* Due Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {task.dueDate ? (
                        <div className={`flex items-center gap-1 text-sm ${
                          overdueTask ? 'text-red-600 font-medium' : 'text-gray-900'
                        }`}>
                          <Calendar className="h-4 w-4" />
                          {formatDate(task.dueDate)}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
  
                    {/* Hours */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {task.estimatedHours ? (
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <Clock className="h-4 w-4" />
                          {task.actualHours || 0}/{task.estimatedHours}h
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
  
                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskClick(task);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  