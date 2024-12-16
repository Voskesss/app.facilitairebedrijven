import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Alert } from '@mui/material';
import BaseLayout from './layout/BaseLayout';
import { fetchWithAuth } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProviderDashboard = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout, userRole } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        if (userRole !== 'provider') {
          setError('Geen toegang tot deze pagina');
          setTimeout(() => {
            navigate('/');
          }, 2000);
          return;
        }

        const userData = await fetchWithAuth('/api/auth/me');
        console.log('User data:', userData);
        
        if (!userData || !userData.role) {
          console.error('Ongeldige gebruikersdata:', userData);
          setError('Er ging iets mis bij het laden van de gebruikersgegevens');
          return;
        }

        if (userData.role !== 'provider') {
          setError('Geen toegang tot deze pagina');
          logout();
        }
      } catch (err) {
        console.error('Dashboard toegang error:', err);
        setError('Er ging iets mis bij het laden van het dashboard');
        if (err instanceof Error && err.message === 'Sessie verlopen') {
          logout();
        }
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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Provider Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welkom terug! Hier vind je een overzicht van je activiteiten.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Actieve Opdrachten
          </Typography>
          <Typography>
            Je hebt nog geen actieve opdrachten.
          </Typography>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Bedrijfsprofiel
          </Typography>
          <Typography>
            Bekijk en bewerk je bedrijfsprofiel.
          </Typography>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Meldingen
          </Typography>
          <Typography>
            Je hebt geen nieuwe meldingen.
          </Typography>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Snelle Links
          </Typography>
          <Typography>
            • Opdrachten bekijken
            • Bedrijfsprofiel bijwerken
            • Instellingen wijzigen
          </Typography>
        </Paper>
      </Box>
    </BaseLayout>
  );
};

export default ProviderDashboard;