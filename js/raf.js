class Raf {
  constructor(fps = 60) {
    this.then = null;
    this.tolerance = 0.1;
    this.interval = 1000 / fps;

    this.rafs = {};
    this.raf = null;
  }

  add(id, callback, priority = 0, once = false) {
    if (typeof callback !== "function") {
      console.error("add() : Callback argument must be a function");
    } else if (this.rafs[id]) {
      console.error(`id : This id: ${id} is already used`);
    } else {
      this.rafs[id] = { id, callback, priority, once };
    }

    this.then = performance.now();

    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addOnce(id, callback) {
    return this.add(id, callback, priority, true);
  }

  remove(id, callback) {
    if (typeof callback !== "function") {
      console.error("add() : Callback argument must be a function");
    } else if (!this.rafs[id]) {
      console.error(`id: This id : ${id} doesn't exist`);
    } else {
      delete this.rafs[id];
    }
  }

  update(timestamp) {
    const delta = timestamp - this.then;

    if (delta >= this.interval - this.tolerance) {
      this.then = timestamp - (delta % this.interval);

      Object.values(this.rafs)
        .sort((a, b) => {
          return a.priority - b.priority;
        })
        .forEach((raf) => {
          // console.log(raf)
          raf.callback();

          if (raf.once) {
            this.remove(raf.id, raf.callback);
          }
        });

      // for (let index = 0; index < Object.keys(this.rafs).length; index++) {
      //   const raf = Object.values(this.rafs)[index]

      //   raf.callback()

      //   if (raf.once) {
      //     this.remove(raf.id, raf.callback)
      //   }
      // }
    }

    window.requestAnimationFrame(this.update.bind(this));
  }
}

const instanceRaf = new Raf();
Object.freeze(instanceRaf);

export default new Raf();
