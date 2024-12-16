import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  Box
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
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!username || !password) {
        setError('Vul beide velden in');
        return;
      }

      const data = await loginUser(username, password);
      console.log('Login response:', data); // Debug log
      
      if (!data.token || !data.user?.role) {
        console.error('Invalid server response:', data);
        setError('Ongeldige response van server');
        return;
      }

      // Login succesvol, sla token op en navigeer naar juiste dashboard
      login(data.token, data.user.role);
      
      const dashboardPath = data.user.role === 'provider' ? '/provider-dashboard' : '/klant-dashboard';
      console.log('Navigating to:', dashboardPath); // Debug log
      navigate(dashboardPath);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Er ging iets mis bij het inloggen');
      }
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
            sx={{ mt: 3 }}
          >
            {loading ? 'Bezig met inloggen...' : 'Inloggen'}
          </Button>
        </form>
      </Paper>
    </BaseLayout>
  );
};

export default Login;