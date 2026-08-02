import api from './api';

export async function login(identifier, password) {
  const { data } = await api.post('/auth/login', { identifier, password });
  return data;
}

export async function register() {
  throw new Error('Public registration is disabled. Please use admin-created accounts.');
}

export async function createPassword(role, identifier, dateOfBirth, password) {
  const payload = role === 'teacher'
    ? { role, identifier, joiningDate: dateOfBirth, password }
    : { role, identifier, dateOfBirth, password };
  const { data } = await api.post('/auth/create-password', payload);
  return data;
}

export async function forgotPassword({ role, cnic, email, dateOfBirth, joiningDate, password }) {
  const { data } = await api.post('/auth/forgot-password', {
    role,
    cnic,
    email,
    dateOfBirth,
    joiningDate,
    password,
  });
  return data;
}

export async function adminForgotPassword({ email, fullName, password }) {
  const { data } = await api.post('/auth/admin-forgot-password', { email, fullName, password });
  return data;
}

export async function getMe() {
  const { data } = await api.get('/auth/me');
  return data.data;
}

export async function changePassword(currentPassword, newPassword) {
  const { data } = await api.post('/auth/change-password', { currentPassword, newPassword });
  return data;
}
