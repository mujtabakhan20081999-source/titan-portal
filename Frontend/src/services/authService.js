import api from './api';

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function register(fullName, email, password, role, campus) {
  const { data } = await api.post('/auth/register', { fullName, email, password, role, campus });
  return data;
}

