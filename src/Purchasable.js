// import React from 'react';
import './Purchasable.css';
import logo from './logo.svg';

function Purchasable({label, item, cost, onClick}) {
  return (
    <div className="Purchasable" onClick={() => onClick(item, cost)}>
      <img src={logo} className="Purchasable-icon" alt={label} />
      <p className="Purchasable-label">{label}: {cost}</p>
    </div>
  );
}




// class Purchasable extends React.Component {
//   constructor(props) {
//     super(props);
//     // this.triggerSound = this.triggerSound.bind(this)
//     this.handleKeyPress = this.handleKeyPress.bind(this)
//   }

//   componentDidMount() {
//     document.addEventListener('keydown', this.handleKeyPress);
//   }
//   componentWillUnmount() {
//     document.removeEventListener('keydown', this.handleKeyPress);
//   }

//   // triggerSound () {
//   //   const sound = document.getElementById(this.props.keyTrigger);
//   //   sound.currentTime = 0;
//   //   sound.play();
//   //   this.props.setDisplay(this.props.clipID);
//   // }

//   handleKeyPress (event) {
//     const trigger = event.key.toUpperCase();
//     if(trigger === this.props.keyTrigger) {
//       this.triggerSound();
//     }
//   }

//   render () {
//     const {label, item, cost, onClick} = this.props;
//     return (
//       <div className="Purchasable" onClick={() => onClick(item, cost)}>
//       <img src={logo} className="Purchasable-icon" alt={label} />
//       <p className="Purchasable-label">{label}: {cost}</p>
//     </div>
//       // <button
//       //   className="drum-pad"
//       //   id={this.props.clipID}
//       //   tabIndex={-1}
//       //   onMouseDown={this.triggerSound}
//       // >
//       //   {this.props.keyTrigger}
//       //   <audio
//       //     id={this.props.keyTrigger}
//       //     className="clip"
//       //     src={this.props.clipSource}
//       //   >
//       //     Your browser does not support the <code>audio</code> element.
//       //   </audio>
//       // </button>
//     );
//   }
// }

export default Purchasable;