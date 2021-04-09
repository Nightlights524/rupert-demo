import './Sidebar.css';
import Purchasable from './Purchasable.js';

function Sidebar() {
  return (
    <div className="Sidebar">
      <Purchasable label="Walk" purchasableName="walk"/>
      <Purchasable label="Jump" purchasableName="jump"/>
      <Purchasable label="Spin" purchasableName="spin"/>
      <Purchasable label="Wave" purchasableName="wave"/>
      <Purchasable label="Speak" purchasableName="speak"/>
      <Purchasable label="Top Hat" purchasableName="topHat"/>
      <Purchasable label="Monacle" purchasableName="monacle"/>
      <Purchasable label="Lollipop" purchasableName="lollipop"/>
    </div>
  );
}

export default Sidebar;