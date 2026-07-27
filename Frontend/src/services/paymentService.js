import api from './api';

export async function listPayments() {
  const { data } = await api.get('/payments');
  return data.data;
}

export async function createPayment(payload) {
  const { data } = await api.post('/payments', payload);
  return data.data;
}

export async function updatePayment(id, payload) {
  const { data } = await api.put(`/payments/${id}`, payload);
  return data.data;
}

export async function deletePayment(id) {
  const { data } = await api.delete(`/payments/${id}`);
  return data.data;
}

