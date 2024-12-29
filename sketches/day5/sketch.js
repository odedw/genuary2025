/// <reference types="p5/global" />

//=================Config=============================

const config = {
  width: 700,
  height: 700,
  fps: 60,
  tileWidth: 100 * 0.4,
  tileHeight: 65 * 0.4,
  cols: 54,
  rows: 54,
  xOffset: 350,
  yOffset: -190,
  iterationsPerFrame: 4,
  record: {
    shouldRecord: false,
    duration: 60,
  },
};

//=================Tiles=============================
// R = road
// G = grass
// edges = [up, down, left, right]
const tileImages = [
  { name: "crossroad", edges: ["R", "R", "R", "R"] },
  { name: "crossroadESW", edges: ["R", "R", "R", "G"] },
  { name: "crossroadNES", edges: ["R", "R", "G", "R"] },
  { name: "crossroadNEW", edges: ["R", "G", "R", "R"] },
  { name: "crossroadNSW", edges: ["G", "R", "R", "R"] },
  { name: "grass", edges: ["G", "G", "G", "G"] },
  { name: "endE", edges: ["R", "G", "G", "G"] },
  { name: "endW", edges: ["G", "G", "R", "G"] },
  { name: "endN", edges: ["G", "G", "G", "R"] },
  { name: "endS", edges: ["G", "R", "G", "G"] },
  { name: "roadES", edges: ["R", "R", "G", "G"] },
  { name: "roadEW", edges: ["R", "G", "R", "G"] },
  { name: "roadNE", edges: ["R", "G", "G", "R"] },
  { name: "roadNS", edges: ["G", "R", "G", "R"] },
  { name: "roadNW", edges: ["G", "G", "R", "R"] },
  { name: "roadSW", edges: ["G", "R", "R", "G"] },
];

//=================Variables=============================

let lfo1;
let center;
const tiles = [];
let grid;
let frontier = [];

//=================Preload===========================
function preload() {
  tileImages.forEach((t) => {
    const img = loadImage(`../../public/images/tiles/isometric/${t.name}.png`);
    tiles.push(new Tile(img, t.edges));
  });
}
//=================Setup=============================

function reset() {
  grid = new Matrix(config.cols, config.rows, null);
  for (let i = 0; i < grid.cols; i++) {
    for (let j = 0; j < grid.rows; j++) {
      grid.set(i, j, new Cell(tiles));
    }
  }

  // collapse one cell
  const col = int(grid.cols / 2); //int(random(grid.cols));
  const row = int(grid.rows / 2); //int(random(grid.rows));
  const targetCell = grid.get(col, row);
  targetCell.tiles = [random(targetCell.tiles)];

  // add its neighbors to the frontier
  frontier.push(...grid.getNeighbors(col, row));
  // console.log("collapsed", col, row);
}

function setup() {
  createCanvas(config.width, config.height);
  frameRate(config.fps);
  stroke(255);
  rectMode(CENTER);
  center = createVector(width / 2, height / 2);

  reset();
  //   background(0);
}

//=================Draw=============================

function iteration() {
  // check if we're done
  // console.log("iteration", frameCount);
  const unCollapsedCells = grid.cells.filter((c) => !c.collapsed);
  if (unCollapsedCells.length === 0) {
    console.log("done");
    noLoop();
    return;
  }

  const nextGrid = new Matrix(grid.cols, grid.rows, null);

  // first check if we can collapse any cell
  let somethingChanged = false;
  if (frontier.length > 0) {
    for (const c of frontier) {
      const cell = c.value;
      const nextPossibleTiles = cell.calculatePossibleTiles(
        c.col,
        c.row,
        grid,
        tiles
      );
      if (nextPossibleTiles.length < cell.entropy) {
        if (nextPossibleTiles.length === 0) {
          console.log("impossible");
          noLoop();
          return;
        }
        somethingChanged = true;
        nextGrid.set(c.col, c.row, new Cell(nextPossibleTiles));
        frontier.push(...grid.getNeighbors(c.col, c.row));
      }
    }
  }

  if (!somethingChanged) {
    // console.log("no change in frontier", frameCount);
    // if not, find the cell with the least entropy

    const lowestEntropyValue = unCollapsedCells.reduce((min, cell) => {
      return Math.min(min, cell.entropy);
    }, Infinity);

    const lowestEntropyCellCoords = [];

    for (let col = 0; col < grid.cols; col++) {
      for (let row = 0; row < grid.rows; row++) {
        if (grid.get(col, row).entropy === lowestEntropyValue) {
          lowestEntropyCellCoords.push({ col, row });
        }
      }
    }

    // collapse it
    const selectedCoords = random(lowestEntropyCellCoords);
    const selectedCell = grid.get(selectedCoords.col, selectedCoords.row);
    selectedCell.tiles = [random(selectedCell.tiles)];
  }

  // update the grid
  let impossible = false;
  for (let col = 0; col < grid.cols; col++) {
    for (let row = 0; row < grid.rows; row++) {
      if (!!nextGrid.get(col, row)) {
        continue;
      }

      const nextPossibleTiles = grid
        .get(col, row)
        .calculatePossibleTiles(col, row, grid, tiles);
      // console.log(col, row, nextPossibleTiles);
      if (!nextPossibleTiles) {
        debugger;
        grid.get(col, row).calculatePossibleTiles(col, row, grid, tiles);
      }
      if (nextPossibleTiles.length === 0) {
        impossible = true;
        break;
      } else {
        nextGrid.set(col, row, new Cell(nextPossibleTiles));
      }
    }
    if (impossible) {
      break;
    }
  }

  if (impossible) {
    console.log("impossible");
    noLoop();
  }

  grid = nextGrid;

  // calculate the frontier
  frontier = [];
  for (let col = 0; col < grid.cols; col++) {
    for (let row = 0; row < grid.rows; row++) {
      if (grid.get(col, row).collapsed) {
        const neighbors = grid
          .getNeighbors(col, row)
          .filter(
            (c) =>
              !c.value.collapsed && !frontier.find((c2) => c2.value !== c.value)
          );
        frontier.push(...neighbors);
      }
    }
  }
}

function getPosition(col, row) {
  // Calculate isometric position
  const cartX =
    col * config.tileWidth * 0.5 -
    row * config.tileWidth * 0.5 +
    config.xOffset;
  const cartY =
    row * config.tileHeight +
    col * config.tileHeight * 0.5 -
    col * config.tileHeight * 0.115 +
    -row * config.tileHeight * 0.615 +
    config.yOffset;

  // Convert to isometric coordinates
  // Each tile is offset by half its width and height relative to its neighbors
  const x = cartX;
  const y = cartY;

  return createVector(x, y);
}

function draw() {
  if (config.record.shouldRecord && frameCount === 1) {
    const capture = P5Capture.getInstance();
    capture.start({
      duration: config.record.duration * config.fps,
    });
  }
  // if (frameCount % config.framesPerIteration === 0) {
  for (let i = 0; i < config.iterationsPerFrame; i++) {
    iteration();
  }
  background(0);
  for (let col = 0; col < grid.cols; col++) {
    for (let row = 0; row < grid.rows; row++) {
      const cell = grid.get(col, row);
      if (cell.collapsed) {
        const pos = getPosition(col, row);
        if (pos.x < -config.tileWidth || pos.x > width + config.tileWidth) {
          continue;
        }
        if (pos.y < -config.tileHeight || pos.y > height + config.tileHeight) {
          continue;
        }
        image(
          grid.get(col, row).tile.img,
          pos.x,
          pos.y,
          config.tileWidth,
          config.tileHeight
        );
      }
    }
  }
  // }
}

//=================Record=============================

let isLooping = true;
function mouseClicked() {
  isLooping = !isLooping;
  isLooping ? loop() : noLoop();
  iteration();
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
