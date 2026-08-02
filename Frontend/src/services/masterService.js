import api from './api';

export async function getHierarchy() {
  const { data } = await api.get('/master/hierarchy');
  return data.data;
}

export async function listCountries() {
  const { data } = await api.get('/master/countries');
  return data.data;
}

export async function listCities(country) {
  const { data } = await api.get('/master/cities', { params: country ? { country } : {} });
  return data.data;
}

export async function listCampuses(city) {
  const { data } = await api.get('/master/campuses', { params: city ? { city } : {} });
  return data.data;
}

export async function listCourses() {
  const { data } = await api.get('/master/courses');
  return data.data;
}

export async function listBatches(params = {}) {
  const { data } = await api.get('/master/batches', { params });
  return data.data;
}

export async function listSlotsByFilters(params = {}) {
  const { data } = await api.get('/master/slots-by-filters', { params });
  return data.data;
}

export async function seedMasterData() {
  const { data } = await api.post('/master/seed');
  return data;
}
