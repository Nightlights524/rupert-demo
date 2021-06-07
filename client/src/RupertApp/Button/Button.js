import React from 'react';
import * as styles from "./Button.module.css"
import PropTypes from "prop-types"

function Button({children, glow, ...props}) {
  return (
    <button 
      className={glow ? `${styles.button} ${styles.glow}` : styles.button}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  glow: PropTypes.bool
}

export default Button;