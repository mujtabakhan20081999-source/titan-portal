import api from './api';

export async function login(identifier, password) {
  const { data } = await api.post('/auth/login', { identifier, password });
  return data;
}

export async function register(fullName, email, password, role, campus) {
  throw new Error('Public registration is disabled. Please use admin-created accounts.');
}

export async function createPassword(role, identifier, dateOfBirth, password) {
  const { data } = await api.post('/auth/create-password', { role, identifier, dateOfBirth, password });
  return data;
}

