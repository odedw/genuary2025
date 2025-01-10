/// <reference types="p5/global" />

//=================Config=============================

const config = {
  width: 800,
  height: 800,
  fps: 30,
  numberOfArcs: 14,
  numberOfSwitches: 30,
  radius: 550,
  record: {
    shouldRecord: false,
    duration: 30,
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

  // Create and shuffle the array of arc indices ensuring no element stays in place
  let arcIndices;
  do {
    arcIndices = Array.from({ length: config.numberOfArcs }, (_, i) => i);
    for (let i = arcIndices.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [arcIndices[i], arcIndices[j]] = [arcIndices[j], arcIndices[i]];
    }
  } while (arcIndices.some((val, idx) => val === idx));

  // Create a mapping array for quick lookups
  const reverseMapping = new Array(config.numberOfArcs);
  for (let i = 0; i < config.numberOfArcs; i++) {
    reverseMapping[arcIndices[i]] = i;
  }

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const distFromCenter = dist(x, y, width / 2, height / 2);
      if (distFromCenter > config.radius) continue;

      // Calculate angle (0 to TWO_PI)
      let angle = atan2(y - height / 2, x - width / 2);
      if (angle < 0) angle += TWO_PI;

      // Calculate which arc this pixel belongs to
      const arcSize = TWO_PI / config.numberOfArcs;
      const currentArc = floor(angle / arcSize);

      // Get the target arc from our mapping
      const targetArc = arcIndices[currentArc];

      const pixelIndex = (x + y * width) * 4;

      // Calculate relative position within the arc
      const relativeAngle = (angle - currentArc * arcSize) / arcSize;
      const newAngle = targetArc * arcSize + relativeAngle * arcSize;

      const newX = width / 2 + cos(newAngle) * distFromCenter;
      const newY = height / 2 + sin(newAngle) * distFromCenter;

      coordsTexture.pixels[pixelIndex] = (newX / width) * 255;
      coordsTexture.pixels[pixelIndex + 1] = (newY / height) * 255;
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
