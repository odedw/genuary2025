const config = { width: 700, height: 700, record: { shouldRecord: false, duration: 10 }, cellSize: 70, noiseMultiplier: 7, speed: 15, particleSize: 10, fps: 12 };
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.velocity = createVector(random(-config.speed, config.speed), random(-config.speed, config.speed));
  }
  update() {
    this.pos.add(this.velocity);
    return this.pos.x <= width && this.pos.x >= 0 && this.pos.y <= height && this.pos.y >= 0;
  }
  draw() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, config.particleSize);
  }
}
class Cell {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.c = random(PALETTE);
  }
  draw() {
    fill(this.c) && beginShape();
    const numberOfParticles = particles.filter((particle) => dist(particle.pos.x, particle.pos.y, this.pos.x, this.pos.y) < config.cellSize).length;
    const d = numberOfParticles * config.noiseMultiplier;
    vertex(this.pos.x - config.cellSize * 0.25 - random(d), this.pos.y - config.cellSize * 0.25 - random(d));
    vertex(this.pos.x - config.cellSize * 0.25 - random(d), this.pos.y + config.cellSize * 0.25 + random(d));
    vertex(this.pos.x + config.cellSize * 0.25 + random(d), this.pos.y + config.cellSize * 0.25 + random(d));
    vertex(this.pos.x + config.cellSize * 0.25 + random(d), this.pos.y - config.cellSize * 0.25 - random(d));
    endShape(CLOSE);
  }
}
let cells = [],
  particles = [];
function setup() {
  createCanvas(config.width, config.height) && frameRate(config.fps) && noStroke();
  for (let x = 0; x < width; x += config.cellSize) for (let y = 0; y < height; y += config.cellSize) cells.push(new Cell(x + config.cellSize / 2, y + config.cellSize / 2));
}
function draw() {
  if (frameCount % 3 === 0) particles.push(new Particle(random(width), random(height)));
  background(0) && cells.forEach((cell) => cell.draw());
  for (let i = particles.length - 1; i >= 0; i--) if (!particles[i].update()) particles.splice(i, 1);
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
