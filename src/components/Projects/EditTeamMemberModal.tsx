// Frontend: src/components/Projects/EditTeamMemberModal.tsx
import { useState } from 'react';
import { X, UserCircle, Percent, AlertCircle } from 'lucide-react';
import { type TeamMember } from '../../services/teamService';
import { Spinner } from '../Loading';

interface EditTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  member: TeamMember;
}

const roles = [
  { value: 'project_manager', label: 'Project Manager' },
  { value: 'senior', label: 'Senior Consultant' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'reviewer', label: 'Reviewer' },
  { value: 'support', label: 'Support' }
];

export default function EditTeamMemberModal({
  isOpen,
  onClose,
  onSubmit,
  member
}: EditTeamMemberModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    roleInProject: member.roleInProject,
    allocationPercentage: member.allocationPercentage
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update team member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Edit Team Member</h2>
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

          {/* Member Name (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Member</label>
            <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                {member.user.firstName.charAt(0)}
                {member.user.lastName.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {member.user.firstName} {member.user.lastName}
                </p>
                <p className="text-sm text-gray-600">{member.user.email}</p>
              </div>
            </div>
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

          {/* Allocation Percentage */}
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
              disabled={isLoading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2 text-white" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}