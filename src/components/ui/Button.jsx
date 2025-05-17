import React from "react";
import PropTypes from "prop-types";
import "./Button.css";

const Button = ({
  title,
  children,
  enabled = true,
  visible = true,
  variant = "primary", // primary, secondary
  fullWidth = false,
  onClick,
}) => {
  if (!visible) return null;

  return (
    <button
      className={`telegram-button ${!enabled ? "disabled" : ""} ${variant} ${
        fullWidth ? "full-width" : ""
      }`}
      onClick={enabled ? onClick : undefined}
    >
      {children || title}
    </button>
  );
};

Button.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  enabled: PropTypes.bool,
  visible: PropTypes.bool,
  variant: PropTypes.oneOf(["primary", "secondary"]),
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
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
