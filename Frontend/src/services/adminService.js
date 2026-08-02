import api from './api';

export async function getCityStats() {
  const { data } = await api.get('/admin/city-stats');
  return data.data;
}

export async function getDashboard(params = {}) {
  const { data } = await api.get('/admin/dashboard', { params });
  return data.data;
}

export async function getReports(params = {}) {
  const { data } = await api.get('/admin/reports', { params });
  return data.data;
}

export async function getAuditLogs(params = {}) {
  const { data } = await api.get('/admin/audit-logs', { params });
  return data;
}

export async function getSettings() {
  const { data } = await api.get('/admin/settings');
  return data.data;
}

export async function updateSettings(payload) {
  const { data } = await api.put('/admin/settings', payload);
  return data.data;
}

export async function triggerBackup() {
  const { data } = await api.post('/admin/settings/backup');
  return data;
}

export async function listSupportTickets() {
  const { data } = await api.get('/admin/support');
  return data.data;
}

export async function createSupportTicket(payload) {
  const { data } = await api.post('/admin/support', payload);
  return data.data;
}

export async function updateSupportTicket(id, payload) {
  const { data } = await api.put(`/admin/support/${id}`, payload);
  return data.data;
}

export async function bulkUpdateStudentStatus(payload) {
  const { data } = await api.post('/admin/bulk-status', payload);
  return data.data;
}

export async function getBulkUpdateHistory() {
  const { data } = await api.get('/admin/bulk-status/history');
  return data.data;
}

export async function getRolePermissions() {
  const { data } = await api.get('/admin/permissions');
  return data.data;
}

export async function getMyPermissions() {
  const { data } = await api.get('/admin/my-permissions');
  return data.data;
}

export async function updateRolePermissions(permissions) {
  const { data } = await api.post('/admin/permissions', { permissions });
  return data.data;
}

export async function scanTrainerAttendance(payload) {
  const { data } = await api.post('/trainers/attendance/scan', payload);
  return data;
}

export async function listTrainerAttendance(params = {}) {
  const { data } = await api.get('/trainers/attendance', { params });
  return data.data;
}

export async function listTrainerCorrections(params = {}) {
  const { data } = await api.get('/trainers/attendance/corrections', { params });
  return data.data;
}

export async function createTrainerCorrection(payload) {
  const { data } = await api.post('/trainers/attendance/corrections', payload);
  return data.data;
}

export async function reviewTrainerCorrection(id, payload) {
  const { data } = await api.put(`/trainers/attendance/corrections/${id}`, payload);
  return data.data;
}
