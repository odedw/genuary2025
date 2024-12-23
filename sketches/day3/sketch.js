/// <reference types="p5/global" />
const config = { width: 700, height: 700, record: { shouldRecord: false, duration: 120 }, cellSize: 50, particleSize: 10 };

class Particle {
  constructor(x, y) {
    this.size = config.particleSize;
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.pos = createVector(x, y);
  }

  draw() {
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }

  update() {
    const cell = cells.find((cell) => dist(this.pos.x, this.pos.y, cell.x, cell.y) < config.cellSize);
    // bounce off the cell line
    if (cell && cell.orientation === 1) {
    }

    this.pos.add(this.vel);
  }
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.orientation = random() > 0.5 ? 1 : -1;
  }

  draw() {
    if (this.orientation === 1) {
      line(this.x, this.y, this.x + config.cellSize, this.y + config.cellSize);
    } else {
      line(this.x + config.cellSize, this.y, this.x, this.y + config.cellSize);
    }
  }

  update() {}
}

const cells = [];
const particles = [];

function setup() {
  createCanvas(config.width, config.height);
  stroke(255);
  rectMode(CENTER);
  strokeWeight(2);
  noFill();

  for (let x = 0; x < width; x += config.cellSize) {
    for (let y = 0; y < height; y += config.cellSize) {
      cells.push(new Cell(x, y, config.cellSize));
    }
  }

  particles.push(new Particle(width / 2, height / 2));
}

function draw() {
  background(0);
  cells.forEach((cell) => {
    cell.update();
    cell.draw();
  });
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });
}

// let isLooping = true;
// function mouseClicked() {
//   isLooping = !isLooping;
//   isLooping ? loop() : noLoop();
// }

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
