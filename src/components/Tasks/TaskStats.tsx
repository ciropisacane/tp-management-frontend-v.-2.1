// src/components/Tasks/TaskStats.tsx

import { 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    PlayCircle,
    XCircle,
    TrendingUp 
  } from 'lucide-react';
  import type { TaskStats as TaskStatsType } from '../../types/task.types';
  
  interface TaskStatsProps {
    stats: TaskStatsType | null;
    isLoading?: boolean;
  }
  
  export const TaskStats = ({ stats, isLoading }: TaskStatsProps) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      );
    }
  
    if (!stats) return null;

    const safeStats = {
      total: stats.total ?? 0,
      overdue: stats.overdue ?? 0,
      byStatus: {
        todo: stats.byStatus?.todo ?? 0,
        in_progress: stats.byStatus?.in_progress ?? 0,
        review: stats.byStatus?.review ?? 0,
        completed: stats.byStatus?.completed ?? 0,
        blocked: stats.byStatus?.blocked ?? 0,
      },
    };

    const statCards = [
      {
        label: 'Total Tasks',
        value: safeStats.total,
        icon: TrendingUp,
        color: 'text-gray-600',
        bg: 'bg-gray-50',
      },
      {
        label: 'To Do',
        value: safeStats.byStatus.todo,
        icon: Clock,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
      },
      {
        label: 'In Progress',
        value: safeStats.byStatus.in_progress,
        icon: PlayCircle,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
      },
      {
        label: 'In Review',
        value: safeStats.byStatus.review,
        icon: AlertCircle,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
      },
      {
        label: 'Completed',
        value: safeStats.byStatus.completed,
        icon: CheckCircle2,
        color: 'text-green-600',
        bg: 'bg-green-50',
      },
      {
        label: 'Overdue',
        value: safeStats.overdue,
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-50',
      },
    ];
  
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>
    );
  };
