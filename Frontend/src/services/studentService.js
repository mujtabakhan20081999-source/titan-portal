import api from './api';

export async function listStudents() {
  const { data } = await api.get('/students');
  return data.data;
}

export async function getStudent(id) {
  const { data } = await api.get(`/students/${id}`);
  return data.data;
}

export async function getMyStudentProfile() {
  const { data } = await api.get('/students/me');
  return data.data;
}

export async function createStudent(payload) {
  const { data } = await api.post('/students', payload);
  return data.data;
}

export async function updateStudent(id, payload) {
  const { data } = await api.put(`/students/${id}`, payload);
  return data.data;
}

export async function deleteStudent(id) {
  const { data } = await api.delete(`/students/${id}`);
  return data.data;
}

