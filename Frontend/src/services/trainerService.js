import api from './api';

export function getCampuses() {
  return [
    'Sukkur Campus',
    'Karachi Campus',
    'Lahore Campus',
    'Islamabad Campus',
    'Multan Campus',
    'Other Campuses',
  ];
}

export async function listTrainers() {
  const { data } = await api.get('/trainers');
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

