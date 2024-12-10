import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!username || !password) {
        setError('Vul beide velden in');
        return;
      }

      console.log('Attempting login with:', { username, hasPassword: !!password });
      
      const response = await fetch('/wp-json/jwt-auth/v1/token', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (data.token) {
        // Haal gebruikersdata op met capabilities
        const userResponse = await fetch('/wp-json/wp/v2/users/me?context=edit', {
          headers: { 
            'Authorization': `Bearer ${data.token}`
          },
        });
        
        const userData = await userResponse.json();
        console.log('User data:', userData);
        
        // Check roles in plaats van capabilities
        const userRoles = userData.roles || [];
        console.log('User roles:', userRoles);
        
        localStorage.setItem('wp_token', data.token);
        
        if (userRoles.includes('administrator') || userRoles.includes('opdrachtgever')) {
          localStorage.setItem('user_role', 'opdrachtgever');
          navigate('/opdrachtgever-dashboard');
        } else if (userRoles.includes('aanbieder')) {
          localStorage.setItem('user_role', 'aanbieder');
          navigate('/aanbieder-dashboard');
        } else {
          console.error('Geen juiste rollen gevonden:', userRoles);
          setError('Je account heeft niet de juiste rechten');
        }
      } else {
        console.log('Login failed:', data);
        setError(data.message || 'Ongeldige inloggegevens');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Er ging iets mis bij het inloggen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <img 
            src="/fb-logo.png" 
            alt="Facilitaire Bedrijven" 
            className="h-8 w-auto"
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Login card */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Inloggen</h2>
              <p className="mt-2 text-sm text-gray-600">
                Log in op het Facilitaire Bedrijven platform
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Gebruikersnaam
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    required
                    className="pl-9 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Wachtwoord
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <LockClosedIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    className="pl-9 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Inloggen...
                  </span>
                ) : (
                  'Inloggen'
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                Wachtwoord vergeten?
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          © 2024 Facilitaire Bedrijven. Alle rechten voorbehouden.
        </div>
      </footer>
    </div>
  );
};

export default Login; 