/// <reference types="p5/global" />

//=================Config=============================

const config = {
  width: 700,
  height: 700,
  fps: 60,
  lineLength: 30,
  lineLengthLfoFrequency: 10000,
  record: {
    shouldRecord: false,
    duration: 20,
  },
};

//=================Shaders=============================

const vertShader = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}`;

const fragShader = `
precision mediump float;

varying vec2 vTexCoord;
uniform sampler2D videoTex;
uniform sampler2D coordsTex;
uniform vec2 resolution;

void main() {
  // Get the displaced coordinates from our coords texture
  vec4 coords = texture2D(coordsTex, vTexCoord);
  
  // The coordinates are stored as normalized values
  vec2 displaceCoord = coords.rg;
  
  // Flip the y coordinate for video texture
  displaceCoord.y = 1.0 - displaceCoord.y;
  
  vec4 color = texture2D(videoTex, displaceCoord);
  gl_FragColor = color;
}
`;

//=================Variables=============================

let vid;
let myShader;
let coordsTexture;
let lengthLfo;

//=================Setup=============================

function setup() {
  createCanvas(config.width, config.height, WEBGL);
  frameRate(config.fps);
  noStroke();
  textureWrap(CLAMP);
  pixelDensity(1);

  // Create and initialize the shader
  myShader = createShader(vertShader, fragShader);

  // Create video element
  vid = createVideo("/public/videos/1230.mp4");
  vid.size(width, height);
  vid.volume(0);
  vid.hide();
  vid.pause();

  // Create coordinates texture data
  coordsTexture = createGraphics(width, height, P2D);
  coordsTexture.pixelDensity(1);
  coordsTexture.loadPixels();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let index = (x + y * width) * 4;

      // Default mapping
      coordsTexture.pixels[index] = (x / width) * 255; // R: x coordinate
      coordsTexture.pixels[index + 1] = (y / height) * 255; // G: y coordinate
      coordsTexture.pixels[index + 2] = 0; // B: unused
      coordsTexture.pixels[index + 3] = 255; // A: full opacity
    }
  }

  lengthLfo = createLfo({
    waveform: LfoWaveform.Sine,
    frequency: Timing.manual(config.lineLengthLfoFrequency),
    min: 1,
    max: config.lineLength,
  });

  // Apply the line effect
  for (let n = 0; n < 1000000; n++) {
    let x = int(random(width));
    let y = int(random(height));

    const lineLength = lengthLfo.value;
    lengthLfo.step();
    for (let k = 0; k < lineLength; k++) {
      // Down-left diagonal only
      let newX = x - k;
      let newY = y + k;

      // Store normalized coordinates of the source point
      let normalizedX = (x / width) * 255;
      let normalizedY = (y / height) * 255;

      // Add thickness by extending vertically
      for (let thickness = 0; thickness <= int(random(0, 10)); thickness++) {
        if (newX >= 0 && newY + thickness < height && newY + thickness >= 0) {
          let targetIndex = (newX + (newY + thickness) * width) * 4;
          coordsTexture.pixels[targetIndex] = normalizedX;
          coordsTexture.pixels[targetIndex + 1] = normalizedY;
          coordsTexture.pixels[targetIndex + 2] = 0;
          coordsTexture.pixels[targetIndex + 3] = 255;
        }
      }
    }
  }

  coordsTexture.updatePixels();
}

//=================Draw=============================

function draw() {
  if (config.record.shouldRecord && frameCount === 1) {
    const capture = P5Capture.getInstance();
    capture.start({
      duration: config.record.duration * config.fps,
    });
  }

  // Update video time
  vid.time(frameCount / config.fps);

  // Use the shader
  shader(myShader);

  // Set uniforms
  myShader.setUniform("videoTex", vid);
  myShader.setUniform("coordsTex", coordsTexture);
  myShader.setUniform("resolution", [width, height]);

  // Draw a rectangle that fills the screen
  rect(-width / 2, -height / 2, width, height);
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
