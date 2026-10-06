const TOKEN_STORAGE_KEY = 'navapack_token';

export function saveAuthToken(token: string) {
  sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken() {
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
}

export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
  if (!token) {
    throw new Error('Please log in again to access the marketing dashboard.');
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Token ${token}`);
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    clearAuthToken();
    throw new Error('Your session has expired. Please log in again.');
  }
  return response;
}
