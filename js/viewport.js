import Events from "events";

class Viewport {
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.ratio = window.innerWidth / window.innerHeight;

    this.events = new Events();
    this.events.setMaxListeners(50);
    this.onWindowResize();

    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  }

  onWindowResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.ratio = this.width / this.height;

    // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    const vh = this.height * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    this.events.emit("resize", this.$data);
  }
}

export default new Viewport();
