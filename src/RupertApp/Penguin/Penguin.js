import React from 'react';
import * as styles from "./Penguin.module.css"
import penguinChirp from './PenguinChirp.mp3';

const keyBindings = {
  resetPosition: "C",
  walkLeft: "A",
  walkRight: "D",
  jump: "W",
  spin: "S",
  waveLeftHand: "E",
  waveRightHand: "Q",
  speak: "F",
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
      this.penguinLeftHand.current.className = styles.leftHand;
    });

    this.penguinRightHand.current.addEventListener('animationstart', this.handleAnimationStart);
    this.penguinRightHand.current.addEventListener('animationend', () => {
      this.animationRunning = false;
      this.penguinRightHand.current.className = styles.rightHand;
    });
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
    this.penguinContainer.current.removeEventListener('animationstart', this.handleAnimationStart);
    this.penguinContainer.current.removeEventListener('animationend', this.handleAnimationEnd);

    this.penguinLeftHand.current.removeEventListener('animationstart', this.handleAnimationStart);
    this.penguinLeftHand.current.removeEventListener('animationend', () => {
      this.animationRunning = false;
      this.penguinLeftHand.current.className = styles.leftHand;
    });

    this.penguinRightHand.current.removeEventListener('animationstart', this.handleAnimationStart);
    this.penguinRightHand.current.removeEventListener('animationend', () => {
      this.animationRunning = false;
      this.penguinRightHand.current.className = styles.rightHand;
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
      this.penguinContainer.current.className = styles.penguinContainer;
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
    this.penguinContainer.current.classList.add(styles.penguinResetPosition);
  }

  walk = (pressedKey) => {
    if (!this.animationRunning && this.props.costs.walk === "OWNED") {
      this.setPreAnimationPosition();
      if(pressedKey === keyBindings.walkLeft) {
        this.penguinContainer.current.classList.add(styles.penguinWalkLeft);
      }
      else if(pressedKey === keyBindings.walkRight) {
        this.penguinContainer.current.classList.add(styles.penguinWalkRight);
      }
    }
  }
  
  jump = () => {
    if (!this.animationRunning && this.props.costs.jump === "OWNED") {
      this.setPreAnimationPosition();
      this.penguinContainer.current.classList.add(styles.penguinJump);
    }
  }
  
  spin = () => {
    if (!this.animationRunning && this.props.costs.spin === "OWNED") {
      this.setPreAnimationPosition();
      this.penguinContainer.current.classList.add(styles.penguinSpin);
    }
  }
  
  wave = (pressedKey) => {
    if (!this.animationRunning && this.props.costs.wave === "OWNED") {
      if(pressedKey === keyBindings.waveLeftHand) {
        this.penguinLeftHand.current.classList.add(styles.penguinWaveLeft);
      }
      else if(pressedKey === keyBindings.waveRightHand) {
        this.penguinRightHand.current.classList.add(styles.penguinWaveRight);
      }
    }
  }
  
  speak = () => {
    if (!this.animationRunning && this.props.costs.speak === "OWNED") {
      // this.penguinChirp.current.volume = 0.2;
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
      <div className={styles.penguinContainer}
        ref={this.penguinContainer}
        style={{left: `${this.state.offsetX}px`, top: `${this.state.offsetY}px`}}
        >
        <div className={styles.penguin}>
          <div className={styles.penguinBottom}>
            <div className={styles.rightHand} ref={this.penguinRightHand}>
             {this.props.costs.lollipop === "OWNED" &&
              this.state.lollipop &&
              <div className={styles.lollipop} ref={this.lollipop}>
                <div className={styles.lollipopTop}></div>
                <div className={styles.lollipopStick}></div>
              </div>}
            </div>
            <div className={styles.leftHand} ref={this.penguinLeftHand}></div>
            <div className={styles.rightFoot}></div>
            <div className={styles.leftFoot}></div>
          </div>
          <div className={styles.penguinTop}>
            <div className={styles.rightCheek}></div>
            <div className={styles.leftCheek}></div>
            <div className={styles.belly}></div>
            <div className={styles.rightEye}>
              <div className={styles.sparkle}></div>
            </div>
            <div className={styles.leftEye}>
              <div className={styles.sparkle}></div>
            </div>
            <div className={styles.blushRight}></div>
            <div className={styles.blushLeft}></div>
            <div className={styles.beakTop}></div>
            <div className={styles.beakBottom}></div>
          </div>
         {this.props.costs.topHat === "OWNED" &&
          this.state.topHat &&
          <div className={styles.topHat} ref={this.topHat}>
            <div className={styles.topHatTop}></div>
            <div className={styles.topHatMiddle}></div>
            <div className={styles.topHatStripeBackground}></div>
            <div className={styles.topHatStripe}></div>
            <div className={styles.topHatBrim}></div>
          </div>}
         {this.props.costs.monocle === "OWNED" &&
          this.state.monocle &&
          <div className={styles.monocle} ref={this.monocle}>
            <div className={styles.monocleLens}></div>
            <div className={styles.monocleString}></div>
          </div>}
        </div>
        <audio src={penguinChirp} ref={this.penguinChirp}>
          Your browser does not support the
          <code>audio</code> element.
        </audio>
      </div>
    );
  }
}

export default Penguin;