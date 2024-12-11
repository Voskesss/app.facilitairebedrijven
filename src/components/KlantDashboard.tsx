import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Alert } from '@mui/material';
import BaseLayout from './layout/BaseLayout';
import { fetchWithAuth } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const KlantDashboard = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout, userRole } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        if (userRole !== 'klant') {
          setError('Geen toegang tot deze pagina');
          setTimeout(() => {
            navigate('/');
          }, 2000);
          return;
        }

        const userData = await fetchWithAuth('/wp-json/wp/v2/users/me?context=edit');
        console.log('User data:', userData);
        
        if (!userData || !userData.roles || !Array.isArray(userData.roles)) {
          console.error('Ongeldige gebruikersdata:', userData);
          setError('Er ging iets mis bij het laden van de gebruikersgegevens');
          return;
        }

        const hasValidRole = userData.roles.some((role: string) => 
          role.toLowerCase() === 'customer' || 
          role.toLowerCase() === 'klant'
        );

        if (!hasValidRole) {
          setError('Geen toegang tot deze pagina');
          logout();
        }
      } catch (err) {
        console.error('Dashboard toegang error:', err);
        setError('Er ging iets mis bij het laden van het dashboard');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [navigate, logout, userRole]);

  if (loading) {
    return (
      <BaseLayout>
        <Typography>Laden...</Typography>
      </BaseLayout>
    );
  }

  if (error) {
    return (
      <BaseLayout>
        <Alert severity="error">{error}</Alert>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Klant Dashboard
        </Typography>
        <Box>
          <Typography>
            Welkom op je dashboard
          </Typography>
        </Box>
      </Paper>
    </BaseLayout>
  );
};

export default KlantDashboard; 