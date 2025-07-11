import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  MenuItem,
  FormControl,
  Select,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useTheme } from '../../theme/ThemeContext';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { currentTheme, changeTheme, themeVariants } = useTheme();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleThemeChange = (event) => {
    changeTheme(event.target.value);
  };

  // Названия тем для отображения
  const themeNames = {
    [themeVariants.TELEGRAM_DARK]: 'Telegram Dark',
    [themeVariants.DARK]: 'Темная (оригинальная)',
    [themeVariants.DARK_GRAY]: 'Темно-серая',
    [themeVariants.SMOKY]: 'Дымчатая',
    [themeVariants.DARK_BLUE]: 'Темно-голубая',
  };

  // Цвета для каждой темы
  const themeColors = {
    [themeVariants.TELEGRAM_DARK]: '#8774e1',
    [themeVariants.DARK]: '#2196f3',
    [themeVariants.DARK_GRAY]: '#78909c',
    [themeVariants.SMOKY]: '#5c6bc0',
    [themeVariants.DARK_BLUE]: '#4fc3f7',
  };

  return (
      <Box sx={{ p: 2 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Тема оформления
          </Typography>
          
          <FormControl fullWidth sx={{ mt: 1 }}>
            <Select
              value={currentTheme}
              onChange={handleThemeChange}
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              sx={{
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                },
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: themeColors[selected],
                      mr: 1,
                    }}
                  />
                  <Typography>{themeNames[selected]}</Typography>
                </Box>
              )}
            >
              {Object.entries(themeVariants).map(([key, value]) => (
                <MenuItem key={value} value={value}>
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: themeColors[value],
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={themeNames[value]} />
                  {currentTheme === value && (
                    <CheckIcon fontSize="small" color="primary" />
                  )}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      </Box>
  );
};

export default SettingsPage;