import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import BottomNavigation from './BottomNavigation';
import './BaseForm.css';

const BaseForm = ({
  pageTitle,
  children,
  menuItems,
}) => {
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
