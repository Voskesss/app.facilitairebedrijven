import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import OpdrachtgeverDashboard from './components/OpdrachtgeverDashboard';
import AanbiederDashboard from './components/AanbiederDashboard';
import PrivateRoute from './components/PrivateRoute';

const AppRoutes = () => {
  const { isAuthenticated, userRole } = useAuth();

  // Redirect naar juiste dashboard als al ingelogd
  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/login';
    return userRole === 'aanbieder' ? '/aanbieder-dashboard' : '/opdrachtgever-dashboard';
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
        path="/opdrachtgever-dashboard"
        element={
          <PrivateRoute allowedRoles={['opdrachtgever', 'administrator']}>
            <OpdrachtgeverDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/aanbieder-dashboard"
        element={
          <PrivateRoute allowedRoles={['aanbieder']}>
            <AanbiederDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes; 