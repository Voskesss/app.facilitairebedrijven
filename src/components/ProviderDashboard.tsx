import { Box, Typography, Paper } from '@mui/material';
import BaseLayout from './layout/BaseLayout';

const ProviderDashboard = () => {
  return (
    <BaseLayout>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Provider Dashboard
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

export default ProviderDashboard; 