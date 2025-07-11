import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, IconButton, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import './BottomNavigation.css';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="twa-bottom-navigation">
      <Box 
        className={`twa-nav-item ${isActive('/') ? 'active' : ''}`}
        onClick={() => navigate('/')}
      >
        <IconButton color={isActive('/') ? 'primary' : 'default'} className="twa-nav-icon">
          <HomeIcon />
        </IconButton>
        <Typography variant="caption" className="twa-nav-label">
          Главная
        </Typography>
      </Box>

      <Box 
        className={`twa-nav-item ${isActive('/settings') ? 'active' : ''}`}
        onClick={() => navigate('/settings')}
      >
        <IconButton color={isActive('/settings') ? 'primary' : 'default'} className="twa-nav-icon">
          <SettingsIcon />
        </IconButton>
        <Typography variant="caption" className="twa-nav-label">
          Настройки
        </Typography>
      </Box>
    </div>
  );
};

export default BottomNavigation;