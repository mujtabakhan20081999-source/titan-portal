import api from './api';

export async function listAttendance() {
  const { data } = await api.get('/attendance');
  return data.data;
}

export async function createAttendance(payload) {
  const { data } = await api.post('/attendance', payload);
  return data.data;
}

export async function updateAttendance(id, payload) {
  const { data } = await api.put(`/attendance/${id}`, payload);
  return data.data;
}

export async function deleteAttendance(id) {
  const { data } = await api.delete(`/attendance/${id}`);
  return data.data;
}

