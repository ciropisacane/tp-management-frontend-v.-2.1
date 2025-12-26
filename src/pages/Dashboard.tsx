import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Clock,
  TrendingUp,
  AlertCircle,
  Loader2,
  ArrowRight,
  Building2
} from 'lucide-react';
import dashboardService from '../services/dashboardService';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../contexts/ToastContext';
import { formatDate, formatCurrency } from '../utils/formatters';
import {
  PROJECT_STATUS_COLORS,
  PROJECT_STATUS_LABELS,
  PRIORITY_BG_COLORS,
  PRIORITY_LABELS
} from '../utils/constants';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { error: showErrorToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch real dashboard stats from backend
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      const errorMessage = err.response?.data?.error || 'Failed to load dashboard data';
      setError(errorMessage);
      showErrorToast('Failed to load dashboard', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-red-900">Error Loading Dashboard</h3>
            <p className="text-red-700 mt-2">{error || 'Failed to load data'}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const projectsByStatus = stats.projectsByStatus.map((item: any) => ({
    name: PROJECT_STATUS_LABELS[item.status] || item.status.replace(/_/g, ' '),
    value: item.count
  }));

  const projectsByPriority = stats.projectsByPriority.map((item: any) => ({
    name: PRIORITY_LABELS[item.priority] || item.priority,
    value: item.count
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}! Here's what's happening with your projects.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-3xl font-bold mt-2 text-blue-600">{stats.totalProjects}</p>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                Real-time data
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FolderKanban className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-3xl font-bold mt-2 text-green-600">{stats.activeProjects}</p>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1 text-gray-400" />
                In progress
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckSquare className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold mt-2 text-purple-600">{stats.completedProjects}</p>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                Delivered
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <CheckSquare className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-3xl font-bold mt-2 text-orange-600">{stats.totalClients}</p>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <Building2 className="w-3 h-3 mr-1 text-gray-400" />
                Total clients
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects by Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects by Status</h3>
          {projectsByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectsByStatus}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>

        {/* Projects by Priority */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects by Priority</h3>
          {projectsByPriority.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectsByPriority}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectsByPriority.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row - Recent Projects & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
              <p className="text-sm text-gray-600 mt-1">Latest projects in the system</p>
            </div>
            <Link
              to="/projects"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {stats.recentProjects && stats.recentProjects.length > 0 ? (
            <div className="p-4 space-y-3">
              {stats.recentProjects.map((project: any) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{project.projectName}</p>
                      <p className="text-sm text-gray-600">{project.client?.name}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{project.progress}%</p>
                        <p className="text-xs text-gray-500">{PROJECT_STATUS_LABELS[project.status]}</p>
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-500">No projects found</p>
              <Link
                to="/projects"
                className="mt-4 inline-block text-blue-600 hover:text-blue-700"
              >
                Create your first project
              </Link>
            </div>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
            <p className="text-sm text-gray-600 mt-1">Projects due in the next 30 days</p>
          </div>

          {stats.upcomingDeadlines && stats.upcomingDeadlines.length > 0 ? (
            <div className="p-4 space-y-3">
              {stats.upcomingDeadlines.map((project: any) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{project.projectName}</p>
                      <p className="text-sm text-gray-600">{project.client?.name}</p>
                    </div>
                    <div className="text-right">
                      {project.daysUntilDeadline !== null && (
                        <>
                          <p className={`text-sm font-medium ${
                            project.daysUntilDeadline <= 7 ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {project.daysUntilDeadline} days
                          </p>
                          {project.deadline && (
                            <p className="text-xs text-gray-500">
                              {formatDate(project.deadline)}
                            </p>
                          )}
                        </>
                      )}
                      {project.daysUntilDeadline !== null && project.daysUntilDeadline <= 7 && (
                        <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                          Urgent
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming deadlines</p>
              <p className="text-sm text-gray-400 mt-1">All projects are on track!</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/projects"
            className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all text-center font-medium"
          >
            + Create New Project
          </Link>
          <Link
            to="/clients"
            className="px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all text-center font-medium"
          >
            + Add New Client
          </Link>
          <button className="px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all text-center font-medium">
            + Upload Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;