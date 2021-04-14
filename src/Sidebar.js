import './Sidebar.css';

function Sidebar({children}) {
  return (
    <div className="Sidebar">
      {children}
    </div>
  );
}

export default Sidebar;