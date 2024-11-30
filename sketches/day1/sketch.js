/// <reference types="p5/global" />

// Configuration
const CONFIG = {
  resolution: 150,
  width: 700,
  height: 700,
  numFrames: 180,
  imagePath: "/public/images/day-1-sandwich-1.jpeg",
  spiralRotations: 4,
};

const squareSize = CONFIG.width / CONFIG.resolution;

// Cell class definition
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

// State variables
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
    dist(point.x, point.y, centerX, centerY) / (CONFIG.width / 2);
  return angle + distance * CONFIG.spiralRotations;
}

function sortCells() {
  const centerX = CONFIG.width / 2;
  const centerY = CONFIG.height / 2;

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
    if (x > CONFIG.width) {
      x = squareSize / 2;
      y += squareSize;
    }
  });
}

// p5.js functions
function preload() {
  sourceImage = loadImage(CONFIG.imagePath);
}

function setup() {
  createCanvas(CONFIG.width, CONFIG.height);
  rectMode(CENTER);
  noStroke();

  // Create buffer and process image
  const buffer = createGraphics(CONFIG.width, CONFIG.height);
  buffer.image(sourceImage, 0, 0, CONFIG.width, CONFIG.height);

  // Initialize animation timer
  t1 = Timing.frames(CONFIG.numFrames, {
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
