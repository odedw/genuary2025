/// <reference types="p5/global" />

//=================Config=============================

const config = {
  width: 700,
  height: 700,
  fps: 60,
  timerSeconds: 5,
  numberOfRays: 5000, // One ray per degree
  rayLength: 2000, // Length of rays
  rectWidth: 200,
  rectHeight: 30,
  rectGap: 50,
  record: {
    shouldRecord: false,
    duration: 60,
  },
};

//=================Classes=============================

class Ray {
  constructor(pos, angle) {
    this.pos = pos;
    this.dir = p5.Vector.fromAngle(angle);
  }

  cast(wall) {
    // Line-line intersection algorithm
    const x1 = wall.a.x;
    const y1 = wall.a.y;
    const x2 = wall.b.x;
    const y2 = wall.b.y;

    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + this.dir.x;
    const y4 = this.pos.y + this.dir.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den === 0) return null;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t > 0 && t < 1 && u > 0) {
      const pt = createVector();
      pt.x = x1 + t * (x2 - x1);
      pt.y = y1 + t * (y2 - y1);
      return pt;
    }
    return null;
  }
}

class Boundary {
  constructor(x1, y1, x2, y2) {
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2);
  }

  draw() {
    stroke(255);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.boundaries = this.createBoundaries();
  }

  createBoundaries() {
    return [
      new Boundary(this.x, this.y, this.x + this.w, this.y), // Top
      new Boundary(this.x + this.w, this.y, this.x + this.w, this.y + this.h), // Right
      new Boundary(this.x + this.w, this.y + this.h, this.x, this.y + this.h), // Bottom
      new Boundary(this.x, this.y + this.h, this.x, this.y), // Left
    ];
  }

  draw() {
    // stroke(255);
    noStroke();
    noFill();
    rect(this.x, this.y, this.w, this.h);
  }
}

//=================Variables=============================

let lightSource;
let rays = [];
let rectangles = [];
let center;
let lightSourceVelocity;
let timer;
//=================Setup=============================

function setup() {
  createCanvas(config.width, config.height);
  frameRate(config.fps);

  center = createVector(width / 2, height / 2);
  // Create light source at center
  lightSource = createVector(1, 1);
  lightSourceVelocity = createVector(1, 0);
  timer = Timing.seconds(config.timerSeconds, {
    loop: false,
    easing: Easing.EaseInOutQuad,
  });

  // Create rays
  for (let a = 0; a < 360; a += 360 / config.numberOfRays) {
    rays.push(new Ray(lightSource, radians(a)));
  }
  rectangles.push(
    new Rectangle(
      center.x - config.rectWidth / 2,
      center.y - config.rectWidth / 2 - config.rectGap - config.rectHeight,
      config.rectWidth,
      config.rectHeight
    )
  );

  rectangles.push(
    new Rectangle(
      center.x - config.rectWidth / 2,
      center.y + config.rectWidth / 2 + config.rectGap,
      config.rectWidth,
      config.rectHeight
    )
  );

  rectangles.push(
    new Rectangle(
      center.x - config.rectWidth / 2 - config.rectGap - config.rectHeight,
      center.y - config.rectWidth / 2,
      config.rectHeight,
      config.rectWidth
    )
  );

  rectangles.push(
    new Rectangle(
      center.x + config.rectWidth / 2 + config.rectGap,
      center.y - config.rectWidth / 2,
      config.rectHeight,
      config.rectWidth
    )
  );

  // create rectangles at the corners of the canvas
  rectangles.push(new Rectangle(0, 0, 1, height));
  rectangles.push(new Rectangle(width, 0, 1, height));
  rectangles.push(new Rectangle(0, 0, width, 1));
  rectangles.push(new Rectangle(0, height, width, 1));
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

  if (lightSourceVelocity.x > 0) {
    lightSource.x = constrain(timer.elapsed * width, 1, width);
    if (lightSource.x >= width) {
      lightSource = createVector(width, 1);
      lightSourceVelocity = createVector(0, 1);
      timer.reset();
    }
  } else if (lightSourceVelocity.y > 0) {
    lightSource.y = constrain(timer.elapsed * height, 1, height);
    if (lightSource.y >= height) {
      lightSource = createVector(width, height);
      lightSourceVelocity = createVector(-1, 0);
      timer.reset();
    }
  } else if (lightSourceVelocity.x < 0) {
    lightSource.x = constrain(width - timer.elapsed * width, 1, width);
    if (lightSource.x <= 1) {
      lightSource = createVector(1, height);
      lightSourceVelocity = createVector(0, -1);
      timer.reset();
    }
  } else if (lightSourceVelocity.y < 0) {
    lightSource.y = constrain(height - timer.elapsed * height, 1, height);
    if (lightSource.y <= 1) {
      lightSource = createVector(1, 1);
      lightSourceVelocity = createVector(1, 0);
      timer.reset();
    }
  }

  // Update ray positions
  rays.forEach((ray) => {
    ray.pos = lightSource.copy();
  });

  // Draw rays and check intersections
  rays.forEach((ray) => {
    let closest = null;
    let record = Infinity;

    // Check all rectangle boundaries
    rectangles.forEach((rectangle) => {
      rectangle.boundaries.forEach((boundary) => {
        const pt = ray.cast(boundary);
        if (pt) {
          const d = p5.Vector.dist(lightSource, pt);
          if (d < record) {
            record = d;
            closest = pt;
          }
        }
      });
    });

    if (closest) {
      // Draw ray to intersection point
      stroke(255, 100);
      line(ray.pos.x, ray.pos.y, closest.x, closest.y);
      // ellipse(closest.x, closest.y, 10, 10);
    }
  });

  // Draw rectangles
  rectangles.forEach((rectangle) => rectangle.draw());

  // Draw light source
  // fill(255, 255, 0);
  // noStroke();
  // ellipse(lightSource.x, lightSource.y, 10, 10);
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
