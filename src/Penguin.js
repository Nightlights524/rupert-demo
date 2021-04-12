import React from 'react';
import './Penguin.css';

const keyBindings = {
  walkLeft: "a",
  walkRight: "d",
  jump: " ",
  spin: "s",
  wave: "e",
  speak: "Shift",
  topHat: "t",
  monocle: "m",
  lollipop: "l",
}

class Penguin extends React.Component {
  constructor(props) {
    super(props);
    this.penguinChirp = React.createRef();
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.walk = this.walk.bind(this);
    this.jump = this.jump.bind(this);
    this.spin = this.spin.bind(this);
    this.wave = this.wave.bind(this);
    this.speak = this.speak.bind(this);
    this.toggleAccessory = this.toggleAccessory.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  // triggerSound () {
  //   const sound = document.getElementById(this.props.keyTrigger);
  //   sound.currentTime = 0;
  //   sound.play();
  //   this.props.setDisplay(this.props.clipID);
  // }

  handleKeyPress (event) {
    const key = event.key;
    switch (key) {
      case keyBindings.walkLeft:
      case keyBindings.walkRight:
        this.walk(key);
        break;
      case keyBindings.jump:
        this.jump();
        break;
      case keyBindings.spin:
        this.spin();
        break;
      case keyBindings.wave:
        this.wave();
        break;
      case keyBindings.speak:
        this.speak();
        break;
      case keyBindings.topHat:
      case keyBindings.monocle:
      case keyBindings.lollipop:
        this.toggleAccessory(key);
        break;
      default:
        break;
    }
  }

  walk(pressedKey) {
    if (this.props.costs.walk === "OWNED") {
      alert(pressedKey === keyBindings.walkLeft ? "Walk left" : "Walk right");
    }
  }
  
  jump() {
    if (this.props.costs.jump === "OWNED") {
      alert("Jump");
    }
  }
  
  spin() {
    if (this.props.costs.spin === "OWNED") {
      alert("Spin");
    }
  }
  
  wave() {
    if (this.props.costs.wave === "OWNED") {
      alert("Wave");
    }
  }
  
  speak() {
    if (this.props.costs.speak === "OWNED") {
      alert("Speak");
      this.penguinChirp.current.volume = 0.2;
      this.penguinChirp.current.play();
    }
  }
  
  toggleAccessory(pressedKey) {
    let accessory;
    if (pressedKey === keyBindings.topHat) {
      accessory = "Top hat";
    }
    else if (pressedKey === keyBindings.monocle) {
      accessory = "Monocle";
    }
    else if (pressedKey === keyBindings.lollipop) {
      accessory = "Lollipop";
    }
    alert(accessory);
  }

  render () {
    return (
      <div className="penguin">
        <div className="penguin-bottom">
          <div className="right-hand"></div>
          <div className="left-hand"></div>
          <div className="right-feet"></div>
          <div className="left-feet"></div>
        </div>
        <div className="penguin-top">
          <div className="right-cheek"></div>
          <div className="left-cheek"></div>
          <div className="belly"></div>
          <div className="right-eye">
            <div className="sparkle"></div>
          </div>
          <div className="left-eye">
            <div className="sparkle"></div>
          </div>
          <div className="blush-right"></div>
          <div className="blush-left"></div>
          <div className="beak-top"></div>
          <div className="beak-bottom"></div>
        </div>
        <audio 
          id="penguinChirp"
          ref={this.penguinChirp}
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        >
          Your browser does not support the
          <code>audio</code> element.
        </audio>
      </div>
    );
  }
}

export default Penguin;