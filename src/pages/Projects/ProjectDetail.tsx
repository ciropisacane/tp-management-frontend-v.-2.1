import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Loader2, 
  AlertCircle,
  Calendar,
  DollarSign,
  User,
  Building,
  Target,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { useProject } from '../../hooks/useProjects';
import EditProjectModal from '../../components/Projects/EditProjectModal';
import DeleteProjectModal from '../../components/Projects/DeleteProjectModal';
import TeamTab from '../../components/Projects/TeamTab'; // ← NUOVO IMPORT
import { formatDate, formatCurrency, formatPercentage } from '../../utils/formatters';
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_BG_COLORS,
  DELIVERABLE_TYPE_LABELS
} from '../../utils/constants';

type TabType = 'overview' | 'team' | 'tasks' | 'workflow' | 'documents';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, loading, error, refetch } = useProject(id);
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900">Error Loading Project</h3>
            <p className="text-red-700 mt-2">{error}</p>
            <div className="flex items-center space-x-3 mt-4">
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
              <Link
                to="/projects"
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
              >
                Back to Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Project not found</p>
        <Link
          to="/projects"
          className="mt-4 inline-block text-blue-600 hover:text-blue-700"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'team', label: 'Team', badge: project.team?.length || 0 },
    { id: 'tasks', label: 'Tasks', badge: project._count?.tasks || 0 },
    { id: 'workflow', label: 'Workflow' },
    { id: 'documents', label: 'Documents', badge: project._count?.documents || 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.projectName}</h1>
            <p className="text-gray-600 mt-1">
              {DELIVERABLE_TYPE_LABELS[project.deliverableType]} • Created {formatDate(project.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${PROJECT_STATUS_COLORS[project.status]}`}>
                {PROJECT_STATUS_LABELS[project.status]}
              </span>
            </div>
            <CheckCircle className="w-8 h-8 text-gray-300" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Priority</p>
              <span className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${PRIORITY_BG_COLORS[project.priority]}`}>
                {PRIORITY_LABELS[project.priority]}
              </span>
            </div>
            <Target className="w-8 h-8 text-gray-300" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Deadline</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {formatDate(project.deadline)}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-gray-300" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Budget</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {formatCurrency(project.budget)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-gray-300" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`
                  py-4 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && <OverviewTab project={project} />}
          {activeTab === 'team' && <TeamTab projectId={id!} />} {/* ← SOSTITUITO CON NUOVO COMPONENT */}
          {activeTab === 'tasks' && <TasksTab project={project} />}
          {activeTab === 'workflow' && <WorkflowTab project={project} />}
          {activeTab === 'documents' && <DocumentsTab project={project} />}
        </div>
      </div>

      {/* Edit Project Modal */}
      <EditProjectModal
        isOpen={showEditModal}
        project={project}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          refetch();
          setShowEditModal(false);
        }}
      />

      {/* Delete Project Modal */}
      <DeleteProjectModal
        isOpen={showDeleteModal}
        project={project}
        onClose={() => setShowDeleteModal(false)}
        onSuccess={() => {
          navigate('/projects');
        }}
      />
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ project }: { project: any }) => {
  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
        <p className="text-gray-700">
          {project.description || 'No description available.'}
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Project Details</h3>
          
          <div className="flex items-center space-x-3">
            <Building className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Client</p>
              <p className="font-medium text-gray-900">
                {project.client?.name || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Project Manager</p>
              <p className="font-medium text-gray-900">
                {project.projectManager?.firstName} {project.projectManager?.lastName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Start Date</p>
              <p className="font-medium text-gray-900">
                {formatDate(project.startDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Risk Level</p>
              <p className="font-medium text-gray-900 capitalize">
                {project.riskLevel || 'Not assessed'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Financial</h3>
          
          <div className="flex items-center space-x-3">
            <DollarSign className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Budget</p>
              <p className="font-medium text-gray-900">
                {formatCurrency(project.budget)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Actual Cost</p>
              <p className="font-medium text-gray-900">
                {formatCurrency(project.actualCost) || 'N/A'}
              </p>
            </div>
          </div>

          {project.budget && project.actualCost && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Budget Utilization</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min((project.actualCost / project.budget) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {formatPercentage((project.actualCost / project.budget) * 100, 1)} utilized
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Tasks Tab
const TasksTab = ({ project }: { project: any }) => {
  const taskStats = {
    todo: 5,
    in_progress: 3,
    completed: 12,
    total: 20
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Tasks</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{taskStats.total}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-600">To Do</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{taskStats.todo}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <p className="text-sm text-yellow-600">In Progress</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">{taskStats.in_progress}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-600">Completed</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{taskStats.completed}</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Project Tasks</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          + New Task
        </button>
      </div>

      {/* Tasks List Placeholder */}
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 font-medium">Task list implementation</p>
        <p className="text-sm text-gray-500 mt-1">Full task CRUD will be implemented next</p>
        <p className="text-xs text-gray-400 mt-2">Stats shown are mock data for demonstration</p>
      </div>
    </div>
  );
};

// Workflow Tab
const WorkflowTab = ({ project }: { project: any }) => {
  // Mock workflow steps based on project status
  const workflowSteps = [
    { name: 'Planning', status: 'completed', order: 1 },
    { name: 'Data Collection', status: 'completed', order: 2 },
    { name: 'Benchmarking', status: 'in_progress', order: 3 },
    { name: 'Draft Preparation', status: 'pending', order: 4 },
    { name: 'Internal Review', status: 'pending', order: 5 },
    { name: 'Client Review', status: 'pending', order: 6 },
    { name: 'Finalization', status: 'pending', order: 7 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      default: return 'Pending';
    }
  };

  const completedSteps = workflowSteps.filter(s => s.status === 'completed').length;
  const progress = (completedSteps / workflowSteps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
            <p className="text-sm text-gray-600 mt-1">
              {completedSteps} of {workflowSteps.length} steps completed
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-600">{Math.round(progress)}%</p>
          </div>
        </div>
        <div className="w-full bg-white rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="space-y-4">
        {workflowSteps.map((step, index) => (
          <div key={step.order} className="flex items-start space-x-4">
            {/* Step Number & Line */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(step.status)} text-white font-semibold`}>
                {step.order}
              </div>
              {index < workflowSteps.length - 1 && (
                <div className={`w-0.5 h-12 ${step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`} />
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{step.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">Step {step.order} of {workflowSteps.length}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  step.status === 'completed' 
                    ? 'bg-green-100 text-green-800'
                    : step.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {getStatusText(step.status)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> This is a mock workflow visualization. Full workflow management with real data will be implemented next.
        </p>
      </div>
    </div>
  );
};

// Documents Tab
const DocumentsTab = ({ project }: { project: any }) => {
  // Mock documents
  const documents = [
    { id: 1, name: 'Transfer Pricing Policy.pdf', type: 'POLICY', size: 2.4, uploadedAt: '2024-12-15', uploadedBy: 'John Doe' },
    { id: 2, name: 'Benchmarking Study.xlsx', type: 'ANALYSIS', size: 1.8, uploadedAt: '2024-12-10', uploadedBy: 'Jane Smith' },
    { id: 3, name: 'Draft Report.docx', type: 'DRAFT', size: 3.2, uploadedAt: '2024-12-05', uploadedBy: 'Mike Johnson' }
  ];

  const formatFileSize = (mb: number) => {
    return mb < 1 ? `${(mb * 1024).toFixed(0)} KB` : `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium mb-2">Upload documents</p>
          <p className="text-sm text-gray-500 mb-4">Drag and drop files here, or click to browse</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            Choose Files
          </button>
          <p className="text-xs text-gray-400 mt-3">Supported: PDF, DOCX, XLSX, PPTX (Max 10MB)</p>
        </div>
      </div>

      {/* Documents List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents ({documents.length})</h3>
        
        {documents.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{doc.type}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatFileSize(doc.size)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{doc.uploadedBy}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{doc.uploadedAt}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">Download</button>
                      <button className="text-red-600 hover:text-red-700 text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No documents uploaded yet</p>
          </div>
        )}
      </div>

      {/* Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Document management shows mock data. Full document upload/download will be implemented next.
        </p>
      </div>
    </div>
  );
};

export default ProjectDetail;