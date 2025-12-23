import { useState, useEffect } from 'react';
import { X, Building2, FileText, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import clientService, { type Client } from '../../services/clientService';
import { formatDateForApi } from '../../utils/formatters';
import { CurrencyInput } from '../Common/CurrencyInput';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

const deliverableTypes = [
  { value: 'LOCAL_FILE', label: 'Local File' },
  { value: 'MASTER_FILE', label: 'Master File' },
  { value: 'BENCHMARK_ANALYSIS', label: 'Benchmark Analysis' },
  { value: 'IC_AGREEMENT', label: 'Intercompany Agreement' },
  { value: 'TP_POLICY', label: 'TP Policy' },
  { value: 'AOA_REPORT', label: 'AOA Report' },
  { value: 'TRANSACTION_REPORT', label: 'Transaction Report' },
  { value: 'TP_AUDIT_SUPPORT', label: 'TP Audit Support' },
  { value: 'SETTLEMENT_PROCEDURE', label: 'Settlement Procedure' },
  { value: 'APA_MAP_NEGOTIATION', label: 'APA/MAP Negotiation' },
  { value: 'TP_PLANNING', label: 'TP Planning' },
  { value: 'DISPUTE_RESOLUTION', label: 'Dispute Resolution' },
  { value: 'IP_VALUATION', label: 'IP Valuation' },
  { value: 'CBCR_SUPPORT', label: 'CbCR Support' },
  { value: 'LF_COMMENT_REVIEW', label: 'Local File Comment Review' },
  { value: 'MF_COMMENT_REVIEW', label: 'Master File Comment Review' }
];

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
];

const riskLevels = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

export default function CreateProjectModal({ isOpen, onClose, onSubmit }: CreateProjectModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  const [formData, setFormData] = useState({
    clientId: '',
    projectName: '',
    deliverableType: 'LOCAL_FILE',
    priority: 'medium',
    riskLevel: 'medium',
    startDate: '',
    deadline: '',
    estimatedHours: '',
    budget: '',
    description: ''
  });

  // Load clients when modal opens
  useEffect(() => {
    if (isOpen) {
      loadClients();
    }
  }, [isOpen]);

  const loadClients = async () => {
    try {
      setLoadingClients(true);
      setError(null);
      const clientsList = await clientService.getAllClients(true);
      setClients(clientsList);
      
      // Auto-select first client if only one exists
      if (clientsList.length === 1) {
        setFormData(prev => ({ ...prev, clientId: clientsList[0].id }));
      }
    } catch (err: any) {
      console.error('Error loading clients:', err);
      setError('Failed to load clients. Please refresh and try again.');
    } finally {
      setLoadingClients(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.clientId) {
      setError('Please select a client');
      return;
    }

    if (!formData.projectName.trim()) {
      setError('Project name is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Prepare data for API
      const projectData = {
        clientId: formData.clientId,
        projectName: formData.projectName.trim(),
        deliverableType: formData.deliverableType,
        priority: formData.priority,
        riskLevel: formData.riskLevel,
        startDate: formatDateForApi(formData.startDate) || undefined,
        deadline: formatDateForApi(formData.deadline) || undefined,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        description: formData.description.trim() || undefined
      };

      await onSubmit(projectData);
      handleClose();
    } catch (err: any) {
      console.error('Error creating project:', err);
      setError(err.response?.data?.error || err.message || 'Failed to create project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      clientId: '',
      projectName: '',
      deliverableType: 'LOCAL_FILE',
      priority: 'medium',
      riskLevel: 'medium',
      startDate: '',
      deadline: '',
      estimatedHours: '',
      budget: '',
      description: ''
    });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800 font-medium">Error</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* No Clients Warning */}
          {!loadingClients && clients.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>No clients found.</strong> You need to create a client first before creating a project.
              </p>
              <button
                type="button"
                onClick={() => window.open('/clients', '_blank')}
                className="mt-2 text-sm text-yellow-700 underline hover:text-yellow-900"
              >
                Go to Clients page →
              </button>
            </div>
          )}

          {/* Client Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client <span className="text-red-500">*</span>
            </label>
            {loadingClients ? (
              <div className="border border-gray-300 rounded-lg px-4 py-3 text-gray-500 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600 mr-2"></div>
                Loading clients...
              </div>
            ) : (
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={clients.length === 0}
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} {client.industry ? `(${client.industry})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter project name"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Deliverable Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deliverable Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.deliverableType}
              onChange={(e) => setFormData({ ...formData, deliverableType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoading}
            >
              {deliverableTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority & Risk Level Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Level
              </label>
              <select
                value={formData.riskLevel}
                onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              >
                {riskLevels.map((risk) => (
                  <option key={risk.value} value={risk.value}>
                    {risk.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Budget & Hours Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget
                </label>
                <input
                  type="number"
                  value={formData.budget || ''}
                  onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter budget"
                />
              </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget (€)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 50000"
                  min="0"
                  step="0.01"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Enter project description, objectives, or notes..."
              disabled={isLoading}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || clients.length === 0 || loadingClients}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
