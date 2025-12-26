// src/components/Tasks/TaskKanban.tsx

import { useState } from 'react';
import { TaskCard } from './TaskCard';
import type { Task, TaskStatus } from '../../types/task.types';

interface TaskKanbanProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => Promise<void>;
}

const columns: Array<{ id: TaskStatus; title: string; color: string }> = [
  { id: 'todo', title: 'To Do', color: 'bg-blue-100 border-blue-300' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-yellow-100 border-yellow-300' },
  { id: 'review', title: 'In Review', color: 'bg-purple-100 border-purple-300' },
  { id: 'completed', title: 'Completed', color: 'bg-green-100 border-green-300' },
  { id: 'blocked', title: 'Blocked', color: 'bg-red-100 border-red-300' },
];

export const TaskKanban = ({ tasks, onTaskClick, onStatusChange }: TaskKanbanProps) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  // Group tasks by status
  const tasksByStatus = columns.reduce((acc, column) => {
    acc[column.id] = tasks.filter((task) => task.status === column.id);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    
    if (draggedTask && draggedTask.status !== newStatus) {
      try {
        await onStatusChange(draggedTask.id, newStatus);
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    }
    
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnTasks = tasksByStatus[column.id] || [];
        const isDropTarget = dragOverColumn === column.id;
        
        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-80"
          >
            {/* Column Header */}
            <div className={`rounded-t-lg border-2 border-b-0 p-3 ${column.color}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  {column.title}
                </h3>
                <span className="px-2 py-1 bg-white rounded text-sm font-medium">
                  {columnTasks.length}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`min-h-[500px] bg-gray-50 rounded-b-lg border-2 border-t-0 p-3 space-y-3 transition-colors ${
                column.color
              } ${isDropTarget ? 'bg-blue-50 border-blue-400' : ''}`}
            >
              {columnTasks.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                  No tasks
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    onDragEnd={handleDragEnd}
                    className="cursor-move"
                  >
                    <TaskCard
                      task={task}
                      onClick={() => onTaskClick(task)}
                      isDragging={draggedTask?.id === task.id}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};