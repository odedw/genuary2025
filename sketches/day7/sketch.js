/// <reference types="p5/global" />

//=================Config=============================

const config = {
  width: 700,
  height: 700,
  fps: 20,
  size: 30,
  record: {
    shouldRecord: false,
    duration: 5,
  },
};

//=================Classes=============================

//=================Variables=============================

let lfo1;
let center;
let buffer;
let cellSize;
let angle = 0;
let increment;
//=================Setup=============================

function setup() {
  createCanvas(config.width, config.height);
  frameRate(config.fps);
  stroke(255);
  noFill();
  rectMode(CENTER);
  center = createVector(width / 2, height / 2);

  // lfo1 = createLfo({
  //   waveform: LfoWaveform.Sawtooth,
  //   frequency: Timing.frames(config.fps),
  //   min: 0,
  //   max: PI / 4,
  // });

  cellSize = config.width / config.size;

  buffer = createGraphics(config.size, config.size);
  buffer.rectMode(CENTER);
  buffer.stroke(255);
  buffer.noFill();
  buffer.strokeWeight(1);

  increment = PI / 2 / (config.fps * 1);
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
  console.log("frameCount", frameCount);
  if (angle >= PI / 2) {
    noLoop();
    console.log("stop");
  }
  buffer.background(0);
  buffer.push();
  buffer.translate(buffer.width / 2, buffer.height / 2);
  buffer.rotate(angle);
  buffer.rect(0, 0, buffer.width * 0.5, buffer.height * 0.5);
  buffer.pop();

  let notes = [
    "C4",
    "B3",
    "A#3",
    "A3",
    "G#3",
    "G3",
    "F#3",
    "F3",
    "E3",
    "D#3",
    "D3",
    "C#3",
    "C3",
    "B2",
    "A#2",
    "A2",
    "G#2",
    "G2",
    "F#2",
    "F2",
    "E2",
    "D#2",
    "D2",
    "C#2",
    "C2",
    "B1",
    "A#1",
    "A1",
    "G#1",
    "G1",
  ];
  let columns = [
    "1",
    "",
    "",
    "",
    "1.2",
    "",
    "",
    "",
    "1.3",
    "",
    "",
    "",
    "1.4",
    "",
    "",
    "",
    "2",
    "",
    "",
    "",
    "2.2",
    "",
    "",
    "",
    "2.3",
    "",
    "",
    "",
    "2.4",
    "",
    "",
    "",
  ];
  let fills = [
    0, 0, 0, 0, 100, 100, 100, 100, 0, 0, 0, 0, 100, 100, 100, 100, 0, 0, 0, 0,
    100, 100, 100, 100, 0, 0, 0, 0, 100, 100, 100, 100, 0, 0, 0, 0, 100, 100,
    100, 100, 0, 0, 0, 0, 10, 100, 100, 100,
  ];
  background(0);
  for (let i = 0; i < config.size; i++) {
    for (let j = 0; j < config.size; j++) {
      const c = buffer.get(i, j);
      if (brightness(c) > 50) {
        fill(255);
        // console.log(i, j);
      } else {
        fill(fills[i]);
      }
      rect(
        i * cellSize + cellSize / 2,
        j * cellSize + cellSize / 2,
        cellSize,
        cellSize
      );
      if (i === 0) {
        fill(255);
        text(notes[j], cellSize / 2 - 10, j * cellSize + cellSize / 2 + 5);
      }
      if (j === 0) {
        fill(255);
        text(columns[i], i * cellSize + cellSize / 2 - 5, cellSize / 2 + 10);
        // console.log(columns[i]);
      }
    }
  }

  angle += increment;
  noLoop();

  // image(buffer, 0, 0, width, height);
}

//=================Record=============================

let isLooping = true;
function mouseClicked() {
  loop();
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
