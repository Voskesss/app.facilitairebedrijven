import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import OpdrachtgeverDashboard from './components/OpdrachtgeverDashboard';
import AanbiederDashboard from './components/AanbiederDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/opdrachtgever-dashboard"
          element={
            <ProtectedRoute>
              <OpdrachtgeverDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/aanbieder-dashboard"
          element={
            <ProtectedRoute>
              <AanbiederDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
