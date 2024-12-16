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
        console.log('Current userRole:', userRole); // Debug log
        
        if (userRole !== 'klant') {
          console.log('Access denied: incorrect role'); // Debug log
          setError('Geen toegang tot deze pagina');
          setTimeout(() => {
            navigate('/');
          }, 2000);
          return;
        }

        // Gebruik onze backend endpoint
        const userData = await fetchWithAuth('/api/auth/me');
        console.log('User data from API:', userData); // Debug log
        
        if (!userData || !userData.role) {
          console.error('Invalid user data:', userData); // Debug log
          setError('Er ging iets mis bij het laden van de gebruikersgegevens');
          return;
        }

        if (userData.role !== 'klant') {
          console.log('Access denied: API role mismatch'); // Debug log
          setError('Geen toegang tot deze pagina');
          logout();
        }
      } catch (err) {
        console.error('Dashboard access error:', err); // Debug log
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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <Typography>Laden...</Typography>
        </Box>
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
          <Typography component="div">
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li>Nieuwe opdracht plaatsen</li>
              <li>Aanbieders zoeken</li>
              <li>Instellingen wijzigen</li>
            </Box>
          </Typography>
        </Paper>
      </Box>
    </BaseLayout>
  );
};

export default KlantDashboard;