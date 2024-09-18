import { apiClient } from '@/utils/api-client';

// api/auth/user
export async function getUser() {
  const res = await apiClient.get('/auth/user');
  return res;
}
