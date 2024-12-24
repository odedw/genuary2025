/// <reference types="p5/global" />
const config = { width: 700, height: 700, record: { shouldRecord: false, duration: 120 }, cellSize: 70, particleSize: 20, numberOfParticles: 10 };

// Create engine with improved simulation parameters
let engine = Matter.Engine.create({ positionIterations: 8, velocityIterations: 8 });
randomPalette();
class Particle {
  constructor(x, y) {
    this.body = Matter.Bodies.circle(x, y, config.particleSize / 2, {
      restitution: 0.8,
    });
    this.color = random(PALETTE);
    Matter.Composite.add(engine.world, this.body);
  }

  draw() {
    fill(this.color);
    noStroke();
    ellipse(this.body.position.x, this.body.position.y, config.particleSize, config.particleSize);
  }
}

class Cell {
  constructor(x, y) {
    this.orientation = random() > 0.5 ? 1 : -1;
    this.a = (PI / 4) * this.orientation;
    this.body = Matter.Bodies.rectangle(x + config.cellSize / 2, y + config.cellSize / 2, 5, sqrt(2 * config.cellSize * config.cellSize), { angle: this.a, isStatic: true, friction: 0.1 });
    this.h = sqrt(2 * config.cellSize * config.cellSize);
    Matter.Composite.add(engine.world, this.body);
    this.timer = Timing.frames(120, { loop: false, autoTrigger: false });
  }

  draw() {
    this.body.angle = this.a - this.orientation * PI * this.timer.elapsed;
    if (this.timer.finished) {
      this.timer.reset();
      this.orientation = -this.orientation;
      this.a = this.body.angle;
    }
    if (random() < 0.0005 && !this.timer.active) {
      this.timer.activate();
    }
    const pos = this.body.position;
    const angle = this.body.angle;
    push();
    fill(255);
    translate(pos.x, pos.y);
    rotate(angle);
    rect(0, 0, 1, this.h);
    pop();
  }
}

const objects = [];

function setup() {
  createCanvas(config.width, config.height);
  fill(255);
  noStroke();
  rectMode(CENTER);

  for (let x = 0; x < width; x += config.cellSize) {
    for (let y = 0; y < height; y += config.cellSize) {
      objects.push(new Cell(x, y, config.cellSize));
    }
  }
  for (let i = 0; i < config.numberOfParticles; i++) {
    objects.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  // background(0, 0, 0, 20);
  background(0);
  Matter.Engine.update(engine);
  objects.forEach((object) => {
    object.draw();
  });
}

if (config.record.shouldRecord) {
  P5Capture.setDefaultOptions({
    format: "mp4",
    framerate: 60,
    quality: 1,
    bitrate: 1000000,
    width: config.width,
    height: config.height,
  });
} else {
  P5Capture.setDefaultOptions({
    disableUi: true,
  });
}
