/// <reference types="p5/global" />

//=================Config=============================

const config = {
  width: 700,
  height: 700,
  fps: 60,
  delta: 15,
  lineLength: 10,
  record: {
    shouldRecord: false,
    duration: 20,
  },
};

//=================Classes=============================

//=================Variables=============================

let lfo1;
let center;
let img;
let vid;
let buffer;
let coords = [];
let colorCoordsMatrix;
//=================Setup=============================
function preload() {
  // img = loadImage("/public/images/20201218_090150.png");
}

function setup() {
  createCanvas(config.width, config.height);
  frameRate(config.fps);
  noFill();
  rectMode(CENTER);
  strokeWeight(2);
  center = createVector(width / 2, height / 2);

  colorCoordsMatrix = new Matrix(width, height, 0);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      colorCoordsMatrix.set(i, j, { x: i, y: j });
    }
  }

  for (let i = 0; i < 1000000; i++) {
    //   // random coordinates
    let col = int(random(0, width));
    let row = int(random(0, height));

    //   // get the color
    let colorCoord = colorCoordsMatrix.get(col, row);

    //   // draw the line
    for (let i = 0; i < config.lineLength; i++) {
      let x = colorCoord.x + i;
      let y = colorCoord.y + i;
      if (x < width && y < height && x >= 0 && y >= 0) {
        colorCoordsMatrix.set(x, y, colorCoord);
      }
    }
  }

  buffer = createGraphics(width, height);
  // buffer.image(img, 0, 0, width, height);
  vid = createVideo("/public/videos/1230.mp4");
  vid.size(width, height);
  vid.volume(0);
  // vid.play();
  vid.hide();
  vid.pause();
}

//=================Draw=============================

function draw() {
  // console.log(frameCount);

  // if (frameCount % 5 === 0) {
  //   return;
  // }
  if (config.record.shouldRecord && frameCount === 1) {
    const capture = P5Capture.getInstance();
    capture.start({
      duration: config.record.duration * config.fps,
    });
  }
  background(0, 0, 0, 150);

  // Add this line to advance one frame

  vid.time(frameCount / config.fps);

  // console.log(frameCount, frameCount / config.fps, vid.time());

  // let img = vid.get();
  // buffer.image(img, 0, 0, width, height);

  vid.loadPixels();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let cCoords = colorCoordsMatrix.get(x, y);
      const pixelIndex = cCoords.x * 4 + cCoords.y * width * 4;
      const r = vid.pixels[pixelIndex];
      const g = vid.pixels[pixelIndex + 1];
      const b = vid.pixels[pixelIndex + 2];
      stroke(r, g, b);
      point(x, y);
    }
  }
  // image(buffer, 0, 0, width, height);
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
