// Frontend: src/components/Projects/TeamTab.tsx
import { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Mail, User } from 'lucide-react';
import teamService, { type TeamMember } from '../../services/teamService';
import { useToast } from '../../contexts/ToastContext';
import { Loading, Skeleton } from '../Loading';
import AddTeamMemberModal from './AddTeamMemberModal';
import EditTeamMemberModal from './EditTeamMemberModal';

interface TeamTabProps {
  projectId: string;
}

const roleLabels: { [key: string]: string } = {
  project_manager: 'Project Manager',
  senior: 'Senior Consultant',
  consultant: 'Consultant',
  reviewer: 'Reviewer',
  support: 'Support'
};

const roleColors: { [key: string]: string } = {
  project_manager: 'bg-purple-100 text-purple-700',
  senior: 'bg-blue-100 text-blue-700',
  consultant: 'bg-green-100 text-green-700',
  reviewer: 'bg-orange-100 text-orange-700',
  support: 'bg-gray-100 text-gray-700'
};

export default function TeamTab({ projectId }: TeamTabProps) {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const { success, error } = useToast();

  useEffect(() => {
    loadTeam();
  }, [projectId]);

  const loadTeam = async () => {
    try {
      setIsLoading(true);
      const data = await teamService.getProjectTeam(projectId);
      setTeam(data);
    } catch (err: any) {
      console.error('Error loading team:', err);
      error('Failed to load team members');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async (data: any) => {
    try {
      await teamService.addTeamMember(projectId, data);
      success('Team member added successfully');
      await loadTeam();
      setShowAddModal(false);
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to add team member');
      throw err;
    }
  };

  const handleUpdateMember = async (userId: string, data: any) => {
    try {
      await teamService.updateTeamMember(projectId, userId, data);
      success('Team member updated successfully');
      await loadTeam();
      setEditingMember(null);
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to update team member');
      throw err;
    }
  };

  const handleRemoveMember = async (userId: string, name: string) => {
    if (!confirm(`Remove ${name} from this project?`)) return;

    try {
      await teamService.removeTeamMember(projectId, userId);
      success('Team member removed successfully');
      await loadTeam();
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to remove team member');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
            {team.length}
          </span>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Member
        </button>
      </div>

      {/* Team List */}
      {team.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
          <p className="text-gray-600 mb-6">Add team members to start collaborating on this project</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Member
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                {/* Member Info */}
                <div className="flex items-center space-x-4 flex-1">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {member.user.firstName.charAt(0)}
                    {member.user.lastName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {member.user.firstName} {member.user.lastName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          roleColors[member.roleInProject] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {roleLabels[member.roleInProject] || member.roleInProject}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {member.user.email}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {member.user.role}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Allocation */}
                <div className="flex items-center space-x-6 mr-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {member.allocationPercentage}%
                    </p>
                    <p className="text-xs text-gray-500">Allocation</p>
                  </div>
                  {member.user.hourlyRate && (
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">
                        €{member.user.hourlyRate}
                      </p>
                      <p className="text-xs text-gray-500">Hourly Rate</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingMember(member)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit member"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      handleRemoveMember(
                        member.userId,
                        `${member.user.firstName} ${member.user.lastName}`
                      )
                    }
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove member"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Assigned Date */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Assigned on {new Date(member.assignedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddTeamMemberModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddMember}
          projectId={projectId}
        />
      )}

      {editingMember && (
        <EditTeamMemberModal
          isOpen={!!editingMember}
          onClose={() => setEditingMember(null)}
          onSubmit={(data) => handleUpdateMember(editingMember.userId, data)}
          member={editingMember}
        />
      )}
    </div>
  );
}