import { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import MainMenu from './MainMenu';

interface BaseLayoutProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

const BaseLayout = ({ children, maxWidth = false }: BaseLayoutProps) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <MainMenu />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          minHeight: '100vh',
          bgcolor: 'background.default',
          marginTop: '64px'
        }}
      >
        <Container maxWidth={maxWidth} sx={{ height: '100%' }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default BaseLayout; 