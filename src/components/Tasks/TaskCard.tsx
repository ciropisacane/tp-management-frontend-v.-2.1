// src/components/Tasks/TaskCard.tsx

import { 
    Calendar, 
    User, 
    Clock, 
    AlertCircle,
    CheckCircle2,
    PlayCircle,
    XCircle,
    Flag
  } from 'lucide-react';
  import type { Task } from '../../types/task.types';
  
  interface TaskCardProps {
    task: Task;
    onClick?: () => void;
    isDragging?: boolean;
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
    low: { color: 'text-green-600', bg: 'bg-green-100', label: 'Low' },
    medium: { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Medium' },
    high: { color: 'text-orange-600', bg: 'bg-orange-100', label: 'High' },
    urgent: { color: 'text-red-600', bg: 'bg-red-100', label: 'Urgent' },
  };
  
  export const TaskCard = ({ task, onClick, isDragging = false }: TaskCardProps) => {
    const StatusIcon = statusConfig[task.status].icon;
    
    // Check if overdue
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
    
    // Format date
    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    };
  
    return (
      <div
        onClick={onClick}
        className={`bg-white rounded-lg border p-4 hover:shadow-md transition-all cursor-pointer ${
          isDragging ? 'opacity-50 rotate-2' : ''
        } ${isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
              {task.title}
            </h4>
            {task.project && (
              <p className="text-xs text-gray-500">
                {task.project.projectName}
              </p>
            )}
          </div>
          
          {/* Priority badge */}
          <div className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
            priorityConfig[task.priority].bg
          } ${priorityConfig[task.priority].color}`}>
            <div className="flex items-center gap-1">
              <Flag className="h-3 w-3" />
              {priorityConfig[task.priority].label}
            </div>
          </div>
        </div>
  
        {/* Description */}
        {task.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}
  
        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}
  
        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {/* Due date */}
          <div className="flex items-center gap-3">
            {task.dueDate && (
              <div className={`flex items-center gap-1 ${
                isOverdue ? 'text-red-600 font-medium' : ''
              }`}>
                <Calendar className="h-3 w-3" />
                {formatDate(task.dueDate)}
              </div>
            )}
            
            {/* Estimated hours */}
            {task.estimatedHours && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {task.estimatedHours}h
              </div>
            )}
          </div>
  
          {/* Assigned user */}
          {task.assignedTo && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="truncate max-w-[100px]">
                {task.assignedTo.firstName} {task.assignedTo.lastName.charAt(0)}.
              </span>
            </div>
          )}
        </div>
  
        {/* Overdue warning */}
        {isOverdue && (
          <div className="mt-2 pt-2 border-t border-red-200">
            <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
              <AlertCircle className="h-3 w-3" />
              Overdue
            </div>
          </div>
        )}
      </div>
    );
  };