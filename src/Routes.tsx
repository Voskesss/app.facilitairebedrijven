import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Profile from './components/Profile';
import KlantDashboard from './components/KlantDashboard';
import ProviderDashboard from './components/ProviderDashboard';
import PrivateRoute from './components/PrivateRoute';

const AppRoutes = () => {
  const { isAuthenticated, userRole } = useAuth();

  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/login';
    return userRole === 'provider' ? '/provider-dashboard' : '/klant-dashboard';
  };

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to={getDefaultRoute()} /> : <Login />} 
      />
      <Route
        path="/"
        element={<Navigate to={getDefaultRoute()} />}
      />
      <Route
        path="/profiel"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/klant-dashboard"
        element={
          <PrivateRoute allowedRoles={['klant']}>
            <KlantDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/provider-dashboard"
        element={
          <PrivateRoute allowedRoles={['provider']}>
            <ProviderDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes; 