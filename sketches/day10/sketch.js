/// <reference types="p5/global" />

//=================Config=============================

const config = {
  width: 700,
  height: 700,
  fps: 60,
  strokeWeight: 2,
  yDelta: 10,
  xDelta: 1,
  lineWidth: {
    min: 100,
    max: 100,
  },
  radius: {
    min: 10,
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
let upperSegments = [];
let lowerSegments = [];
let circleCenters = [];
//=================Setup=============================

function generateUpperSegment(segmentRow) {
  let newSegmentRow = [];
  let y = segmentRow[0].y - config.yDelta;
  let x = 0;
  for (let i = 0; i < segmentRow.length; i++) {
    const segment = segmentRow[i];
    let newSegment;
    if (segment instanceof LineSegment) {
      let endX = segment.endX - config.xDelta * 2;
      newSegment = new LineSegment(x, endX, y);
      x = endX;
    } else if (segment instanceof CircleSegment) {
      let r = segment.r + config.xDelta * 2;
      let endX = x + r * 2;
      newSegment = new CircleSegment(x, r, y, PI, TAU);
      x = endX;
    }
    newSegmentRow.push(newSegment);
  }
  if (x < width) {
    newSegmentRow.push(new LineSegment(x, width, y));
  }
  return newSegmentRow;
}

function generateLowerSegment(segmentRow) {
  let newSegmentRow = [];
  let y = segmentRow[0].y + config.yDelta;
  let x = 0;
  for (let i = 0; i < segmentRow.length; i++) {
    const segment = segmentRow[i];
    let newSegment;
    if (segment instanceof LineSegment) {
      let endX = segment.endX - config.xDelta * 2;
      newSegment = new LineSegment(x, endX, y);
      x = endX;
    } else if (segment instanceof CircleSegment) {
      let r = segment.r + config.xDelta * 2;
      let endX = x + r * 2;
      newSegment = new CircleSegment(x, r, y, 0, PI);
      x = endX;
    }
    newSegmentRow.push(newSegment);
  }
  if (x < width) {
    newSegmentRow.push(new LineSegment(x, width, y));
  }
  return newSegmentRow;
}

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
  const upperSegmentRow = [];
  const lowerSegmentRow = [];
  while (x < width) {
    segmentKind = x == 0 || segmentKind == 1 ? 0 : 1;
    if (segmentKind === 0) {
      const w = random(config.lineWidth.min, config.lineWidth.max);
      upperSegmentRow.push(new LineSegment(x, x + w, upperY));
      lowerSegmentRow.push(new LineSegment(x, x + w, lowerY));

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
      upperSegmentRow.push(new CircleSegment(x, r, upperY, PI, TAU));
      lowerSegmentRow.push(new CircleSegment(x, r, lowerY, 0, PI));
      x += r * 2;
    }
  }
  upperSegments.push(upperSegmentRow);
  lowerSegments.push(lowerSegmentRow);
  let y = upperSegmentRow[0].y;
  let lastSegmentRow = upperSegmentRow;
  while (y > 0) {
    const newSegmentRow = generateUpperSegment(lastSegmentRow);
    upperSegments.push(newSegmentRow);
    lastSegmentRow = newSegmentRow;
    y = newSegmentRow[0].y;
  }
  lastSegmentRow = lowerSegmentRow;
  while (y < height) {
    const newSegmentRow = generateLowerSegment(lastSegmentRow);
    lowerSegments.push(newSegmentRow);
    lastSegmentRow = newSegmentRow;
    y = newSegmentRow[0].y;
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
  upperSegments.forEach((segmentRow) => {
    segmentRow.forEach((segment) => segment.draw());
  });
  lowerSegments.forEach((segmentRow) => {
    segmentRow.forEach((segment) => segment.draw());
  });
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
