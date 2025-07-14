import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useTheme } from '../../theme/ThemeContext';
import { useForm } from 'react-hook-form';
import { FormSelect } from '../ui/FormFields';

const SettingsForm = () => {
  const navigate = useNavigate();
  const { currentTheme, changeTheme, themeVariants } = useTheme();

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      theme: currentTheme
    }
  });

  const watchedTheme = watch('theme');
  
  React.useEffect(() => {
    if (watchedTheme && watchedTheme !== currentTheme) {
      changeTheme(watchedTheme);
    }
  }, [watchedTheme, currentTheme, changeTheme]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const onSubmit = (data) => {
    changeTheme(data.theme);
  };

  const themeNames = {
    [themeVariants.TELEGRAM_DARK]: 'Telegram Dark',
    [themeVariants.DARK]: 'Темная (оригинальная)',
    [themeVariants.DARK_GRAY]: 'Темно-серая',
    [themeVariants.SMOKY]: 'Дымчатая',
    [themeVariants.DARK_BLUE]: 'Темно-голубая',
  };

  const themeColors = {
    [themeVariants.TELEGRAM_DARK]: '#8774e1',
    [themeVariants.DARK]: '#2196f3',
    [themeVariants.DARK_GRAY]: '#78909c',
    [themeVariants.SMOKY]: '#5c6bc0',
    [themeVariants.DARK_BLUE]: '#4fc3f7',
  };

  const themeOptions = Object.entries(themeVariants).map(([key, value]) => ({
    value: value,
    label: themeNames[value],
    color: themeColors[value]
  }));

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Тема оформления
        </Typography>
        
        <FormSelect
          name="theme"
          control={control}
          label="Выберите тему"
          options={themeOptions}
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
          {themeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: option.color,
                  }}
                />
              </ListItemIcon>
              <ListItemText primary={option.label} />
              {currentTheme === option.value && (
                <CheckIcon fontSize="small" color="primary" />
              )}
            </MenuItem>
          ))}
        </FormSelect>
      </Paper>
    </Box>
  );
};

export default SettingsForm;