import React from 'react';
import PropTypes from 'prop-types';
import './BasePage.css';
import BottomNavigation from './BottomNavigation';


const BasePage = ({
  pageTitle,
  children,
  menuItems,
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
       <BottomNavigation menu={menuItems} />
     </div>
    );
};

BasePage.propTypes = {
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

BasePage.defaultProps = {
  children: null,
  menuItems: [],
};

export default BasePage;
