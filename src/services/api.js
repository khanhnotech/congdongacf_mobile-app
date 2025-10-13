const { EXPO_PUBLIC_API_BASE } = process.env;

const API_BASE_URL = EXPO_PUBLIC_API_BASE ?? 'http://localhost:5000/api';

const buildUrl = (path) => {
  if (!path) return API_BASE_URL;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

const handleResponse = async (response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    const error = new Error(data?.message ?? 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

const request = async (method, path, { body, headers = {}, ...init } = {}) => {
  const fetchOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...init,
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(buildUrl(path), fetchOptions);
  return handleResponse(response);
};

export const apiClient = {
  get: (path, options) => request('GET', path, options),
  post: (path, options) => request('POST', path, options),
  put: (path, options) => request('PUT', path, options),
  patch: (path, options) => request('PATCH', path, options),
  delete: (path, options) => request('DELETE', path, options),
};
