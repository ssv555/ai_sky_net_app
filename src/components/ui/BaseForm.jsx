import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import BottomNavigation from './BottomNavigation';

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
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{pageTitle}</h1>
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
