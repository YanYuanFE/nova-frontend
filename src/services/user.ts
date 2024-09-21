import { apiClient } from '@/utils/api-client';

// api/auth/user
export async function getUser() {
  const res = await apiClient.get('/auth/user');
  return res;
}

export async function authCallBack(code: string) {
  const res = await apiClient.get(`/auth/github/callback?code=${code}`);
  return res;
}
