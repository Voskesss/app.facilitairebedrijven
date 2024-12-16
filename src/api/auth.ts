const API_BASE_URL = 'http://localhost:5001';

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('wp_token');
  if (!token) {
    throw new Error('Niet geautoriseerd');
  }

  const response = await fetch(url.startsWith('http') ? url : `${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    // Token verlopen of ongeldig
    localStorage.removeItem('wp_token');
    localStorage.removeItem('user_role');
    window.location.href = '/login';
    throw new Error('Sessie verlopen');
  }

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json();
};

export const loginUser = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: 'Er ging iets mis bij het inloggen' }));
    throw new Error(data.error || 'Er ging iets mis bij het inloggen');
  }

  return response.json();
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('wp_token');
  if (!token) {
    throw new Error('Niet geautoriseerd');
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Kon gebruikersdata niet ophalen');
  }

  return response.json();
};