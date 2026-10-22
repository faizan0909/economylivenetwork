const API_BASE = '/api';

export async function apiRequest(endpoint, { method = 'GET', body, headers = {}, token } = {}) {
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers
  };

  const storedToken = token || localStorage.getItem('el_token');
  if (storedToken) {
    finalHeaders['Authorization'] = `Bearer ${storedToken}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP error ${response.status}`);
  }

  return data;
}

// Articles
export const getArticles = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.append(k, v);
  });
  return apiRequest(`/articles?${query.toString()}`);
};

export const getArticle = (slugOrId) => apiRequest(`/articles/${slugOrId}`);
export const createArticle = (data) => apiRequest('/articles', { method: 'POST', body: data });
export const updateArticle = (id, data) => apiRequest(`/articles/${id}`, { method: 'PUT', body: data });
export const deleteArticle = (id) => apiRequest(`/articles/${id}`, { method: 'DELETE' });

// Categories
export const getCategories = () => apiRequest('/categories');
export const getCategory = (slug) => apiRequest(`/categories/${slug}`);
export const createCategory = (data) => apiRequest('/categories', { method: 'POST', body: data });
export const updateCategory = (id, data) => apiRequest(`/categories/${id}`, { method: 'PUT', body: data });
export const deleteCategory = (id) => apiRequest(`/categories/${id}`, { method: 'DELETE' });

// Google News
export const fetchGoogleNews = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.append(k, v);
  });
  return apiRequest(`/google-news/fetch?${query.toString()}`);
};

export const importGoogleNewsItem = (item, targetCategory, status = 'published') => 
  apiRequest('/google-news/import', { method: 'POST', body: { item, targetCategory, status } });

export const importGoogleNewsBatch = (items, targetCategory, status = 'published') =>
  apiRequest('/google-news/import-batch', { method: 'POST', body: { items, targetCategory, status } });

// Auth
export const loginUser = (credentials) => apiRequest('/auth/login', { method: 'POST', body: credentials });
export const getCurrentUser = () => apiRequest('/auth/me');
export const logoutUser = () => apiRequest('/auth/logout', { method: 'POST' });
export const changePassword = (data) => apiRequest('/auth/change-password', { method: 'PUT', body: data });

// Settings & Stats
export const getSettings = () => apiRequest('/settings');
export const updateSettings = (data) => apiRequest('/settings', { method: 'PUT', body: data });
export const getStats = () => apiRequest('/stats');
