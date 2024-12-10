import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseLayout from './layout/BaseLayout';
import {
  Box,
  Paper,
  Typography,
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
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';

interface UserData {
  name: string;
  company?: string;
  roles: string[];
}

const AanbiederDashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('user_role');
    if (userRole !== 'aanbieder') {
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <BaseLayout maxWidth={false}>
      <Grid container spacing={3}>
        {/* Welkom kaart */}
        <Grid item xs={12}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h4" gutterBottom>
              Welkom terug, {userData?.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Aanbieder Dashboard
            </Typography>
          </Paper>
        </Grid>

        {/* Statistieken */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Actieve Offertes
              </Typography>
              <Typography variant="h4">12</Typography>
              <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                14% meer dan vorige maand
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Lopende Projecten
              </Typography>
              <Typography variant="h4">4</Typography>
              <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                7% meer dan vorige maand
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Nieuwe Aanvragen
              </Typography>
              <Typography variant="h4">7</Typography>
              <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                21% meer dan vorige maand
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Activiteiten Tabel */}
        <Grid item xs={12}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Recente Activiteit
            </Typography>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Project</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Deadline</TableCell>
                    <TableCell>Actie</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Kantoor Schoonmaak B.V.</TableCell>
                    <TableCell>
                      <Chip label="In behandeling" color="warning" />
                    </TableCell>
                    <TableCell>23 Dec 2024</TableCell>
                    <TableCell>
                      <Button variant="contained" size="small">Bekijk</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Facility Services Amsterdam</TableCell>
                    <TableCell>
                      <Chip label="Geaccepteerd" color="success" />
                    </TableCell>
                    <TableCell>15 Dec 2024</TableCell>
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
    </BaseLayout>
  );
};

export default AanbiederDashboard; 