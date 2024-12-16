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

        // Gebruik onze backend endpoint in plaats van direct WordPress
        const userData = await fetchWithAuth('/api/auth/me');
        console.log('User data:', userData);
        
        if (!userData || !userData.role) {
          console.error('Ongeldige gebruikersdata:', userData);
          setError('Er ging iets mis bij het laden van de gebruikersgegevens');
          return;
        }

        if (userData.role !== 'klant') {
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
          Klant Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welkom terug! Hier vind je een overzicht van je activiteiten.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recente Opdrachten
          </Typography>
          <Typography>
            Je hebt nog geen opdrachten geplaatst.
          </Typography>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Aanbieders
          </Typography>
          <Typography>
            Bekijk hier de beschikbare aanbieders.
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
            • Nieuwe opdracht plaatsen
            • Aanbieders zoeken
            • Instellingen wijzigen
          </Typography>
        </Paper>
      </Box>
    </BaseLayout>
  );
};

export default KlantDashboard;