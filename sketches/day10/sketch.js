/// <reference types="p5/global" />

//=================Config=============================

const config = {
  width: 700,
  height: 700,
  fps: 60,
  strokeWeight: 2,
  lineWidth: {
    min: 10,
    max: 100,
  },
  radius: {
    min: 5,
    max: 100,
  },
  record: {
    shouldRecord: false,
    duration: 60,
  },
};

//=================Classes=============================
class LineSegment {
  constructor(startX, endX, y) {
    this.startX = startX;
    this.endX = endX;
    this.y = y;
  }

  draw() {
    strokeWeight(config.strokeWeight);
    stroke(255);
    line(this.startX, this.y, this.endX, this.y);
  }
}

class CircleSegment {
  constructor(startX, r, y, startAngle, endAngle) {
    this.startX = startX;
    this.y = y;
    this.r = r;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
  }

  draw() {
    strokeWeight(config.strokeWeight);
    stroke(255);
    arc(
      this.startX + this.r,
      this.y,
      this.r * 2,
      this.r * 2,
      this.startAngle,
      this.endAngle
    );
  }
}

//=================Variables=============================

let lfo1;
let center;
let segments = [];
let circleCenters = [];
//=================Setup=============================

function setup() {
  createCanvas(config.width, config.height);
  frameRate(config.fps);
  stroke(255);
  noFill();
  rectMode(CENTER);
  center = createVector(width / 2, height / 2);

  lfo1 = createLfo({
    waveform: LfoWaveform.Sine,
    frequency: Timing.frames(120),
    min: -PI,
    max: PI,
  });

  let x = 0;
  let segmentKind = 0;
  let upperY = height * 0.495;
  let lowerY = height * 0.505;
  while (x < width) {
    segmentKind = segmentKind == 1 ? 0 : 1;
    if (segmentKind === 0) {
      const w = random(config.lineWidth.min, config.lineWidth.max);
      segments.push(new LineSegment(x, x + w, upperY));
      segments.push(new LineSegment(x, x + w, lowerY));
      let y = upperY;
      while (y > 0) {
        segments.push(new LineSegment(x, x + w, y));
        y -= 0.01 * height;
      }
      y = lowerY;
      while (y < height) {
        segments.push(new LineSegment(x, x + w, y));
        y += 0.01 * height;
      }
      x += w;
    } else {
      const r = random(config.radius.min, config.radius.max);
      if (x + r * 2 > width) {
        continue;
      }
      circleCenters.push({
        x: x + r,
        y: center.y,
        r,
      });
      segments.push(new CircleSegment(x, r, upperY, PI, TAU));
      segments.push(new CircleSegment(x, r, lowerY, 0, PI));
      let y = upperY;
      while (y > 0) {
        segments.push(new CircleSegment(x, r, y, PI, TAU));
        y -= 0.01 * height;
      }
      y = lowerY;
      while (y < height) {
        segments.push(new CircleSegment(x, r, y, 0, PI));
        y += 0.01 * height;
      }
      x += r * 2;
    }
  }
  // segments.push(new CircleSegment(200, ))
  //   background(0);
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
  segments.forEach((segment) => segment.draw());
  circleCenters.forEach((center) => {
    strokeWeight(config.strokeWeight);
    stroke(255);
    let r = center.r;
    while (r > 0) {
      circle(center.x, center.y, r * 2);
      r -= 0.01 * height;
    }
  });
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
