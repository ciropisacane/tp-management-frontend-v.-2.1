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
  ArrowRight
} from 'lucide-react';
import projectService from '../services/projectService';
import { useAuthStore } from '../store/authStore';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    activeProjects: 0,
    pendingTasks: 0,
    teamMembers: 0,
    hoursThisMonth: 0
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [projectsByStatus, setProjectsByStatus] = useState<any[]>([]);
  const [projectsByPriority, setProjectsByPriority] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all projects
      const response = await projectService.getProjects({ limit: 100 });
      const projects = response.data || [];

      // Calculate stats
      const activeProjects = projects.filter(p => 
        !['COMPLETED', 'CANCELLED', 'ON_HOLD'].includes(p.status)
      ).length;

      setStats({
        activeProjects,
        pendingTasks: 24, // Mock for now
        teamMembers: 8, // Mock for now
        hoursThisMonth: 156 // Mock for now
      });

      // Recent projects (top 5)
      setRecentProjects(projects.slice(0, 5));

      // Group by status
      const statusGroups = projects.reduce((acc: any, project: any) => {
        const status = project.status;
        if (!acc[status]) acc[status] = 0;
        acc[status]++;
        return acc;
      }, {});

      const statusData = Object.entries(statusGroups).map(([status, count]) => ({
        name: PROJECT_STATUS_LABELS[status] || status,
        value: count
      }));
      setProjectsByStatus(statusData);

      // Group by priority
      const priorityGroups = projects.reduce((acc: any, project: any) => {
        const priority = project.priority;
        if (!acc[priority]) acc[priority] = 0;
        acc[priority]++;
        return acc;
      }, {});

      const priorityData = Object.entries(priorityGroups).map(([priority, count]) => ({
        name: PRIORITY_LABELS[priority as string] || priority,
        value: count
      }));
      setProjectsByPriority(priorityData);

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-red-900">Error Loading Dashboard</h3>
            <p className="text-red-700 mt-2">{error}</p>
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
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-3xl font-bold mt-2 text-blue-600">{stats.activeProjects}</p>
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
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-3xl font-bold mt-2 text-yellow-600">{stats.pendingTasks}</p>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1 text-gray-400" />
                5 overdue
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <CheckSquare className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-3xl font-bold mt-2 text-green-600">{stats.teamMembers}</p>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1 text-gray-400" />
                2 on leave
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hours This Month</p>
              <p className="text-3xl font-bold mt-2 text-purple-600">{stats.hoursThisMonth}</p>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                +12% vs last month
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
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
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
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
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectsByPriority.map((entry, index) => (
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

      {/* Recent Projects Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
            <p className="text-sm text-gray-600 mt-1">Projects you're currently working on</p>
          </div>
          <Link
            to="/projects"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {recentProjects.length > 0 ? (
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
                    Budget
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4">
                      <Link 
                        to={`/projects/${project.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        {project.projectName}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{project.client?.name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${PROJECT_STATUS_COLORS[project.status]}`}>
                        {PROJECT_STATUS_LABELS[project.status] || project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${PRIORITY_BG_COLORS[project.priority]}`}>
                        {PRIORITY_LABELS[project.priority] || project.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{formatDate(project.deadline)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{formatCurrency(project.budget)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/projects"
              className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium block"
            >
              + Create New Project
            </Link>
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
                <p className="text-sm font-medium text-gray-900">Local File - ABC Corp</p>
                <p className="text-xs text-gray-500">Due in 3 days</p>
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                Urgent
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Master File - XYZ Ltd</p>
                <p className="text-xs text-gray-500">Due in 5 days</p>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                Soon
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="text-sm">
              <p className="text-gray-900 font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-gray-500 text-xs">Logged in to dashboard</p>
              <p className="text-gray-400 text-xs mt-1">Just now</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-900 font-medium">System</p>
              <p className="text-gray-500 text-xs">Dashboard data refreshed</p>
              <p className="text-gray-400 text-xs mt-1">1 minute ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;