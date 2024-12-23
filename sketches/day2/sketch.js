/// <reference types="p5/global" />
const SHOULD_RECORD = false;

const config = {
  width: 700,
  height: 700,
  numberOfParticles: 50,
  radius: {
    min: 50,
    max: 200,
  },
  record: {
    shouldRecord: true,
    duration: 60 * 15,
  },
  lfoDuration: [1200],
  lfoValue: {
    min: -100,
    max: 100,
  },
};

// setPalette("Flat");
setPalette2("Brutalist");

const numberOfColors = PALETTE.length;

// After randomPalette() call, convert hex colors to RGB arrays
const rgbPalette = PALETTE.map((hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
});

// Add shader source code at the top
const vertexShader = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}`;

const fragmentShader = `
precision mediump float;
varying vec2 vTexCoord;

uniform vec2 u_resolution;
uniform vec2 u_positions[${config.numberOfParticles}];
uniform float u_radii[${config.numberOfParticles}];
uniform int u_particleCount;
uniform vec3 u_palette[${numberOfColors}];
uniform int u_paletteSize;

// Helper function to simulate modulo
int mod(int x, int y) {
  return x - (y * (x/y));
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  int count = 0;
  
  // Count how many squares contain this pixel
  for (int i = 0; i < ${config.numberOfParticles}; i++) {  
    if (i >= u_particleCount) break;
    
    vec2 particlePos = u_positions[i]/u_resolution.xy;
    float size = u_radii[i]/u_resolution.x;
    
    // Calculate distance for square
    vec2 d = abs(st - particlePos);
    
    // Check if point is inside square
    if (d.x < size && d.y < size) {
      count += 1;
    }
  }
  
  // Get color from palette based on count
  int colorIndex = mod(count, u_paletteSize);
  vec3 color = vec3(0.0);  // Default to black
  
  // WebGL1 requires constant array access, so we need a loop
  for(int i = 0; i < ${numberOfColors}; i++) {
    if(i == colorIndex) {
      color = u_palette[i];
    }
  }
  
  gl_FragColor = vec4(color, 1.0);
}`;

let particleShader;
let lfo1;
let particles = [];

class Particle {
  constructor(phase) {
    this.phase = phase;

    // Random fixed position across canvas
    this.pos = createVector(random(width), random(height));

    // Create LFO for size animation
    const duration = random(config.lfoDuration);
    this.lfo = createLfo({
      waveform: LfoWaveform.Sine,
      frequency: Timing.frames(duration + random(1000), {
        phase: phase * 10,
      }),
      min: config.radius.min * 0.2, // Shrink to 20% of min size
      max: config.radius.max * 1.5, // Grow to 150% of max size
    });
  }

  update() {
    // Update radius based on LFO
    this.r = this.lfo.value;
  }

  draw() {
    circle(this.pos.x, this.pos.y, this.r);
  }
}

function setup() {
  createCanvas(config.width, config.height, WEBGL);
  particleShader = createShader(vertexShader, fragmentShader);
  noStroke();

  // Create particles with random positions
  for (let i = 0; i < config.numberOfParticles; i++) {
    particles.push(new Particle(i)); // Angle parameter no longer needed
  }

  lfo1 = createLfo({
    waveform: LfoWaveform.Sine,
    frequency: Timing.frames(120),
    min: -PI,
    max: PI,
  });
}

function draw() {
  if (config.record.shouldRecord && frameCount === 1) {
    const capture = P5Capture.getInstance();
    capture.start({
      duration: config.record.duration,
    });
  }

  // Update all particles
  particles.forEach((p) => {
    p.update();
  });

  // Prepare particle data for shader
  const positions = [];
  const radii = [];
  particles.forEach((p) => {
    positions.push(p.pos.x, p.pos.y);
    radii.push(p.r);
  });

  // Render using shader
  shader(particleShader);

  // Set shader uniforms
  particleShader.setUniform("u_resolution", [width, height]);
  particleShader.setUniform("u_positions", positions);
  particleShader.setUniform("u_radii", radii);
  particleShader.setUniform("u_particleCount", particles.length);
  particleShader.setUniform("u_palette", rgbPalette.flat()); // Send flattened array of RGB values
  particleShader.setUniform("u_paletteSize", numberOfColors);

  // Draw a rectangle covering the entire canvas
  rect(-width / 2, -height / 2, width, height);
}

let isLooping = true;
function mouseClicked() {
  isLooping = !isLooping;
  isLooping ? loop() : noLoop();
}

if (config.record.shouldRecord) {
  P5Capture.setDefaultOptions({
    format: "mp4",
    framerate: 60,
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
