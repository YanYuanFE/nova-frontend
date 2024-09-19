import { IProject } from '@/types';
import { apiClient } from '@/utils/api-client';

// POST /api/project
export async function createProject(data: any) {
  return await apiClient.post('/project', data);
}

// GET /api/projects
export async function getProjects() {
  return await apiClient.get<any[]>('/projects');
}

// GET /api/project/:id
export async function getProject(id: string) {
  return await apiClient.get<IProject>(`/project?projectId=${id}`);
}

// PUT /api/project/:id
export async function updateProject(id: string, data: any) {
  return await apiClient.put(`/project/${id}`, data);
}
