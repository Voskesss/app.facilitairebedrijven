import { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import MainMenu from './MainMenu';

interface BaseLayoutProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  centered?: boolean;
  hideMenu?: boolean;
}

const BaseLayout = ({ 
  children, 
  maxWidth = false,
  centered = false,
  hideMenu = false
}: BaseLayoutProps) => {
  return (
    <Box 
      sx={{ 
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        bgcolor: 'background.default'
      }}
    >
      {!hideMenu && <MainMenu />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%'
        }}
      >
        {centered ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              width: '100%',
              p: { xs: 2, sm: 3 }
            }}
          >
            <Container
              maxWidth="sm"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
              }}
            >
              {children}
            </Container>
          </Box>
        ) : (
          <Container
            maxWidth={maxWidth}
            sx={{
              flexGrow: 1,
              p: { xs: 2, sm: 3 },
              mt: hideMenu ? 0 : '64px'
            }}
          >
            {children}
          </Container>
        )}
      </Box>
    </Box>
  );
};

export default BaseLayout; 