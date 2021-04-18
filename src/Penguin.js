import React from 'react';
import './Penguin.css';

const keyBindings = {
  resetPosition: "C",
  walkLeft: "A",
  walkRight: "D",
  jump: "W",
  spin: "S",
  waveLeftHand: "E",
  waveRightHand: "Q",
  speak: "Shift",
  topHat: "T",
  monocle: "M",
  lollipop: "L",
}

class Penguin extends React.Component {
  constructor(props) {
    super(props);
    this.penguinContainer = React.createRef();
    this.penguinLeftHand = React.createRef();
    this.penguinRightHand = React.createRef();
    this.penguinChirp = React.createRef();
    this.topHat = React.createRef();
    this.monocle = React.createRef();
    this.lollipop = React.createRef();
    this.animationRunning = false;
    this.preAnimationX = null;
    this.preAnimationY = null;
    this.state = {
      offsetX: 0,
      offsetY: 0,
      topHat: false,
      monocle: false,
      lollipop: false
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
    this.penguinContainer.current.addEventListener('animationstart', this.handleAnimationStart);
    this.penguinContainer.current.addEventListener('animationend', this.handleAnimationEnd);

    this.penguinLeftHand.current.addEventListener('animationstart', this.handleAnimationStart);
    this.penguinLeftHand.current.addEventListener('animationend', () => {
      this.animationRunning = false;
      this.penguinLeftHand.current.className = "left-hand";
    });

    this.penguinRightHand.current.addEventListener('animationstart', this.handleAnimationStart);
    this.penguinRightHand.current.addEventListener('animationend', () => {
      this.animationRunning = false;
      this.penguinRightHand.current.className = "right-hand";
    });
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
    this.penguinContainer.current.removeEventListener('animationstart', this.handleAnimationStart);
    this.penguinContainer.current.removeEventListener('animationend', this.handleAnimationEnd);

    this.penguinLeftHand.current.removeEventListener('animationstart', this.handleAnimationStart);
    this.penguinLeftHand.current.removeEventListener('animationend', () => {
      this.animationRunning = false;
      this.penguinLeftHand.current.className = "left-hand";
    });

    this.penguinRightHand.current.removeEventListener('animationstart', this.handleAnimationStart);
    this.penguinRightHand.current.removeEventListener('animationend', () => {
      this.animationRunning = false;
      this.penguinRightHand.current.className = "right-hand";
    });
  }

  setPreAnimationPosition = () => {
    this.preAnimationX = this.penguinContainer.current.getBoundingClientRect().x;
    this.preAnimationY = this.penguinContainer.current.getBoundingClientRect().y;
  }

  handleKeyPress = (event) => {
    if (this.animationRunning) {
      return;
    }

    this.setPreAnimationPosition();

    const key = event.key === "Shift" ? event.key : event.key.toUpperCase();
    switch (key) {
      case keyBindings.resetPosition:
        this.resetPosition();
        break;
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
      case keyBindings.waveLeftHand:
      case keyBindings.waveRightHand:
        this.wave(key);
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

  handleAnimationStart = (event) => {
    this.animationRunning = true;
  }

  handleAnimationEnd = (event) => {
    const changeX = Math.round(this.penguinContainer.current.getBoundingClientRect().x - this.preAnimationX);
    const changeY = Math.round(this.penguinContainer.current.getBoundingClientRect().y - this.preAnimationY);
    
    this.setState((prevState, currentProps) => {
      return {
        offsetX: prevState.offsetX + changeX,
        offsetY: prevState.offsetY + changeY
      };
    }, () => {
      this.animationRunning = false;
      this.penguinContainer.current.className = "penguin-container";
    });
  }

  // disappear = () => {
  //     opacity--;
  //     this.penguinContainer.current.style.opacity = opacity/100;
  //     if (opacity > 0){
  //         requestAnimationFrame(this.moveTwo);
  //     }
  // }

  resetPosition = () => {
    if (this.state.offsetX === 0 &&
        this.state.offsetY === 0) {
          return;
    }
    this.penguinContainer.current.classList.add("penguin-reset-position");
  }

  walk = (pressedKey) => {
    this.setPreAnimationPosition();
    if (this.props.costs.walk === "OWNED") {
      if(pressedKey === keyBindings.walkLeft) {
        this.penguinContainer.current.classList.add("penguin-walk-left");
      }
      else if(pressedKey === keyBindings.walkRight) {
        this.penguinContainer.current.classList.add("penguin-walk-right");
      }
    }
  }
  
  jump = () => {
    this.setPreAnimationPosition();
    if (this.props.costs.jump === "OWNED") {
      this.penguinContainer.current.classList.add("penguin-jump");
    }
  }
  
  spin = () => {
    this.setPreAnimationPosition();
    if (this.props.costs.spin === "OWNED") {
      this.penguinContainer.current.classList.add("penguin-spin");
    }
  }
  
  wave = (pressedKey) => {
    if (this.props.costs.wave === "OWNED") {
      if(pressedKey === keyBindings.waveLeftHand) {
        this.penguinLeftHand.current.classList.add("penguin-wave-left");
      }
      else if(pressedKey === keyBindings.waveRightHand) {
        this.penguinRightHand.current.classList.add("penguin-wave-right");
      }
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
        accessory = "topHat";
        break;
      case keyBindings.monocle:
        accessory = "monocle";
        break;
      case keyBindings.lollipop:
        accessory = "lollipop";
        break;
      default:
        return;
    };
    
    this.setState((prevState, currentProps) => {
      return {[accessory]: !prevState[accessory]};
    });
  }

  render () {
    return (
      <div className="penguin-container"
        ref={this.penguinContainer}
        style={{left: `${this.state.offsetX}px`, top: `${this.state.offsetY}px`}}
        >
        <div className="penguin">
          <div className="penguin-bottom">
            <div className="right-hand" ref={this.penguinRightHand}>
             {this.props.costs.lollipop === "OWNED" &&
              this.state.lollipop &&
              <div className="lollipop" ref={this.lollipop}>
                <div className="lollipop-top"></div>
                <div className="lollipop-stick"></div>
              </div>}
            </div>
            <div className="left-hand" ref={this.penguinLeftHand}></div>
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
         {this.props.costs.topHat === "OWNED" &&
          this.state.topHat &&
          <div className="top-hat" ref={this.topHat}>
            <div className="top-hat-top"></div>
            <div className="top-hat-middle"></div>
            <div className="top-hat-stripe-background"></div>
            <div className="top-hat-stripe"></div>
            <div className="top-hat-brim"></div>
          </div>}
         {this.props.costs.monocle === "OWNED" &&
          this.state.monocle &&
          <div className="monocle" ref={this.monocle}>
            <div className="monocle-lens"></div>
            <div className="monocle-string"></div>
          </div>}
        </div>
        <audio 
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