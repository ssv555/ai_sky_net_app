import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, IconButton, Typography, Menu, MenuItem, Popover } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import './BottomNavigation.css';

const BottomNavigation = ({ menu = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (callback) => {
    if (typeof callback === 'function') {
      callback();
    }
    handleMenuClose();
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
        className={`twa-nav-item ${isActive('/menu') ? 'active' : ''}`}
      >
        <IconButton 
          color={isActive('/menu') ? 'primary' : 'default'} 
          className="twa-nav-icon"
          onClick={handleMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="caption" className="twa-nav-label">
          Меню
        </Typography>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          {menu.map((item, index) => (
            <MenuItem 
              key={item.name || index} 
              onClick={() => handleMenuItemClick(item.callback)}
            >
              {item.title}
            </MenuItem>
          ))}
        </Menu>
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