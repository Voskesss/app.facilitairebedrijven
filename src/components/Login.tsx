import { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  Box,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import BaseLayout from './layout/BaseLayout';
import { useAuth } from '../contexts/AuthContext';
import { loginUser } from '../api/auth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validatie
    if (!username.trim() || !password.trim()) {
      setError('Vul beide velden in');
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(username, password);
      
      if (!data.token || !data.user?.role) {
        console.error('Ongeldige server response:', data);
        throw new Error('Er ging iets mis bij het inloggen');
      }

      // Controleer of de rol geldig is
      if (data.user.role !== 'klant' && data.user.role !== 'provider') {
        throw new Error('Ongeldige gebruikersrol ontvangen');
      }

      // Login via AuthContext
      await login(data.token, data.user.role);
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Er ging iets mis bij het inloggen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseLayout hideMenu centered>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <img
            src="/logo-2022-nieuw.png"
            alt="Facilitaire Bedrijven"
            style={{ 
              height: 60,
              width: 'auto',
              objectFit: 'contain',
              marginBottom: '16px'
            }}
          />
          <Typography variant="h5" component="h1" gutterBottom>
            Inloggen
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Gebruikersnaam"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            fullWidth
            label="Wachtwoord"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ 
              mt: 3,
              position: 'relative'
            }}
          >
            {loading ? (
              <>
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    marginLeft: '-12px'
                  }}
                />
                Bezig met inloggen...
              </>
            ) : (
              'Inloggen'
            )}
          </Button>
        </form>
      </Paper>
    </BaseLayout>
  );
};

export default Login;