let gui;

class Tweakpane {
  constructor() {
    const Tweakpane = require("tweakpane");
    this.gui = new Tweakpane({ title: "GUI" });
  }
}

const GUI = () => {
  return gui || (gui = new Tweakpane());
};

export default GUI;
