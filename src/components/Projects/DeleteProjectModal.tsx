import { useState } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import projectService from '../../services/projectService';
import type { Project } from '../../types';

interface DeleteProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteProjectModal = ({ isOpen, project, onClose, onSuccess }: DeleteProjectModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async () => {
    if (!project) return;

    setLoading(true);
    setError(null);

    try {
      await projectService.deleteProject(project.id);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error deleting project:', error);
      setError(error.response?.data?.message || 'Failed to delete project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setConfirmText('');
      setError(null);
      onClose();
    }
  };

  if (!isOpen || !project) return null;

  const isConfirmValid = confirmText === project.projectName;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Delete Project</h2>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-gray-700">
                Are you sure you want to delete this project? This action cannot be undone.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-sm font-medium text-gray-900">
                  {project.projectName}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Project ID: {project.id}
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> This will delete all associated data including tasks, documents, and team assignments.
              </p>
            </div>

            {/* Confirmation Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type the project name to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                disabled={loading}
                placeholder={project.projectName}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
              />
              {confirmText && !isConfirmValid && (
                <p className="text-xs text-red-600 mt-1">
                  Project name doesn't match
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading || !isConfirmValid}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>Delete Project</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProjectModal;