import React from 'react';
import PropTypes from "prop-types"
import * as styles from "./Sidebar.module.css"

const Sidebar = ({sidebarOpen, setSidebarOpen = null, children}) => {
  const animationStyle = sidebarOpen ? {transform: 'translateX(0)'} : {transform: 'translateX(-100%)'};

  return (
    <div aria-hidden={!sidebarOpen} className={styles.sidebar} style={animationStyle}>
      {children}
    </div>
  )
}

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func,
  children: PropTypes.node.isRequired,
}

export default Sidebar;