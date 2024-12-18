import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// Type voor gebruikersrollen
type UserRole = 'klant' | 'provider';

// Type voor de auth context
interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  login: (token: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('wp_token'));
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    const role = localStorage.getItem('user_role');
    return (role === 'klant' || role === 'provider') ? role : null;
  });
  const navigate = useNavigate();

  // Effect om auth status te controleren bij laden
  useEffect(() => {
    const token = localStorage.getItem('wp_token');
    const role = localStorage.getItem('user_role');
    
    if (!token || !role) {
      logout();
    }
  }, []);

  const login = (token: string, role: UserRole) => {
    if (role !== 'klant' && role !== 'provider') {
      console.error('Ongeldige rol:', role);
      throw new Error('Ongeldige gebruikersrol');
    }

    localStorage.setItem('wp_token', token);
    localStorage.setItem('user_role', role);
    setIsAuthenticated(true);
    setUserRole(role);

    // Navigeer naar het juiste dashboard
    const dashboardPath = role === 'provider' ? '/provider-dashboard' : '/klant-dashboard';
    navigate(dashboardPath);
  };

  const logout = () => {
    localStorage.removeItem('wp_token');
    localStorage.removeItem('user_role');
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth moet binnen een AuthProvider gebruikt worden');
  }
  return context;
};