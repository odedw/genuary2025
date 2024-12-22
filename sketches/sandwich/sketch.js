/// <reference types="p5/global" />
const SHOULD_RECORD = true;
// configuration
const config = {
  resolution: 150,
  width: 700,
  height: 700,
  numFrames: 180,
  imagePath: "/public/images/day-1-sandwich-1.jpeg",
  spiralRotations: 4,
};

const squareSize = config.width / config.resolution;

class Cell {
  constructor(x, y, color) {
    this.dest = createVector(x, y);
    this.start = createVector(x, y);
    this.color = color;
  }

  draw() {
    fill(this.color);
    const source = direction === 1 ? this.start : this.dest;
    const target = direction === 1 ? this.dest : this.start;
    const pos = source.copy().lerp(target, t1.elapsed);
    rect(pos.x, pos.y, squareSize, squareSize);
  }
}

let cells = [];
let sourceImage;
let t1;
let direction = 1;
let isLooping = true;

function calculateSpiralValue(point, centerX, centerY) {
  const angle =
    (Math.atan2(point.y - centerY, point.x - centerX) + Math.PI) /
    (2 * Math.PI);
  const distance =
    dist(point.x, point.y, centerX, centerY) / (config.width / 2);
  return angle + distance * config.spiralRotations;
}

function sortCells() {
  const centerX = config.width / 2;
  const centerY = config.height / 2;

  cells.sort((a, b) => {
    const spiralA = calculateSpiralValue(a.dest, centerX, centerY);
    const spiralB = calculateSpiralValue(b.dest, centerX, centerY);
    return spiralA - spiralB;
  });
}

function initializeCellGrid(buffer) {
  for (let x = squareSize / 2; x < buffer.width; x += squareSize) {
    for (let y = squareSize / 2; y < buffer.height; y += squareSize) {
      cells.push(new Cell(x, y, buffer.get(x, y)));
    }
  }
}

function setInitialPositions() {
  let x = squareSize / 2;
  let y = squareSize / 2;

  cells.forEach((cell) => {
    cell.start.set(x, y);
    x += squareSize;
    if (x > config.width) {
      x = squareSize / 2;
      y += squareSize;
    }
  });
}

// p5.js functions
function preload() {
  sourceImage = loadImage(config.imagePath);
}

function setup() {
  createCanvas(config.width, config.height);
  rectMode(CENTER);
  noStroke();

  // Create buffer and process image
  const buffer = createGraphics(config.width, config.height);
  buffer.image(sourceImage, 0, 0, config.width, config.height);

  // Initialize animation timer
  t1 = Timing.frames(config.numFrames, {
    loop: false,
    autoTrigger: true,
    easing: Easing.EaseInOutCubic,
  });

  // Setup cells
  initializeCellGrid(buffer);
  sortCells();
  setInitialPositions();
}

function draw() {
  if (SHOULD_RECORD && frameCount === 1) {
    const capture = P5Capture.getInstance();
    capture.start({
      duration: config.numFrames * 2,
    });
  }
  background(0);
  cells.forEach((cell) => cell.draw());

  if (t1.finished) {
    direction *= -1;
    t1.reset();
  }
}

function mouseClicked() {
  isLooping = !isLooping;
  isLooping ? loop() : noLoop();
}

if (SHOULD_RECORD) {
  P5Capture.setDefaultOptions({
    format: "mp4",
    framerate: 60,
    quality: 1,
    bitrate: 100000,
    width: config.width,
    height: config.height,
  });
} else {
  P5Capture.setDefaultOptions({
    disableUi: true,
  });
}
