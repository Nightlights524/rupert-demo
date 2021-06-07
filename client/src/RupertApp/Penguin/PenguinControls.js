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

export default PenguinControls