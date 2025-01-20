/// <reference types="p5/global" />

//=================Config=============================

const config = {
  width: 700,
  height: 700,
  fps: 60,
  record: {
    shouldRecord: false,
    duration: 10,
  },
};

//=================Variables=============================

let lfo1;
let center;
let buffer1, buffer2, mask;

let cellSize = config.width / 23;
let delta = cellSize * 2;
let rectSize = cellSize * 12;

//=================Setup=============================
function drawRects(x, y, c, d, s, b) {
  let currentSize = s;
  let rectColor = c;
  b.noStroke();
  for (let i = 0; i < 6; i++) {
    b.fill(rectColor);
    b.rect(x, y, currentSize, currentSize);
    rectColor = rectColor === 0 ? 255 : 0;
    currentSize -= d;
    // break;
  }
}

function setup() {
  createCanvas(config.width, config.height);
  frameRate(config.fps);
  stroke(255);
  rectMode(CENTER);
  center = createVector(width / 2, height / 2);
  buffer1 = createGraphics(width, height);
  buffer2 = createGraphics(width, height);
  mask = createGraphics(width, height);

  lfo1 = createLfo({
    waveform: LfoWaveform.Sawtooth,
    frequency: Timing.frames(10 * config.fps),
    min: -PI,
    max: PI,
  });
  //   background(0);

  const corners = [
    { x: rectSize / 2, y: rectSize / 2 }, // top-left
    { x: width - rectSize / 2, y: rectSize / 2 }, // top-right
    { x: rectSize / 2, y: height - rectSize / 2 }, // bottom-left
    { x: width - rectSize / 2, y: height - rectSize / 2 }, // bottom-right
  ];

  function drawToBuffer(buffer, color) {
    buffer.rectMode(CENTER);
    corners.forEach((rect) => {
      drawRects(rect.x, rect.y, color, delta, rectSize, buffer);
    });
  }

  // Draw to both buffers
  drawToBuffer(buffer1, 0);
  drawToBuffer(buffer2, 255);
}

//=================Draw=============================

function draw() {
  if (config.record.shouldRecord && frameCount === 1) {
    const capture = P5Capture.getInstance();
    capture.start({
      duration: config.record.duration * config.fps,
    });
  }
  background(100);
  image(buffer1, 0, 0, width, height);
  let mask = createGraphics(width, height);
  mask.rectMode(CENTER);
  mask.noStroke();
  mask.background(0, 0, 0, 0);
  mask.fill(255);
  mask.push();
  mask.translate(center.x, center.y);
  mask.rotate(lfo1.value);
  mask.rect(0, 0, rectSize, rectSize);
  mask.pop();
  let masked = buffer2.get();
  masked.mask(mask);
  image(masked, 0, 0, width, height);
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
