import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import BaseLayout from './layout/BaseLayout';
import {
  Box,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  NotificationsOutlined as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

interface UserData {
  name: string;
  company?: string;
  roles: string[];
}

const OpdrachtgeverDashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const userRole = localStorage.getItem('user_role');
    if (userRole !== 'opdrachtgever') {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('wp_token');
        const response = await fetch('https://www.facilitairebedrijven.nl/wp-json/wp/v2/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const DashboardHeader = (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <img
            src="/fb-logo.png"
            alt="Facilitaire Bedrijven"
            style={{ height: 32 }}
          />
        </Box>
        <IconButton color="inherit" size="large">
          <NotificationsIcon />
        </IconButton>
        <IconButton
          size="large"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircleIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem>Profiel</MenuItem>
          <MenuItem>Instellingen</MenuItem>
          <MenuItem onClick={logout}>Uitloggen</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <BaseLayout header={DashboardHeader}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3}>
          {/* Welkom kaart */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom>
                Welkom terug, {userData?.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Opdrachtgever Dashboard
              </Typography>
            </Paper>
          </Grid>

          {/* Statistieken */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Openstaande Aanvragen
                </Typography>
                <Typography variant="h4">3</Typography>
                <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon sx={{ mr: 1 }} />
                  33% meer dan vorige maand
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Actieve Projecten
                </Typography>
                <Typography variant="h4">5</Typography>
                <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon sx={{ mr: 1 }} />
                  40% meer dan vorige maand
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Ontvangen Offertes
                </Typography>
                <Typography variant="h4">8</Typography>
                <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon sx={{ mr: 1 }} />
                  50% meer dan vorige maand
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Recente Aanvragen Tabel */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recente Aanvragen
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Project</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Aantal Offertes</TableCell>
                      <TableCell>Actie</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Schoonmaak Hoofdkantoor</TableCell>
                      <TableCell>
                        <Chip label="Wacht op offertes" color="warning" />
                      </TableCell>
                      <TableCell>3</TableCell>
                      <TableCell>
                        <Button variant="contained" size="small">Bekijk</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Catering Events 2024</TableCell>
                      <TableCell>
                        <Chip label="Offertes ontvangen" color="success" />
                      </TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>
                        <Button variant="contained" size="small">Bekijk</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </BaseLayout>
  );
};

export default OpdrachtgeverDashboard; 