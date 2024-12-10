import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();

  const logout = () => {
    // Verwijder alle auth-gerelateerde items uit localStorage
    localStorage.removeItem('wp_token');
    localStorage.removeItem('user_role');
    
    // Redirect naar login pagina
    navigate('/login');
  };

  return { logout };
}; 