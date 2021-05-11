import * as styles from "./Sidebar.module.css"

function Sidebar({children}) {
  return (
    <div className={styles.sidebar}>
      {children}
    </div>
  );
}

export default Sidebar;