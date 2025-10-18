const { EXPO_PUBLIC_API_BASE } = process.env;

const normalizeBaseUrl = (value) => {
  if (!value) return '';
  return String(value).trim().replace(/\/+$/, '');
};

const API_BASE_URL =
  normalizeBaseUrl(EXPO_PUBLIC_API_BASE) || 'http://192.168.1.15:3000';

const serializeParams = (params = {}) => {
  const entries = Object.entries(params).flatMap(([key, value]) => {
    if (value === undefined || value === null || value === '') return [];
    if (Array.isArray(value)) {
      return value.map((item) => [key, item]);
    }
    return [[key, value]];
  });
  return entries
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
};

const buildUrl = (path) => {
  if (!API_BASE_URL) {
    throw new Error(
      'API base URL is not configured. Set EXPO_PUBLIC_API_BASE in your environment.',
    );
  }
  if (!path) return API_BASE_URL;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}/${path.replace(/^\//, '')}`;
};

const handleResponse = async (response) => {
  const text = await response.text();
  const contentType = response.headers.get('content-type') ?? '';
  const isJsonResponse = /\bjson\b/i.test(contentType);
  let data;

  if (text) {
    if (isJsonResponse) {
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        const error = new Error('Received malformed JSON response from server.');
        error.name = 'JsonParseError';
        error.status = response.status;
        error.responseText = text;
        error.cause = parseError;
        throw error;
      }
    } else {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
  }

  if (!response.ok) {
    const rawMessage =
      typeof data === 'string'
        ? data
        : data?.message ?? data?.error ?? 'Request failed';
    const message = typeof rawMessage === 'string' && /^</.test(rawMessage.trim())
      ? 'Request failed'
      : rawMessage;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

const request = async (method, path, { body, headers = {}, params, ...init } = {}) => {
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

  let url = buildUrl(path);
  const queryString = params ? serializeParams(params) : '';
  if (queryString) {
    url += url.includes('?') ? `&${queryString}` : `?${queryString}`;
  }

  const response = await fetch(url, fetchOptions);
  return handleResponse(response);
};

export const apiClient = {
  get: (path, options) => request('GET', path, options),
  post: (path, options) => request('POST', path, options),
  put: (path, options) => request('PUT', path, options),
  patch: (path, options) => request('PATCH', path, options),
  delete: (path, options) => request('DELETE', path, options),
};
