export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('wp_token');
  if (!token) {
    throw new Error('Niet geautoriseerd');
  }

  const response = await fetch(url, {
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