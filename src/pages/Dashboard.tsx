import { 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  // Mock data (verrà sostituito con dati reali dall'API)
  const stats = [
    {
      label: 'Active Projects',
      value: '12',
      change: '+2 this week',
      icon: FolderKanban,
      color: 'blue',
      trend: 'up'
    },
    {
      label: 'Pending Tasks',
      value: '24',
      change: '5 overdue',
      icon: CheckSquare,
      color: 'yellow',
      trend: 'neutral'
    },
    {
      label: 'Team Members',
      value: '8',
      change: '2 on leave',
      icon: Users,
      color: 'green',
      trend: 'neutral'
    },
    {
      label: 'Hours This Month',
      value: '156',
      change: '+12% vs last month',
      icon: Clock,
      color: 'purple',
      trend: 'up'
    }
  ];

  const recentProjects = [
    {
      id: 1,
      name: 'TP Local File 2024 - ABC Corp',
      client: 'ABC Corporation',
      status: 'IN_PROGRESS',
      priority: 'high',
      deadline: '2024-12-31',
      progress: 65
    },
    {
      id: 2,
      name: 'Master File Update - XYZ Ltd',
      client: 'XYZ Limited',
      status: 'INTERNAL_REVIEW',
      priority: 'medium',
      deadline: '2024-11-15',
      progress: 85
    },
    {
      id: 3,
      name: 'CbCR Report - Global Inc',
      client: 'Global Inc',
      status: 'PLANNING',
      priority: 'high',
      deadline: '2024-10-30',
      progress: 25
    }
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'INTERNAL_REVIEW': 'bg-yellow-100 text-yellow-800',
      'PLANNING': 'bg-gray-100 text-gray-800',
      'COMPLETED': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'high': 'text-red-600',
      'medium': 'text-yellow-600',
      'low': 'text-green-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your projects.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className={`text-3xl font-bold mt-2 text-${stat.color}-600`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 flex items-center">
                    {stat.trend === 'up' && <TrendingUp className="w-3 h-3 mr-1 text-green-500" />}
                    {stat.trend === 'neutral' && <AlertCircle className="w-3 h-3 mr-1 text-gray-400" />}
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 bg-${stat.color}-50 rounded-lg`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Projects Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
            <p className="text-sm text-gray-600 mt-1">Projects you're currently working on</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            View All Projects
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{project.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{project.client}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium capitalize ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{project.deadline}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{project.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
              + Create New Project
            </button>
            <button className="w-full text-left px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
              + Add Task
            </button>
            <button className="w-full text-left px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
              + Upload Document
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">ABC Corp - Local File</p>
                <p className="text-xs text-gray-500">Due in 3 days</p>
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                Urgent
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">XYZ Ltd - Review</p>
                <p className="text-xs text-gray-500">Due in 5 days</p>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                Soon
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Activity</h3>
          <div className="space-y-3">
            <div className="text-sm">
              <p className="text-gray-900 font-medium">Mario Rossi</p>
              <p className="text-gray-500 text-xs">Completed task on ABC Corp project</p>
              <p className="text-gray-400 text-xs mt-1">2 hours ago</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-900 font-medium">Laura Bianchi</p>
              <p className="text-gray-500 text-xs">Updated XYZ Ltd documentation</p>
              <p className="text-gray-400 text-xs mt-1">4 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;