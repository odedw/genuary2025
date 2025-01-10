/// <reference types="p5/global" />

//=================Config=============================

const config = {
  width: 800,
  height: 800,
  fps: 30,
  numberOfArcs: 15,
  numberOfSwitches: 30,
  radius: 450,
  record: {
    shouldRecord: false,
    duration: 60,
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
//=================Classes=============================

//=================Variables=============================

let center;
let vid;
let myShader;
let coordsTexture;

//=================Setup=============================

function setup() {
  createCanvas(config.width, config.height, WEBGL);
  frameRate(config.fps);
  center = createVector(width / 2, height / 2);
  textureWrap(CLAMP);
  pixelDensity(1);

  // Create and initialize the shader
  myShader = createShader(vertShader, fragShader);

  // Create video element
  vid = createVideo("/public/videos/2103099-uhd_3840_2160_30fps.mp4");
  vid.size(width, height);
  vid.volume(0);
  vid.hide();
  vid.pause();

  coordsTexture = createGraphics(width, height, P2D);
  coordsTexture.pixelDensity(1);
  coordsTexture.loadPixels();

  // First set default mapping for all pixels
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let index = (x + y * width) * 4;
      coordsTexture.pixels[index] = (x / width) * 255; // R: x coordinate
      coordsTexture.pixels[index + 1] = (y / height) * 255; // G: y coordinate
      coordsTexture.pixels[index + 2] = 0; // B: unused
      coordsTexture.pixels[index + 3] = 255; // A: full opacity
    }
  }

  // Now perform the arc swaps
  for (let i = 0; i < config.numberOfSwitches; i++) {
    const arc1 = int(random(config.numberOfArcs));
    const arc2 = int(random(config.numberOfArcs));

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const distFromCenter = dist(x, y, width / 2, height / 2);
        if (distFromCenter > config.radius) continue;

        // Calculate angle (0 to TWO_PI)
        let angle = atan2(y - height / 2, x - width / 2);
        if (angle < 0) angle += TWO_PI;

        // Calculate arc boundaries
        const arcSize = TWO_PI / config.numberOfArcs;
        const arc1Start = arc1 * arcSize;
        const arc1End = (arc1 + 1) * arcSize;
        const arc2Start = arc2 * arcSize;
        const arc2End = (arc2 + 1) * arcSize;

        const pixelIndex = (x + y * width) * 4;

        if (angle >= arc1Start && angle < arc1End) {
          // Map from arc1 to arc2
          const relativeAngle = (angle - arc1Start) / arcSize;
          const newAngle = arc2Start + relativeAngle * arcSize;

          const newX = width / 2 + cos(newAngle) * distFromCenter;
          const newY = height / 2 + sin(newAngle) * distFromCenter;

          coordsTexture.pixels[pixelIndex] = (newX / width) * 255;
          coordsTexture.pixels[pixelIndex + 1] = (newY / height) * 255;
        } else if (angle >= arc2Start && angle < arc2End) {
          // Map from arc2 to arc1
          const relativeAngle = (angle - arc2Start) / arcSize;
          const newAngle = arc1Start + relativeAngle * arcSize;

          const newX = width / 2 + cos(newAngle) * distFromCenter;
          const newY = height / 2 + sin(newAngle) * distFromCenter;

          coordsTexture.pixels[pixelIndex] = (newX / width) * 255;
          coordsTexture.pixels[pixelIndex + 1] = (newY / height) * 255;
        }
      }
    }
  }

  coordsTexture.updatePixels(); // Important: update the pixels after all changes
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
  rect(0, 0, width, height);
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
