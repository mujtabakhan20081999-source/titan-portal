import api from './api';

export async function listStudents(params = {}) {
  const { data } = await api.get('/students', { params: { limit: 200, page: 1, ...params } });
  return data.data || [];
}

export async function listStudentsPaged(params = {}) {
  const { data } = await api.get('/students', { params });
  return data;
}

export async function getStudent(id) {
  const { data } = await api.get(`/students/${id}`);
  return data.data;
}

export async function getStudentDetails(id) {
  const { data } = await api.get(`/students/${id}/details`);
  return data.data;
}

export async function getMyStudentProfile() {
  const { data } = await api.get('/students/me');
  return data.data;
}

export async function createStudent(payload) {
  const { data } = await api.post('/students', payload);
  return data;
}

export async function updateStudent(id, payload) {
  const { data } = await api.put(`/students/${id}`, payload);
  return data.data;
}

export async function deleteStudent(id) {
  const { data } = await api.delete(`/students/${id}`);
  return data.data;
}

export async function getStudentVouchers(id) {
  const { data } = await api.get(`/students/${id}/vouchers`);
  return data.data;
}

export async function generateStudentVoucher(id, payload) {
  const { data } = await api.post(`/students/${id}/vouchers`, payload);
  return data.data;
}

export function exportStudentsUrl(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return `/students/export${qs ? `?${qs}` : ''}`;
}

export async function downloadStudentsExport(params = {}) {
  const response = await api.get('/students/export', {
    params,
    responseType: 'blob',
  });
  return response.data;
}

export async function downloadStudentAudit(id) {
  const response = await api.get(`/students/${id}/audit-pdf`, { responseType: 'blob' });
  return response.data;
}
