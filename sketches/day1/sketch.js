// constants

// locals

function setup() {
  createCanvas(700, 700);
  stroke(255);
  rectMode(CENTER);
  // pixelDensity(1);
  //   background(0);
}

function draw() {
  background(0);
}

let isLooping = true;
function mouseClicked() {
  if (isLooping) {
    noLoop();
  } else {
    loop();
  }

  isLooping = !isLooping;
}
