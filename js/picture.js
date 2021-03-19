import { Program, Mesh, Plane, Texture } from "ogl";
import gsap from "gsap";

import WebGL from "~/js/webgl";
import Viewport from "./viewport";
import Raf from "./raf";
import GUI from "~/js/gui";

const vertex = `
                attribute vec3 position;
                attribute vec3 normal;
                attribute vec2 uv;
                uniform mat4 modelViewMatrix;
                uniform mat4 projectionMatrix;
                uniform mat3 normalMatrix;
                varying vec3 vNormal;
                varying vec2 vUv;

                void main() {
                    vNormal = normalize(normalMatrix * normal);

                    vUv = uv;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `;

const fragment = `
                precision highp float;
                varying vec3 vNormal;
                varying vec2 vUv;

                uniform vec2 uImageSizes;
                uniform float uProgress;
                uniform float uOffsetY;
                uniform float uOffsetX;
                uniform vec2 uPlaneSizes;
                uniform sampler2D tMap;

                float delay = 3.0;

                vec2 resizedUv(vec2 inital_uv, vec2 aspect_ratio) {
                    vec2 ratio = vec2(
                        min((uPlaneSizes.x / uPlaneSizes.y) / (aspect_ratio.x / aspect_ratio.y), 1.0),
                        min((uPlaneSizes.y / uPlaneSizes.x) / (aspect_ratio.y / aspect_ratio.x), 1.0)
                    );

                    vec2 new_uv = vec2(
                        inital_uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
                        inital_uv.y * ratio.y + (1.0 - ratio.y) * 0.5
                    );

	                return new_uv;
                }

                vec4 getTexture2D(vec2 uv) {
                    return texture2D(tMap, uv);
                }

                vec4 wavyEffect(vec2 p) {
                    float phase = uProgress*uProgress + uProgress + 0.0;
                    float shifty = uOffsetY*uProgress*cos(uOffsetX*(uProgress+p.x));

                    vec2 offset = vec2(0, shifty);

                    return mix(
                      getTexture2D(p + offset), 
                      vec4(1.0, 1.0, 1.0, 1.0), 
                      uProgress
                    );
                }

                void main() {
                    vec2 uv = resizedUv(vUv, uImageSizes);
                    vec3 normal = normalize(vNormal);

                    // vec3 tex = getTexture2D(uv).rgb;
                    vec3 texture = wavyEffect(uv).rgb;

                    float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));

                    gl_FragColor.rgb = texture + lighting * 0.1;
                    gl_FragColor.a = 1.0;
                }
            `;

export default class Picture {
  constructor({ element }) {
    this.element = element;
    this.image = this.element.querySelector("img");

    this.createShader();
    this.createMesh();

    this.createBounds();

    this.initGUI();

    this.onResize();

    // this.runProgress();

    Raf.add(`image-'${this.mesh.id}`, this.update.bind(this), 0);
  }
  initGUI() {
    const { gui } = GUI();

    this.gui = gui.addFolder({ title: `Image ${this.mesh.id}` });

    this.gui
      .addButton({
        title: "PLAY",
      })
      .on("click", this.runProgress.bind(this));

    this.gui
      .addInput(this.program.uniforms.uOffsetY, "value", {
        min: 0,
        max: 1,
        step: 0.01,
        label: "Y Offset",
      })
      .on("change", (payload) => (this.program.uniforms.uOffsetY.value = payload.value));

    this.gui
      .addInput(this.program.uniforms.uOffsetX, "value", {
        min: 0,
        max: 50,
        step: 1,
        label: "X Offset",
      })
      .on("change", (payload) => (this.program.uniforms.uOffsetX.value = payload.value));
  }
  runProgress() {
    this.tProgress?.kill();

    this.tProgress = gsap.to(this.program.uniforms.uProgress, {
      value: 0,
      duration: 2,
      repeat: -1,
      ease: "power2.out",
    });
  }
  createShader() {
    const { gl } = WebGL();

    this.texture = new Texture(gl, {
      generateMipmaps: false,
    });

    this.program = new Program(gl, {
      depthTest: false,
      depthWrite: false,
      fragment,
      vertex,
      uniforms: {
        tMap: { value: this.texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uOffsetY: { value: 0.2 },
        uOffsetX: { value: 10.0 },
        uProgress: {
          value: 1.0,
        },
        uViewportSizes: { value: [Viewport.width, Viewport.height] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
      },
      transparent: true,
    });

    const image = new Image();

    image.src = this.image.src;

    image.onload = (_) => {
      this.texture.image = image;

      this.program.uniforms.uImageSizes.value = [image.naturalWidth, image.naturalHeight];
    };
  }
  createMesh() {
    const { gl, scene } = WebGL();

    this.geometry = new Plane(gl, {
      width: 1,
      height: 1,
      heightSegments: 50,
      widthSegments: 100,
    });

    this.mesh = new Mesh(gl, {
      geometry: this.geometry,
      program: this.program,
    });

    this.mesh.setParent(scene);
  }
  createBounds() {
    const { viewportRenderer } = WebGL();

    this.bounds = this.element.getBoundingClientRect();

    this.mesh.scale.x = (viewportRenderer.width * this.bounds.width) / Viewport.width;
    this.mesh.scale.y = (viewportRenderer.height * this.bounds.height) / Viewport.height;

    this.mesh.program.uniforms.uViewportSizes.value = [viewportRenderer.width, viewportRenderer.height];

    this.mesh.program.uniforms.uPlaneSizes.value = [this.mesh.scale.x, this.mesh.scale.y];
  }
  onResize() {
    this.resizeObserver = new ResizeObserver((entries) => {
      this.createBounds();
    });

    this.resizeObserver.observe(this.element);
  }
  updatePosition(x = 0, y = 0) {
    const { viewportRenderer } = WebGL();

    this.mesh.position.x = -(viewportRenderer.width / 2) + this.mesh.scale.x / 2 + ((this.bounds.left - x) / Viewport.width) * viewportRenderer.width;

    this.mesh.position.y = viewportRenderer.height / 2 - this.mesh.scale.y / 2 - ((this.bounds.top - y) / Viewport.height) * viewportRenderer.height;
  }
  update() {
    this.updatePosition();
  }
}
