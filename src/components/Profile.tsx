import { useState, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserProfile } from '../api/user';
import BaseLayout from './layout/BaseLayout';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('wp_token');
        if (!token) throw new Error('Geen token gevonden');
        
        const userData = await fetchUserProfile(token);
        setProfile(userData);
      } catch (err) {
        setError('Kon profielgegevens niet laden');
        console.error('Profile error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <BaseLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
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
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Profiel</Typography>
        {profile && (
          <Box>
            <Typography><strong>Naam:</strong> {profile.name}</Typography>
            <Typography><strong>Email:</strong> {profile.email}</Typography>
            <Typography><strong>Gebruikersnaam:</strong> {profile.username}</Typography>
            <Typography><strong>Rol:</strong> {profile.roles.join(', ')}</Typography>
            {/* Voeg meer velden toe nadat we zien wat WordPress teruggeeft */}
          </Box>
        )}
      </Paper>
    </BaseLayout>
  );
};

export default Profile; 