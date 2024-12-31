/// <reference types="p5/global" />

//=================Config=============================

const config = {
  width: 700,
  height: 700,
  fps: 60,
  lfoFrames: 600,
  numberOfPoints: 20000,
  speed: 0.5,
  chanceForParticle: 0.5,
  brightnessThreshold: 70,
  record: {
    shouldRecord: false,
    duration: 10,
  },
};

//=================Classes=============================

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    const distance = 200;
    const randomAngle = random(TWO_PI);
    this.altPos = createVector(
      x + distance * cos(randomAngle),
      y + distance * sin(randomAngle)
    );
    this.vel = createVector(
      random(-config.speed, config.speed),
      random(-config.speed, config.speed)
    );
    this.lfoX = createLfo({
      waveform: LfoWaveform.Sine,
      frequency: Timing.frames(config.lfoFrames),
      min: this.pos.x,
      max: this.altPos.x,
    });
    this.lfoY = createLfo({
      waveform: LfoWaveform.Sine,
      frequency: Timing.frames(config.lfoFrames),
      min: this.pos.y,
      max: this.altPos.y,
    });
  }

  update() {
    // this.pos.add(this.vel);
    // if (this.pos.x < 0 || this.pos.x > width) {
    //   this.vel.x = -this.vel.x;
    // }
    // if (this.pos.y < 0 || this.pos.y > height) {
    //   this.vel.y = -this.vel.y;
    // }
    this.pos.x = this.lfoX.value;
    this.pos.y = this.lfoY.value;
  }

  draw() {
    noStroke();
    fill(buffer.get(this.pos.x, this.pos.y));
    ellipse(this.pos.x, this.pos.y, 2, 2);
  }
}

//=================Variables=============================

let lfo1;
let center;
let particles = [];
let points = [];
let coords = [];
let triangleColors = [];
let delaunay;
let img;
let buffer;
//=================Preload===========================
function preload() {
  img = loadImage("../../public/images/Screenshot2024-12-30.png");
}
//=================Setup=============================

function setup() {
  createCanvas(config.width, config.height);
  frameRate(config.fps);
  rectMode(CENTER);
  center = createVector(width / 2, height / 2);
  noStroke();

  // for (let i = 0; i < config.numberOfPoints; i++) {
  //   particles.push(new Particle(random(width), random(height)));
  // }

  buffer = createGraphics(width, height);
  buffer.image(img, 0, 0, width, height);

  while (particles.length < config.numberOfPoints) {
    const x = random(width);
    const y = random(height);
    const color = buffer.get(x, y);
    // if (
    //   random(1) < config.chanceForParticle &&
    //   brightness(color) > config.brightnessThreshold
    // ) {
    particles.push(new Particle(x, y));
    // }
  }
  coords = particles.map((p) => [p.pos.x, p.pos.y]).flat();
  delaunay = new Delaunator(coords);
  for (let i = 0; i < delaunay.triangles.length; i += 3) {
    const a = delaunay.triangles[i];
    const b = delaunay.triangles[i + 1];
    const c = delaunay.triangles[i + 2];

    const middle = createVector(
      (particles[a].pos.x + particles[b].pos.x + particles[c].pos.x) / 3,
      (particles[a].pos.y + particles[b].pos.y + particles[c].pos.y) / 3
    );
    const color = buffer.get(middle.x, middle.y);
    triangleColors.push(color);
  }
}

//=================Draw=============================

function draw() {
  if (config.record.shouldRecord && frameCount === 1) {
    const capture = P5Capture.getInstance();
    capture.start({
      duration: config.record.duration * config.fps,
    });
  }
  background(0);

  particles.forEach((p) => {
    p.update();
    //   // p.draw();
  });

  for (let i = 0; i < delaunay.triangles.length; i += 3) {
    const a = delaunay.triangles[i];
    const b = delaunay.triangles[i + 1];
    const c = delaunay.triangles[i + 2];

    //find the middle point of the triangle
    // const middle = createVector(
    //   (particles[a].pos.x + particles[b].pos.x + particles[c].pos.x) / 3,
    //   (particles[a].pos.y + particles[b].pos.y + particles[c].pos.y) / 3
    // );

    // //get the color of the image at the middle point
    // const color = buffer.get(middle.x, middle.y);
    const color = triangleColors[i / 3];
    fill(color);

    triangle(
      particles[a].pos.x,
      particles[a].pos.y,
      particles[b].pos.x,
      particles[b].pos.y,
      particles[c].pos.x,
      particles[c].pos.y
    );
  }

  // write fps
  // fill(255);
  // textSize(16);
  // text(frameRate(), 10, 20);
}

//=================Record=============================

let isLooping = true;
function mouseClicked() {
  isLooping = !isLooping;
  isLooping ? loop() : noLoop();
}

if (config.record.shouldRecord) {
  P5Capture.setDefaultOptions({
    format: "mp4",
    framerate: config.fps,
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
