// Frontend: src/services/teamService.ts
import api from './api';

export interface TeamMember {
  id: string;
  projectId: string;
  userId: string;
  roleInProject: string;
  allocationPercentage: number;
  assignedDate: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    hourlyRate?: number;
  };
}

export interface AddTeamMemberDto {
  userId: string;
  roleInProject: string;
  allocationPercentage: number;
  assignedDate?: string;
}

export interface AvailableUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  hourlyRate?: number;
}

class TeamService {
  // Get project team
  async getProjectTeam(projectId: string): Promise<TeamMember[]> {
    const response = await api.get<{ success: boolean; data: TeamMember[] }>(
      `/projects/${projectId}/team`
    );
    return response.data.data;
  }

  // Get available users
  async getAvailableUsers(projectId: string): Promise<AvailableUser[]> {
    const response = await api.get<{ success: boolean; data: AvailableUser[] }>(
      `/projects/${projectId}/team/available`
    );
    return response.data.data;
  }

  // Add team member
  async addTeamMember(projectId: string, data: AddTeamMemberDto): Promise<TeamMember> {
    const response = await api.post<{ success: boolean; data: TeamMember }>(
      `/projects/${projectId}/team`,
      data
    );
    return response.data.data;
  }

  // Update team member
  async updateTeamMember(
    projectId: string,
    userId: string,
    data: Partial<AddTeamMemberDto>
  ): Promise<TeamMember> {
    const response = await api.put<{ success: boolean; data: TeamMember }>(
      `/projects/${projectId}/team/${userId}`,
      data
    );
    return response.data.data;
  }

  // Remove team member
  async removeTeamMember(projectId: string, userId: string): Promise<void> {
    await api.delete(`/projects/${projectId}/team/${userId}`);
  }
}

export default new TeamService();