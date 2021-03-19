import "./index.css";
import WebGL from "~/js/webgl";
import Picture from "~/js/picture";
import GUI from "~/js/gui";

class App {
  constructor() {
    this.paused = false;
    this.createMedias();

    WebGL();
    GUI();

    // const { gui } = GUI();

    // this.gui = gui.addFolder({ title: "RAF" });

    // this.gui.addInput(this, "paused", {
    //   label: "Pause",
    // });
  }
  createMedias() {
    this.mediasElements = document.querySelectorAll("[data-webgl-picture]");

    this.medias = Object.values(this.mediasElements).map((element) => {
      const picture = new Picture({
        element,
      });

      return picture;
    });

    console.log(this.medias);
  }
}

export default new App();
