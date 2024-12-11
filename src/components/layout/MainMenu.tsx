import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  NotificationsOutlined as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

const MainMenu = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const userRole = localStorage.getItem('user_role');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileClose(); // Sluit het menu
    logout(); // Gebruik de logout functie van AuthContext
  };

  // Menu items op basis van rol
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: `/${userRole}-dashboard`,
      roles: ['klant', 'provider']
    },
    {
      text: 'Opdrachten',
      icon: <AssignmentIcon />,
      path: '/opdrachten',
      roles: ['klant', 'provider']
    },
    {
      text: 'Bedrijfsprofiel',
      icon: <BusinessIcon />,
      path: '/bedrijfsprofiel',
      roles: ['provider']
    },
    {
      text: 'Aanbieders',
      icon: <PeopleIcon />,
      path: '/aanbieders',
      roles: ['klant']
    },
    {
      text: 'Instellingen',
      icon: <SettingsIcon />,
      path: '/instellingen',
      roles: ['klant', 'provider']
    }
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <img
          src="/fb-logo.png"
          alt="Facilitaire Bedrijven"
          style={{ height: 32 }}
        />
      </Toolbar>
      <Divider />
      <List>
        {menuItems
          .filter(item => item.roles.includes(userRole as string))
          .map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton
            onClick={handleProfileMenu}
            color="inherit"
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileClose}
          >
            <MenuItem onClick={() => navigate('/profiel')}>Profiel</MenuItem>
            <MenuItem onClick={handleLogout}>Uitloggen</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': { 
            width: 240,
            boxSizing: 'border-box' 
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default MainMenu; 