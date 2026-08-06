import api from './api';

export function getCampuses() {
  return [
    'Sukkur Campus',
    'Karachi Campus',
    'Other Campuses',
  ];
}

export async function listTrainers(params = {}) {
  const { data } = await api.get('/trainers', { params });
  return data.data;
}

export async function getMyTrainerProfile() {
  const { data } = await api.get('/trainers/me');
  return data.data;
}

export async function updateMyTrainerProfile(payload) {
  const { data } = await api.put('/trainers/me', payload);
  return data.data;
}

export async function getMyTrainerRoster() {
  const { data } = await api.get('/trainers/me/roster');
  return data.data;
}

export async function createTrainer(payload) {
  const { data } = await api.post('/trainers', payload);
  return data.data;
}

export async function updateTrainer(id, payload) {
  const { data } = await api.put(`/trainers/${id}`, payload);
  return data.data;
}

export async function deleteTrainer(id) {
  const { data } = await api.delete(`/trainers/${id}`);
  return data.data;
}

