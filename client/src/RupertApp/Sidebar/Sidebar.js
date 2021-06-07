import React from 'react';
import PropTypes from "prop-types"
import * as styles from "./Sidebar.module.css"

// function Sidebar({children}) {
//   return (
//     <div className={styles.sidebar}>
//       {children}
//     </div>
//   );
// }

const Sidebar = ({sidebarOpen, setSidebarOpen = null, children}) => {
  // const node = useRef();
  // useOnClickOutside(node, () => setSidebarOpen(false));

  // useEffect(() => {
  //   document.body.style.overflow = 'hidden';
  //   return () => document.body.style.overflow = 'unset';
  // }, []);

  // const isHidden = sidebarOpen ? true : false;
  // const tabIndex = sidebarOpen ? 0 : -1;

  const animationStyle = sidebarOpen ? {transform: 'translateX(0)'} : {transform: 'translateX(-100%)'};

  return (
    // <nav aria-hidden={!sidebarOpen} className={styles.sidebar} style={animationStyle}>
    //   <NavLinks
    //     vertical
    //     tabIndex={sidebarOpen ? 0 : -1}
    //     linkStyle={styles.link}
    //     linkSideEffect={() => setSidebarOpen(false)}
    //   />
    // </nav>
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