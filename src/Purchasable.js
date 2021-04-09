import './Purchasable.css';
import logo from './logo.svg';

function Purchasable({label, purchasableName}) {
  return (
    <div className="Purchasable">
      <img src={logo} className="Purchasable-icon" alt={label} />
      <p className="Purchasable-label">{label}</p>
    </div>
  );
}

export default Purchasable;