import api from './api';

export interface Client {
  id: string;
  name: string;
  industry?: string;
  country?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  billingAddress?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientDto {
  name: string;
  industry?: string;
  country?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  billingAddress?: string;
  notes?: string;
}

class ClientService {
  // Get all clients
  async getAllClients(activeOnly: boolean = true): Promise<Client[]> {
    const response = await api.get<Client[]>('/clients', {
      params: { active: activeOnly }
    });
    return response.data;
  }

  // Get client by ID
  async getClientById(id: string): Promise<Client> {
    const response = await api.get<Client>(`/clients/${id}`);
    return response.data;
  }

  // Create new client
  async createClient(data: CreateClientDto): Promise<Client> {
    const response = await api.post<Client>('/clients', data);
    return response.data;
  }

  // Update client
  async updateClient(id: string, data: Partial<CreateClientDto>): Promise<Client> {
    const response = await api.put<Client>(`/clients/${id}`, data);
    return response.data;
  }

  // Delete client
  async deleteClient(id: string): Promise<void> {
    await api.delete(`/clients/${id}`);
  }

  // Get client projects
  async getClientProjects(id: string): Promise<any[]> {
    const response = await api.get(`/clients/${id}/projects`);
    return response.data;
  }
}

export default new ClientService();