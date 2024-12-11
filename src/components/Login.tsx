import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import BaseLayout from './layout/BaseLayout';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Responsive breakpoints
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!username || !password) {
        setError('Vul beide velden in');
        return;
      }

      console.log('Attempting login with:', { username, hasPassword: !!password });
      
      const response = await fetch('/wp-json/jwt-auth/v1/token', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (data.token) {
        // Haal gebruikersdata op met capabilities
        const userResponse = await fetch('/wp-json/wp/v2/users/me?context=edit', {
          headers: { 
            'Authorization': `Bearer ${data.token}`
          },
        });
        
        const userData = await userResponse.json();
        console.log('User data:', userData);
        
        // Check roles in plaats van capabilities
        const userRoles = userData.roles || [];
        console.log('User roles:', userRoles);
        
        localStorage.setItem('wp_token', data.token);
        
        if (userRoles.includes('administrator') || userRoles.includes('opdrachtgever')) {
          localStorage.setItem('user_role', 'opdrachtgever');
          navigate('/opdrachtgever-dashboard');
        } else if (userRoles.includes('aanbieder')) {
          localStorage.setItem('user_role', 'aanbieder');
          navigate('/aanbieder-dashboard');
        } else {
          console.error('Geen juiste rollen gevonden:', userRoles);
          setError('Je account heeft niet de juiste rechten');
        }
      } else {
        console.log('Login failed:', data);
        setError(data.message || 'Ongeldige inloggegevens');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Er ging iets mis bij het inloggen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseLayout centered hideMenu>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          maxWidth: '400px',
          mx: 'auto'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 3 } }}>
          <Typography 
            variant={isXs ? "h6" : "h5"} 
            component="h1" 
            gutterBottom
          >
            Inloggen
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
          >
            Log in op het Facilitaire Bedrijven platform
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: { xs: 2, sm: 3 } }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Gebruikersnaam"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
            size={isXs ? "small" : "medium"}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Wachtwoord"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }}
            size={isXs ? "small" : "medium"}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ 
              mt: { xs: 2, sm: 3 },
              mb: { xs: 1, sm: 2 },
              py: { xs: 1, sm: 1.5 }
            }}
          >
            {loading ? 'Inloggen...' : 'Inloggen'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="body2"
              color="primary"
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Wachtwoord vergeten?
            </Typography>
          </Box>
        </Box>
      </Paper>
    </BaseLayout>
  );
};

export default Login; 