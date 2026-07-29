import api from './api';

export async function getCityStats() {
  const { data } = await api.get('/admin/city-stats');
  return data.data;
}

export async function getRolePermissions() {
  const { data } = await api.get('/admin/permissions');
  return data.data;
}

export async function updateRolePermissions(permissions) {
  const { data } = await api.post('/admin/permissions', { permissions });
  return data.data;
}
