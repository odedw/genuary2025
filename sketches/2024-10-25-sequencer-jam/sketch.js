/// <reference types="p5/global" />
// constants
const PARTICLE_COUNT = 50;
const SEQUENCER_STEPS = 8;
const SEQUENCER_FREQUENCY = 8;

class Particle {
  constructor() {
    this.position = createVector(random(0, width), random(0, height));
    this.color = random(PALETTE);

    this.angle = random(0, TWO_PI);
    const min = random(50, 100);
    const max = min + random(50);
    this.sequencers = {
      size: createSequencer({
        frequency: Timing.frames(SEQUENCER_FREQUENCY),
        steps: SEQUENCER_STEPS,
        min,
        max,
      }),
      angle: createSequencer({
        frequency: Timing.frames(SEQUENCER_FREQUENCY),
        steps: SEQUENCER_STEPS,
        min: -PI / 4,
        max: PI / 4,
      }),
    };
  }

  update() {}

  draw() {
    push();
    fill(this.color);
    noStroke();
    translate(this.position.x, this.position.y);
    rotate(this.sequencers.angle.value);
    rect(0, 0, this.sequencers.size.value, this.sequencers.size.value);
    pop();
  }
}

// locals
let lfo1;
let sequencer1, sequencer2;
function setup() {
  // randomPalette();
  createCanvas(700, 700);
  rectMode(CENTER);
  // lfo1 = createLfo({
  //   waveform: LfoWaveform.Sine,
  //   frequency: Timing.frames(6),
  //   min: -PI,
  //   max: PI,
  // });
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  // pixelDensity(1);
  //   background(0);
}

function draw() {
  background(0, 0, 0, 100);
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });
}

let isLooping = true;
function mouseClicked() {
  isLooping = !isLooping;
}
