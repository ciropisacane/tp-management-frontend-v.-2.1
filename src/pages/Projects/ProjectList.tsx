import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import CreateProjectModal from '../../components/Projects/CreateProjectModal';
import EditProjectModal from '../../components/Projects/EditProjectModal';
import DeleteProjectModal from '../../components/Projects/DeleteProjectModal';
import { useAuthStore } from '../../store/authStore';
import type { Project } from '../../types';
import { formatDate, formatCurrency, truncateText } from '../../utils/formatters';
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_BG_COLORS,
  DELIVERABLE_TYPE_LABELS,
  PAGINATION_DEFAULTS
} from '../../utils/constants';
import projectService, { type CreateProjectData, type ProjectFilters } from '../../services/projectService';

const ProjectList = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { user } = useAuthStore();
  
  const [filters, setFilters] = useState<ProjectFilters>({
    page: PAGINATION_DEFAULTS.PAGE,
    limit: PAGINATION_DEFAULTS.LIMIT,
    search: '',
    status: '',
    priority: ''
  });

  const { projects, loading, error, pagination, refetch, setFilters: updateFilters } = useProjects(filters);

  // Update filters when local state changes
  useEffect(() => {
    updateFilters(filters);
  }, [filters, updateFilters]);

  // Handle search input with debounce
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handle filter changes
  const handleFilterChange = (key: keyof ProjectFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchInput('');
    setFilters({
      page: 1,
      limit: PAGINATION_DEFAULTS.LIMIT,
      search: '',
      status: '',
      priority: ''
    });
  };

  // Handle edit
  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  // Handle delete
  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const handleCreateProject = async (data: Omit<CreateProjectData, 'projectManagerId'>) => {
    if (!user?.id) {
      throw new Error('Unable to determine project manager. Please log in again.');
    }

    await projectService.createProject({
      ...data,
      projectManagerId: user.id
    });
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">Manage your Transfer Pricing projects</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={filters.priority || ''}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Priority</option>
              {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters & Actions */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            {(filters.status || filters.priority || filters.search) && (
              <>
                <span className="text-sm text-gray-600">Active filters:</span>
                {filters.status && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    Status: {PROJECT_STATUS_LABELS[filters.status]}
                  </span>
                )}
                {filters.priority && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    Priority: {PRIORITY_LABELS[filters.priority]}
                  </span>
                )}
                {filters.search && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    Search: "{filters.search}"
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all
                </button>
              </>
            )}
          </div>
          
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-900">Error loading projects</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <button
            onClick={() => refetch()}
            className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && !error && (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-gray-600">Loading projects...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && projects.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">No projects found</h3>
              <p className="text-gray-600 mt-2">
                {filters.search || filters.status || filters.priority
                  ? 'Try adjusting your filters'
                  : 'Create your first project to get started'}
              </p>
            </div>
            {!(filters.search || filters.status || filters.priority) && (
              <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Project
              </button>
            )}
          </div>
        </div>
      )}

      {/* Projects Table */}
      {!loading && !error && projects.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {project.client?.name || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {truncateText(project.projectName, 40)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          PM: {project.projectManager?.firstName} {project.projectManager?.lastName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {DELIVERABLE_TYPE_LABELS[project.deliverableType] || project.deliverableType}
                      </div>
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
                      <div className="text-sm text-gray-900">
                        {formatDate(project.deadline)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(project.budget)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/projects/${project.id}`}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleEdit(project)}
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} projects
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    const current = pagination.page;
                    return page === 1 || 
                           page === pagination.totalPages || 
                           (page >= current - 1 && page <= current + 1);
                  })
                  .map((page, idx, arr) => (
                    <>
                      {idx > 0 && arr[idx - 1] !== page - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-lg transition-colors ${
                          page === pagination.page
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    </>
                  ))}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
      />

      {/* Edit Project Modal */}
      <EditProjectModal
        isOpen={showEditModal}
        project={selectedProject}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProject(null);
        }}
        onSuccess={() => {
          refetch();
          setShowEditModal(false);
          setSelectedProject(null);
        }}
      />

      {/* Delete Project Modal */}
      <DeleteProjectModal
        isOpen={showDeleteModal}
        project={selectedProject}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProject(null);
        }}
        onSuccess={() => {
          refetch();
          setShowDeleteModal(false);
          setSelectedProject(null);
        }}
      />
    </div>
  );
};

export default ProjectList;
