/// <reference types="p5/global" />
const config = {
  width: 700,
  height: 700,
  record: {
    shouldRecord: false,
    duration: 60 * 15,
  },
  numberOfParticles: 100,
  strokeWeight: {
    min: 2,
    max: 15,
  },
  chanceToSwitchDirection: 0.07,
  chanceToHorizontal: 0.5,
  speed: {
    min: 1,
    max: 1,
  },
};

class Particle {
  constructor(x, y, speed, color) {
    this.pos = createVector(x, y);
    this.prevPositions = [this.pos.copy()];
    this.lfo1 = createLfo({
      waveform: LfoWaveform.Sine,
      frequency: Timing.frames(int(random(120, 180))),
      min: config.strokeWeight.min,
      max: config.strokeWeight.max,
    });
    this.lfo2 = createLfo({
      waveform: LfoWaveform.Sine,
      frequency: Timing.frames(int(random(120, 180))),
      min: 0,
      max: 1,
    });

    // Randomly choose either horizontal or vertical movement
    if (random() < config.chanceToHorizontal) {
      // Horizontal movement: random direction (-1 or 1)
      this.vel = createVector(random() < 0.5 ? -speed : speed, 0);
    } else {
      // Vertical movement: random direction (-1 or 1)
      this.vel = createVector(0, random() < 0.5 ? -speed : speed);
    }

    this.color = color;
    this.maxTrailLength = 50; // Adjust this to control trail length
  }

  update() {
    if (random() < globalLfo1.value) {
      const speed = this.vel.mag(); // preserve current speed
      if (this.vel.x === 0) {
        // Currently moving vertically, switch to horizontal
        this.vel = createVector(random() < 0.5 ? -speed : speed, 0);
      } else {
        // Currently moving horizontally, switch to vertical
        this.vel = createVector(0, random() < 0.5 ? -speed : speed);
      }
    }

    // Update position based on velocity
    this.pos.add(this.vel);

    // Store current position in trail
    this.prevPositions.push(this.pos.copy());

    // Remove oldest position if trail is too long
    if (this.prevPositions.length > this.maxTrailLength) {
      this.prevPositions.shift();
    }
  }

  draw() {
    if (this.prevPositions.length < 2) return;

    // Draw line for the most recent segment
    const lastIdx = this.prevPositions.length - 1;
    strokeWeight(this.lfo1.value);
    stroke(this.color);
    line(
      this.prevPositions[lastIdx - 1].x,
      this.prevPositions[lastIdx - 1].y,
      this.prevPositions[lastIdx].x,
      this.prevPositions[lastIdx].y
    );
  }
}

let globalLfo1;
let particles = [];
function setup() {
  randomPalette();
  createCanvas(config.width, config.height);
  frameRate(60);
  for (let i = 0; i < config.numberOfParticles; i++) {
    particles.push(
      new Particle(
        random(width),
        random(height),
        random(config.speed.min, config.speed.max),
        random(PALETTE)
      )
    );
  }
  strokeWeight(config.strokeWeight);
  background(0);
  globalLfo1 = createLfo({
    waveform: LfoWaveform.Square,
    frequency: Timing.frames(360),
    min: 0,
    max: 0.3,
  });
}

function draw() {
  if (config.record.shouldRecord && frameCount === 1) {
    const capture = P5Capture.getInstance();
    capture.start({
      duration: config.record.duration,
    });
  }
  // background(0);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }
}

let isLooping = true;
function mouseClicked() {
  isLooping = !isLooping;
  isLooping ? loop() : noLoop();
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
