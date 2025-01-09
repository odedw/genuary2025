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
  speed: {
    min: 2,
    max: 2,
  },
  delay: {
    min: 1,
    max: 120,
  },
  radius: {
    min: 10,
    max: 100,
  },
  record: {
    shouldRecord: false,
    duration: 9,
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

let center;
let upperSegments = [];
let lowerSegments = [];
let circleCenters = [];
let currentUpperXs = [];
let currentLowerXs = [];
//=================Setup=============================

function generateSegment(segmentRow, yOffset, arcStartAngle, arcEndAngle) {
  let newSegmentRow = [];
  let y = segmentRow[0].y + yOffset;
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
      newSegment = new CircleSegment(x, r, y, arcStartAngle, arcEndAngle);
      x = endX;
    }
    newSegmentRow.push(newSegment);
  }

  if (x < width) {
    newSegmentRow.push(new LineSegment(x, width, y));
  }
  return newSegmentRow;
}

function generateUpperSegment(segmentRow) {
  return generateSegment(segmentRow, -config.yDelta, PI, TAU);
}

function generateLowerSegment(segmentRow) {
  return generateSegment(segmentRow, config.yDelta, 0, PI);
}

function reset() {
  randomPalette();
  upperSegments = [];
  lowerSegments = [];
  circleCenters = [];
  currentUpperXs = [];
  currentLowerXs = [];

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

  currentUpperXs = upperSegments.map((segment) => ({
    current: 0,
    speed: int(random(config.speed.min, config.speed.max)),
    direction: random([-1, 1]),
    delay: int(random(config.delay.min, config.delay.max)),
    color: random(PALETTE),
  }));
  currentLowerXs = lowerSegments.map((segment) => ({
    current: 0,
    speed: int(random(config.speed.min, config.speed.max)),
    direction: random([-1, 1]),
    delay: int(random(config.delay.min, config.delay.max)),
    color: random(PALETTE),
  }));
}
function setup() {
  createCanvas(config.width, config.height);
  frameRate(config.fps);
  stroke(255);
  noFill();
  rectMode(CENTER);
  center = createVector(width / 2, height / 2);
  reset();
}

//=================Draw=============================

function drawSegmentRow(segments, currentX, color) {
  fill(color);
  if (startFrame < currentX.delay) {
    return;
  }

  for (let i = 0; i < currentX.speed; i++) {
    if (currentX.current >= width) {
      break;
    }

    let segmentIndex =
      segments.findIndex((segment) => segment.startX > currentX.current) - 1;
    if (segmentIndex === -2) {
      segmentIndex = segments.length - 1;
    }

    const segment = segments[segmentIndex];
    if (segment instanceof LineSegment) {
      square(currentX.current, segment.y, 2);
    } else if (segment instanceof CircleSegment) {
      const a = segment.startX + segment.r - currentX.current;
      const y = sqrt(segment.r * segment.r - a * a);
      const yOffset = segment.startAngle === PI ? -y : y;
      square(currentX.current, segment.y + yOffset, 2);
    }
    currentX.current++;
  }
}

let startFrame = 0;

function draw() {
  if (config.record.shouldRecord && frameCount === 1) {
    const capture = P5Capture.getInstance();
    capture.start({
      duration: config.record.duration * config.fps,
    });
  }
  // background(0);
  noStroke();
  for (let i = 0; i < currentUpperXs.length; i++) {
    drawSegmentRow(
      upperSegments[i],
      currentUpperXs[i],
      currentUpperXs[i].color
    );
  }

  for (let i = 0; i < lowerSegments.length; i++) {
    drawSegmentRow(
      lowerSegments[i],
      currentLowerXs[i],
      currentLowerXs[i].color
    );
  }

  if (startFrame === 520) {
    background(0);
    reset();
    startFrame = 0;
  } else {
    startFrame++;
  }
}

//=================Record=============================

let isLooping = true;
function mouseClicked() {
  isLooping = !isLooping;
  isLooping ? loop() : noLoop();
  console.log(frameCount);
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
