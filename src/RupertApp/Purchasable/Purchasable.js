import './Purchasable.css';
import logo from './logo.svg';

function Purchasable({label, item, cost, keyBinding, onClickUnowned, onClickOwned}) {
  const owned = cost === "OWNED";
  return (
    <button className="Purchasable" onClick={owned ? onClickOwned : () => onClickUnowned(item, cost)}>
      <div className="Purchasable-icon-container">
        <img src={logo} className="Purchasable-icon" alt={label} />
        {owned && <span className="fas fa-check-square Purchasable-checkmark"></span>}
      </div>
      <p className="Purchasable-label">{label}: {owned ? keyBinding : cost}</p>
    </button>
  );
}

export default Purchasable;