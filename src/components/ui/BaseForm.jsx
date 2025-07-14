import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import BottomNavigation from './BottomNavigation';
import './BaseForm.css';

const BaseForm = ({
  pageTitle,
  children,
  menuItems,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setBackButton, isTelegramEnvironment } = useTelegram();
  
  const isMainPage = location.pathname === '/';
  const showBackInBrowser = !isMainPage && !isTelegramEnvironment();

  useEffect(() => {
    const handleBackClick = () => {
      navigate(-1);
    };

    const isInTelegram = isTelegramEnvironment();
    console.log('BaseForm: isTelegramEnvironment =', isInTelegram);
    console.log('BaseForm: isMainPage =', isMainPage);
    console.log('BaseForm: location.pathname =', location.pathname);

    if (isInTelegram) {
      if (!isMainPage) {
        console.log('Показываем кнопку назад в Telegram');
        setBackButton(true, handleBackClick);
      } else {
        console.log('Скрываем кнопку назад (главная страница)');
        setBackButton(false);
      }
    } else {
      console.log('Не в Telegram окружении');
    }

    return () => {
      if (isInTelegram) {
        setBackButton(false);
      }
    };
  }, [location.pathname, setBackButton, navigate, isMainPage, isTelegramEnvironment]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary'
      }}
    >
      <Box
        component="header"
        className="header-with-separator"
        sx={{
          p: 0.5,
          borderBottom: 1,
          borderColor: 'divider',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {showBackInBrowser && (
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'text.primary'
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <h1 style={{ margin: 0, fontSize: '1.25rem' }}>{pageTitle}</h1>
        <div className="animated-separator top-separator"></div>
      </Box>
      <Box
        component="main"
        sx={{
          flex: 1,
          p: 2,
          overflow: 'auto'
        }}
      >
        {children}
      </Box>
      <BottomNavigation menu={menuItems} />
    </Box>
  );
};

BaseForm.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  children: PropTypes.node,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      callback: PropTypes.func.isRequired,
    })
  ),
};

BaseForm.defaultProps = {
  children: null,
  menuItems: [],
};

export default BaseForm;
