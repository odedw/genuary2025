/// <reference types="p5/global" />

// constants
const resolution = 150;
const WIDTH = 700;
const HEIGHT = 700;
const squareSize = WIDTH / resolution;
const NUM_FRAMES = 180;
let direction = 1;

class Cell {
  constructor(x, y, color) {
    this.dest = createVector(x, y);
    this.start = createVector(x, y);
    this.color = color;
  }

  draw() {
    fill(this.color);
    const pos = direction === 1 ? this.start.copy() : this.dest.copy();
    pos.lerp(direction === 1 ? this.dest : this.start, t1.elapsed);
    rect(pos.x, pos.y, squareSize, squareSize);
  }
  update() {}
}
// locals
let cells = [];
let img1;
let t1;
function preload() {
  img1 = loadImage("/public/images/day-1-sandwich-1.jpeg");
}

function sortCells() {
  const centerX = WIDTH / 2;
  const centerY = HEIGHT / 2;

  cells.sort((a, b) => {
    const angleA =
      (Math.atan2(a.dest.y - centerY, a.dest.x - centerX) + Math.PI) /
      (2 * Math.PI);
    const angleB =
      (Math.atan2(b.dest.y - centerY, b.dest.x - centerX) + Math.PI) /
      (2 * Math.PI);

    const distA = dist(a.dest.x, a.dest.y, centerX, centerY) / (WIDTH / 2);
    const distB = dist(b.dest.x, b.dest.y, centerX, centerY) / (WIDTH / 2);

    const spiralA = angleA + distA * 4; // More rotations
    const spiralB = angleB + distB * 4;

    return spiralA - spiralB;
  });
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  stroke(255);
  rectMode(CENTER);
  noStroke();
  const pg = createGraphics(WIDTH, HEIGHT);
  pg.image(img1, 0, 0, WIDTH, HEIGHT);
  t1 = Timing.frames(NUM_FRAMES, {
    loop: false,
    autoTrigger: true,
    easing: Easing.EaseInOutCubic,
  });
  for (let x = squareSize / 2; x < pg.width; x += squareSize) {
    for (let y = squareSize / 2; y < pg.height; y += squareSize) {
      cells.push(new Cell(x, y, pg.get(x, y)));
    }
  }
  // sort cells by color
  sortCells();
  let x = squareSize / 2;
  let y = squareSize / 2;
  for (let i = 0; i < cells.length; i++) {
    cells[i].start.set(x, y);
    x += squareSize;
    if (x > pg.width) {
      x = squareSize / 2;
      y += squareSize;
    }
  }
  // pixelDensity(1);
  //   background(0);
}

function draw() {
  background(0);

  for (let cell of cells) {
    cell.draw();
  }

  if (t1.finished) {
    direction *= -1;
    t1.reset();
  }
}

let isLooping = true;
function mouseClicked() {
  if (isLooping) {
    noLoop();
  } else {
    loop();
  }

  isLooping = !isLooping;
}
