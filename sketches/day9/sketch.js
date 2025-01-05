/// <reference types="p5/global" />

//=================Config=============================

const config = {
  width: 700,
  height: 700,
  fps: 60,
  noiseAmount: 10000,
  noiseDelta: 10,
  stripeDelta: 50,
  palette: ["#0153C5", "#29C6CE", "#F5718A", "#EEC364", "#0893E3"],
  numberOfCells: 9,
  lineWidth: 1,
  cellResolution: 10,
  record: {
    shouldRecord: false,
    duration: 60,
  },
};

//=================Classes=============================
let patternTypes = [
  "solid-color-background",
  "solid-color",
  "outer-square",
  "inner-square",
];
class Cell {
  constructor(x, y, c, patternType) {
    this.x = x;
    this.y = y;

    this.patternType = patternType;
    this.c = c;

    this.finalBuffer = createGraphics(cellSize, cellSize);
    const buffer = bufferByColor[this.c];
    const backgroundBuffer = bufferByColor[config.palette[0]];

    if (this.patternType === "outer-square") {
      this.finalBuffer.image(buffer, 0, 0, cellSize, cellSize);
      this.finalBuffer.image(
        backgroundBuffer,
        0.25 * cellSize,
        0.25 * cellSize,
        cellSize * 0.5,
        cellSize * 0.5,
        backgroundBuffer.width * 0.25,
        backgroundBuffer.height * 0.25,
        backgroundBuffer.width * 0.5,
        backgroundBuffer.height * 0.5
      );
    } else if (this.patternType === "inner-square") {
      this.finalBuffer.image(backgroundBuffer, 0, 0, cellSize, cellSize);
      this.finalBuffer.image(
        buffer,
        0.25 * cellSize,
        0.25 * cellSize,
        cellSize * 0.5,
        cellSize * 0.5,
        buffer.width * 0.25,
        buffer.height * 0.25,
        buffer.width * 0.5,
        buffer.height * 0.5
      );
    } else {
      this.finalBuffer.image(buffer, 0, 0, cellSize, cellSize);
    }
    for (let i = 0; i < config.noiseAmount; i++) {
      let x = Math.floor(Math.random() * this.finalBuffer.width);
      let y = Math.floor(Math.random() * this.finalBuffer.height);

      // make it darker or lighter
      let c = this.finalBuffer.get(x, y);
      const delta = config.noiseDelta * (random() < 0.5 ? 1 : -1);
      let c2 = color(red(c) + delta, green(c) + delta, blue(c) + delta);
      this.finalBuffer.stroke(c2);
      this.finalBuffer.point(x, y);
    }
  }

  draw() {
    image(this.finalBuffer, this.x, this.y, cellSize, cellSize);
  }
}

//=================Variables=============================

let lfo1;
let center;
let cellSize;
let cells = [];
let bufferByColor = {};

//=================Setup=============================

function createSolidColorBuffer(c, isBackground) {
  const buffer = createGraphics(
    cellSize / config.cellResolution,
    cellSize / config.cellResolution
  );

  const c1 = c;
  // make it a bit lighter
  const c2 = color(
    red(c1) + config.stripeDelta,
    green(c1) + config.stripeDelta,
    blue(c1) + config.stripeDelta
  );
  buffer.strokeWeight(config.lineWidth);
  let currentColor = c1;

  const startX = isBackground ? 0 : -buffer.width * 2;
  const endX = isBackground ? buffer.width * 2 : buffer.width;
  const dx = isBackground ? -buffer.width : buffer.width;
  for (let x = startX; x < endX; x += config.lineWidth) {
    buffer.stroke(currentColor);

    // 45 degree angle line to the bottom left
    buffer.line(x, 0, x + dx, buffer.height);

    // alternate colors
    currentColor = currentColor === c1 ? c2 : c1;
  }

  bufferByColor[c] = buffer;
}

function setup() {
  createCanvas(config.width, config.height);
  frameRate(config.fps);
  rectMode(CENTER);
  noStroke();
  center = createVector(width / 2, height / 2);
  cellSize = width / config.numberOfCells;

  for (let i = 0; i < config.palette.length; i++) {
    createSolidColorBuffer(config.palette[i], i === 0);
    // break;
  }

  for (let j = 0; j < config.numberOfCells; j++) {
    let rowColor = config.palette[1 + (j % (config.palette.length - 1))];

    let rowPatterns = shuffle(["outer-square", "inner-square", "solid-color"]);
    // add solid-color-background between each pattern
    rowPatterns.splice(2, 0, "solid-color-background");
    rowPatterns.splice(1, 0, "solid-color-background");
    rowPatterns.splice(0, 0, "solid-color-background");

    // randomly move the last pattern to the front
    if (Math.random() > 0.5) {
      rowPatterns.unshift(rowPatterns.pop());
    }

    for (let i = 0; i < config.numberOfCells; i++) {
      let patternType = rowPatterns[i % rowPatterns.length];
      let c =
        patternType === "solid-color-background" ? config.palette[0] : rowColor;
      let cell = new Cell(
        i * cellSize, // + cellSize / 2,
        j * cellSize, // + cellSize / 2,
        c,
        patternType
      );
      cells.push(cell);
    }
  }
  // lfo1 = createLfo({
  //   waveform: LfoWaveform.Sine,
  //   frequency: Timing.frames(120),
  //   min: -PI,
  //   max: PI,
  // });
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
  for (let cell of cells) {
    cell.draw();
  }
  drawFramerate();
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
