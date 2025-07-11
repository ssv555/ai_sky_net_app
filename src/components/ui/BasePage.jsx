import React from 'react';
import PropTypes from 'prop-types';
import './BasePage.css';
import BottomNavigation from './BottomNavigation';


const BasePage = ({
  pageTitle,
  children,
}) => {

  return (
    <div className="twa-container">
      <div className="twa-header-content">
        <h1 className="twa-title">{pageTitle}</h1>
      </div>
      <div className="twa-page">
        <div className="twa-content">
          {children}
         </div>
       </div>
       <BottomNavigation />
     </div>
    );
};

BasePage.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  children: PropTypes.node,
};

BasePage.defaultProps = {
  children: null,
};

export default BasePage;
