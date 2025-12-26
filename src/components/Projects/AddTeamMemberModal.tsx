// Frontend: src/components/Projects/AddTeamMemberModal.tsx
import { useState, useEffect } from 'react';
import { X, User, UserCircle, Percent, Calendar, AlertCircle } from 'lucide-react';
import teamService, { type AvailableUser } from '../../services/teamService';
import { Spinner } from '../Loading';

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  projectId: string;
}

const roles = [
  { value: 'project_manager', label: 'Project Manager' },
  { value: 'senior', label: 'Senior Consultant' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'reviewer', label: 'Reviewer' },
  { value: 'support', label: 'Support' }
];

export default function AddTeamMemberModal({
  isOpen,
  onClose,
  onSubmit,
  projectId
}: AddTeamMemberModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    userId: '',
    roleInProject: 'consultant',
    allocationPercentage: 100,
    assignedDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (isOpen) {
      loadAvailableUsers();
    }
  }, [isOpen, projectId]);

  const loadAvailableUsers = async () => {
    try {
      setLoadingUsers(true);
      setError(null);
      const users = await teamService.getAvailableUsers(projectId);
      setAvailableUsers(users);
    } catch (err: any) {
      console.error('Error loading users:', err);
      setError('Failed to load available users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId) {
      setError('Please select a user');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add team member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      userId: '',
      roleInProject: 'consultant',
      allocationPercentage: 100,
      assignedDate: new Date().toISOString().split('T')[0]
    });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Add Team Member</h2>
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

          {/* No Users Warning */}
          {!loadingUsers && availableUsers.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>No available users.</strong> All active users are already members of this project.
              </p>
            </div>
          )}

          {/* User Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User <span className="text-red-500">*</span>
            </label>
            {loadingUsers ? (
              <div className="border border-gray-300 rounded-lg px-4 py-3 flex items-center text-gray-500">
                <Spinner size="sm" className="mr-2" />
                Loading users...
              </div>
            ) : (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={availableUsers.length === 0}
                >
                  <option value="">Select a user</option>
                  {availableUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} - {user.email} ({user.role})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Role in Project */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role in Project <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={formData.roleInProject}
                onChange={(e) => setFormData({ ...formData, roleInProject: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isLoading}
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Allocation & Date Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allocation % <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.allocationPercentage}
                  onChange={(e) =>
                    setFormData({ ...formData, allocationPercentage: parseInt(e.target.value) })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="100"
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">How much time allocated to this project</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.assignedDate}
                  onChange={(e) => setFormData({ ...formData, assignedDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
            </div>
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
              disabled={isLoading || availableUsers.length === 0 || loadingUsers}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2 text-white" />
                  Adding...
                </>
              ) : (
                'Add Member'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}