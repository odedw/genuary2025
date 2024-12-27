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

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    let options = {
      friction: 0.3,
      restitution: 0.6,
      isStatic: true,
    };
    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
    Composite.add(world, this.body);
  }

  draw() {
    let pos = this.body.position;
    let angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    stroke(255);
    rectMode(CENTER);
    strokeWeight(1);
    fill(0);
    rect(0, 0, this.w, this.h);
    pop();
  }
}

class Ball {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    let options = {
      friction: 0.3,
      restitution: 0.6,
    };
    this.body = Bodies.circle(this.x, this.y, this.r, options);

    Composite.add(world, this.body);
  }

  draw() {
    let pos = this.body.position;
    let angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    strokeWeight(1);
    stroke(255);
    noFill();
    circle(0, 0, this.r * 2);
    pop();
  }
}

//=================Variables===========================

let center;
const { Engine, World, Bodies, Composite } = Matter;
let engine;
let world;
let boxes = [];
let ground;
let ball;
//=================Setup=============================

function setup() {
  createCanvas(config.width, config.height);
  frameRate(config.fps);
  stroke(255);
  rectMode(CENTER);
  center = createVector(width / 2, height / 2);

  engine = Engine.create();
  world = engine.world;
  ground = new Rectangle(width / 2, height - 50, width, 20);
  ball = new Ball(width / 2, height / 2, 20);
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
  Engine.update(engine);
  background(0);
  ground.draw();
  ball.draw();
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
