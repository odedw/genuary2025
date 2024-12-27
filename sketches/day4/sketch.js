/// <reference types="p5/global" />

//=================Config=============================

const config = {
  width: 700,
  height: 700,
  fps: 60,
  timerSeconds: 3,
  numberOfRays: 5000,
  rayLength: 2000,
  rectWidth: 200,
  rectHeight: 30,
  rectGap: 70,
  centerCircleRadius: 200,
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
    const x1 = wall.a.x,
      y1 = wall.a.y,
      x2 = wall.b.x,
      y2 = wall.b.y;
    const x3 = this.pos.x,
      y3 = this.pos.y;
    const x4 = this.pos.x + this.dir.x,
      y4 = this.pos.y + this.dir.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den === 0) return null;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t > 0 && t < 1 && u > 0) {
      return createVector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
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
    this.boundaries = [
      new Boundary(x, y, x + w, y),
      new Boundary(x + w, y, x + w, y + h),
      new Boundary(x + w, y + h, x, y + h),
      new Boundary(x, y + h, x, y),
    ];
  }

  draw() {
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
  timer = Timing.frames(config.fps * config.timerSeconds, {
    loop: false,
    easing: Easing.EaseInOutQuad,
  });

  // Create rays
  for (let a = 0; a < 360; a += 360 / config.numberOfRays) {
    rays.push(new Ray(lightSource, radians(a)));
  }

  // Add rectangles
  const { rectWidth: w, rectHeight: h, rectGap: g } = config;
  rectangles = [
    new Rectangle(center.x - w / 2, center.y - w / 2 - g - h, w, h),
    new Rectangle(center.x - w / 2, center.y + w / 2 + g, w, h),
    new Rectangle(center.x - w / 2 - g - h, center.y - w / 2, h, w),
    new Rectangle(center.x + w / 2 + g, center.y - w / 2, h, w),
    new Rectangle(0, 0, 1, height),
    new Rectangle(width, 0, 1, height),
    new Rectangle(0, 0, width, 1),
    new Rectangle(0, height, width, 1),
  ];
}

//=================Draw=============================

function draw() {
  if (config.record.shouldRecord && frameCount === 1) {
    const capture = P5Capture.getInstance();
    capture.start({
      // duration: config.record.duration * config.fps,
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
      P5Capture.getInstance().stop();
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
    }
  });

  // Draw rectangles
  rectangles.forEach((rectangle) => rectangle.draw());
  fill(0);
  circle(center.x, center.y, config.centerCircleRadius);
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
