const keyBindings = {
  walkLeft: "A",
  walkRight: "D",
  jump: " ",
  spin: "S",
  wave: "E",
  speak: "Shift",
  topHat: "T",
  monocle: "M",
  lollipop: "L",
}

const PenguinControls = {
  walk: (cost, pressedKey) => {
    if (cost === "OWNED") {
      alert(pressedKey === keyBindings.walkLeft ? "Walk left" : "Walk right");
    }
  },
  jump: (cost) => {
    if (cost === "OWNED") {
      document.querySelector(".penguin-container").classList.add("penguin-jump");
    }
  },
  spin: (cost) => {
    if (cost === "OWNED") {
      document.querySelector(".penguin-container").classList.add("penguin-spin");
    }
  },
  wave: (cost) => {
    if (cost === "OWNED") {
      alert("Wave");
    }
  },
  speak: (cost, audioRef) => {
    if (cost === "OWNED") {
      alert("Speak");
      audioRef.current.volume = 0.2;
      audioRef.current.play();
    }
  },
  toggleAccessory: (pressedKey) => {
    let accessory;
    switch (pressedKey) {
      case keyBindings.topHat:
        accessory = "Top Hat";
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
}

// handleKeyPress = (event) => {
//   const key = event.key === "Shift" ? event.key : event.key.toUpperCase();
//   switch (key) {
//     case keyBindings.walkLeft:
//     case keyBindings.walkRight:
//       this.walk(key);
//       break;
//     case keyBindings.jump:
//       this.jump();
//       break;
//     case keyBindings.spin:
//       this.spin();
//       break;
//     case keyBindings.wave:
//       this.wave();
//       break;
//     case keyBindings.speak:
//       this.speak();
//       break;
//     case keyBindings.topHat:
//     case keyBindings.monocle:
//     case keyBindings.lollipop:
//       this.toggleAccessory(key);
//       break;
//     default:
//       break;
//   }
// }

export default PenguinControls