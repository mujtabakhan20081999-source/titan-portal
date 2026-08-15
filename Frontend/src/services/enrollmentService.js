// import { API_BASE_URL } from './api';

const api = import('./api').then(m => m.default);

// Get all enrollments for a student
export async function getStudentEnrollments(studentId) {
  const axiosInstance = await api;
  const response = await axiosInstance.get(`/students/${studentId}/enrollments`);
  return response.data.data || [];
}

// Add a course enrollment for a student
export async function createEnrollment(studentId, enrollment) {
  const axiosInstance = await api;
  const response = await axiosInstance.post(`/students/${studentId}/enrollments`, enrollment);
  return response.data.data;
}

// Update an enrollment
export async function updateEnrollment(studentId, enrollmentId, updates) {
  const axiosInstance = await api;
  const response = await axiosInstance.put(`/students/${studentId}/enrollments/${enrollmentId}`, updates);
  return response.data.data;
}

// Delete an enrollment
export async function deleteEnrollment(studentId, enrollmentId) {
  const axiosInstance = await api;
  await axiosInstance.delete(`/students/${studentId}/enrollments/${enrollmentId}`);
  return true;
}
