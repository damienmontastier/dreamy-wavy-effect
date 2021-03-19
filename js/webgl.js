import Raf from "./raf";
import Viewport from "./viewport";
import { Renderer, Camera, Transform } from "ogl";

// image : https://unsplash.com/photos/mN6Bfk3hHRg
// dribble : https://dribbble.com/shots/15301232-Branding-Inspiration-Platform

let gl;

class GL {
  constructor() {
    this.renderer = new Renderer({ dpr: 2, alpha: true });

    this.gl = this.renderer.gl;
    document.body.appendChild(this.gl.canvas);

    this.camera = new Camera(this.gl, { fov: 45 });
    this.camera.position.z = 5;

    this.scene = new Transform();

    this.onWindowResize();

    Viewport.events.on("resize", this.onWindowResize.bind(this));

    Raf.add("webgl", this.update.bind(this), 0);
  }

  onWindowResize() {
    this.renderer.setSize(Viewport.width, Viewport.height);
    this.camera.perspective({ aspect: this.gl.canvas.width / this.gl.canvas.height });

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewportRenderer = {
      height,
      width,
    };
  }

  update() {
    this.renderer.render({ scene: this.scene, camera: this.camera });
  }

  destroy() {}
}

const WebGL = () => {
  return gl || (gl = new GL());
};

export default WebGL;
