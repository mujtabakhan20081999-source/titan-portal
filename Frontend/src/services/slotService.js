import api from './api';

export async function listSlots() {
  const { data } = await api.get('/slots');
  return data.data;
}

export async function listMySlots() {
  const { data } = await api.get('/slots/mine');
  return data;
}

export async function createSlot(payload) {
  const { data } = await api.post('/slots', payload);
  return data.data;
}

export async function updateSlot(slotId, payload) {
  const { data } = await api.put(`/slots/${slotId}`, payload);
  return data.data;
}

export async function deleteSlot(slotId) {
  const { data } = await api.delete(`/slots/${slotId}`);
  return data.data;
}
