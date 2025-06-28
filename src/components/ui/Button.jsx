import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "./Button.css";

const Button = ({
  name,
  title,
  variant = "primary",
  enabled = true,
  onClick,
  dropdownItems = null,
  onDropdownItemClick = null,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleButtonClick = (e) => {
    if (dropdownItems && dropdownItems.length > 0) {
      // Если есть выпадающие элементы, открываем меню
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      // Обычный клик
      onClick?.(e);
    }
  };

  const handleDropdownItemClick = (item) => {
    setIsDropdownOpen(false);
    onDropdownItemClick?.(item);
  };

  const hasDropdown = dropdownItems && dropdownItems.length > 0;

  return (
    <div className="button-container" ref={dropdownRef}>
      <button
        className={`twa-button twa-button-${variant} ${
          !enabled ? "twa-button-disabled" : ""
        } ${hasDropdown ? "twa-button-with-dropdown" : ""}`}
        onClick={handleButtonClick}
        disabled={!enabled}
      >
        <span className="button-text">{title}</span>
        {hasDropdown && <span className="button-dropdown-arrow">▼</span>}
      </button>

      {hasDropdown && isDropdownOpen && (
        <div className="button-dropdown-menu">
          {dropdownItems.map((item, index) => (
            <div
              key={index}
              className="button-dropdown-item"
              onClick={() => handleDropdownItemClick(item)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Button.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  variant: PropTypes.oneOf(["primary", "secondary"]),
  enabled: PropTypes.bool,
  onClick: PropTypes.func,
  dropdownItems: PropTypes.array,
  onDropdownItemClick: PropTypes.func,
};

export default Button;

/* sample
<Button 
  title="Текст кнопки"
  variant="primary" // или "secondary"
  fullWidth={true} // или false
  enabled={true} // или false
  visible={true} // или false
  onClick={() => {}}
>
  <span>Кастомный контент</span>
</Button>
*/
