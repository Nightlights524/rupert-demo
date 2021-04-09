import './Purchasable.css';
import logo from './logo.svg';

function Purchasable({label, purchasableName, cost}) {
  return (
    <div className="Purchasable">
      <img src={logo} className="Purchasable-icon" alt={label} />
      <p className="Purchasable-label">{label}: {cost}</p>
    </div>
  );
}

export default Purchasable;