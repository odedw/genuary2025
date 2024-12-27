/// <reference types="p5/global" />

//=================Config=============================

const config = {
  width: 700,
  height: 700,
  fps: 60,
  record: {
    shouldRecord: false,
    duration: 60,
  },
};

//=================Classes=============================

//=================Variables=============================

let lfo1;
let center;

//=================Setup=============================

function setup() {
  createCanvas(config.width, config.height);
  frameRate(config.fps);
  stroke(255);
  rectMode(CENTER);
  center = createVector(width / 2, height / 2);

  lfo1 = createLfo({
    waveform: LfoWaveform.Sine,
    frequency: Timing.frames(120),
    min: -PI,
    max: PI,
  });
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
  translate(width / 2, height / 2);
  rotate(lfo1.value);
  rect(0, 0, 100, 100);
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
