import api from './api';

export async function listAttendance(params = {}) {
  const { data } = await api.get('/attendance', { params });
  return data.data;
}

export async function lookupAttendanceStudent(roll) {
  const { data } = await api.get(`/attendance/lookup/${encodeURIComponent(roll)}`);
  return data.data;
}

export async function getAttendanceSummary(roll, month) {
  const { data } = await api.get(`/attendance/summary/${encodeURIComponent(roll)}`, {
    params: month ? { month } : {},
  });
  return data.data;
}

export async function createAttendance(payload) {
  const { data } = await api.post('/attendance', payload);
  return data;
}

export async function createMultiAttendance(payload) {
  const { data } = await api.post('/attendance/multi', payload);
  return data;
}

export async function updateAttendance(id, payload) {
  const { data } = await api.put(`/attendance/${id}`, payload);
  return data.data;
}

export async function deleteAttendance(id) {
  const { data } = await api.delete(`/attendance/${id}`);
  return data.data;
}
