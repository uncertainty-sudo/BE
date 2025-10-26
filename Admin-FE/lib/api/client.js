const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api';

export class ApiError extends Error {
  constructor(message, {status, body}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

function applySearchParams(target, searchParams) {
  Object.entries(searchParams)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => target.append(key, String(v)));
      } else {
        target.set(key, String(value));
      }
    });
}

function serializeSearchParams(searchParams) {
  if (!searchParams) {
    return '';
  }
  const params = new URLSearchParams();
  applySearchParams(params, searchParams);
  return params.toString();
}

function buildUrl(path, searchParams) {
  if (path.startsWith('http')) {
    const url = new URL(path);
    if (searchParams) {
      applySearchParams(url.searchParams, searchParams);
    }
    return url;
  }

  if (DEFAULT_BASE_URL.startsWith('http')) {
    const url = new URL(path, DEFAULT_BASE_URL);
    if (searchParams) {
      applySearchParams(url.searchParams, searchParams);
    }
    return url;
  }

  const base = DEFAULT_BASE_URL.endsWith('/') ? DEFAULT_BASE_URL.slice(0, -1) : DEFAULT_BASE_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  let combined = `${base}${normalizedPath}` || normalizedPath;

  if (searchParams) {
    const queryString = serializeSearchParams(searchParams);
    if (queryString) {
      combined += `${combined.includes('?') ? '&' : '?'}${queryString}`;
    }
  }

  return combined;
}

function hasContentTypeHeader(headers) {
  if (headers instanceof Headers) {
    return headers.has('Content-Type');
  }
  return Object.prototype.hasOwnProperty.call(headers, 'Content-Type');
}

export async function apiFetch(path, options = {}) {
  const {
    method = 'GET',
    headers = {},
    body,
    token,
    searchParams,
    signal,
    cache = 'no-store'
  } = options;

  const url = buildUrl(path, searchParams);
  const requestHeaders = new Headers({Accept: 'application/json', ...headers});

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  let requestBody = body;
  if (
    body &&
    typeof body === 'object' &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    !hasContentTypeHeader(headers)
  ) {
    requestBody = JSON.stringify(body);
    requestHeaders.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: requestBody,
    signal,
    cache
  });

  if (!response.ok) {
    let errorBody = null;
    try {
      errorBody = await response.clone().json();
    } catch (error) {
      errorBody = await response.text();
    }
    throw new ApiError('API 요청이 실패했습니다.', {
      status: response.status,
      body: errorBody
    });
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
