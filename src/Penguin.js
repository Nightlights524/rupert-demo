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
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);

    const penguinContainer = document.querySelector(".penguin-container");
    penguinContainer.addEventListener('animationend', () => {
      penguinContainer.className = "penguin-container";
    });
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);

    const penguinContainer = document.querySelector(".penguin-container");
    penguinContainer.removeEventListener('animationend', () => {
      penguinContainer.className = "penguin-container";
    });
  }

  handleKeyPress = (event) => {
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

  walk = (pressedKey) => {
    if (this.props.costs.walk === "OWNED") {
      alert(pressedKey === keyBindings.walkLeft ? "Walk left" : "Walk right");
    }
  }
  
  jump = () => {
    if (this.props.costs.jump === "OWNED") {
      document.querySelector(".penguin-container").classList.add("penguin-jump");
    }
  }
  
  spin = () => {
    if (this.props.costs.spin === "OWNED") {
      document.querySelector(".penguin-container").classList.add("penguin-spin");
    }
  }
  
  wave = () => {
    if (this.props.costs.wave === "OWNED") {
      alert("Wave");
    }
  }
  
  speak = () => {
    if (this.props.costs.speak === "OWNED") {
      alert("Speak");
      this.penguinChirp.current.volume = 0.2;
      this.penguinChirp.current.play();
    }
  }
  
  toggleAccessory = (pressedKey) => {
    let accessory;
    switch (pressedKey) {
      case keyBindings.topHat:
        accessory = "Top hat";
        break;
      case keyBindings.monocle:
        accessory = "Monocle";
        break;
      case keyBindings.lollipop:
        accessory = "Lollipop";
        break;
      default:
        break;
    }
    alert(accessory);
  }

  render () {
    return (
      <div className="penguin-container">
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
      </div>
    );
  }
}

export default Penguin;