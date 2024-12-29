/// <reference types="p5/global" />

//=================Config=============================

const config = {
  width: 700,
  height: 700,
  fps: 60,
  tileWidth: 100 * 0.4,
  tileHeight: 65 * 0.4,
  ratio: 0.5,
  cols: 54,
  rows: 54,
  xOffset: 350,
  yOffset: -190,
  iterationsPerFrame: 10,
  framesPerIteration: 1,
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
  // { name: "crossroad", edges: ["RRR", "RRR", "RRR", "RRR"] },
  // { name: "crossroadESW", edges: ["RRR", "RRR", "RRR", "GGG"] },
  // { name: "crossroadNES", edges: ["RRR", "RRR", "GGG", "RRR"] },
  // { name: "crossroadNEW", edges: ["RRR", "GGG", "RRR", "RRR"] },
  // { name: "crossroadNSW", edges: ["GGG", "RRR", "RRR", "RRR"] },
  // { name: "endE", edges: ["RRR", "GGG", "GGG", "GGG"] },
  // { name: "endW", edges: ["GGG", "GGG", "RRR", "GGG"] },
  // { name: "endN", edges: ["GGG", "GGG", "GGG", "RRR"] },
  // { name: "endS", edges: ["GGG", "RRR", "GGG", "GGG"] },
  // { name: "roadES", edges: ["RRR", "RRR", "GGG", "GGG"] },
  // { name: "roadEW", edges: ["RRR", "GGG", "RRR", "GGG"] },
  // { name: "roadNE", edges: ["RRR", "GGG", "GGG", "RRR"] },
  // { name: "roadNS", edges: ["GGG", "RRR", "GGG", "RRR"] },
  // { name: "roadNW", edges: ["GGG", "GGG", "RRR", "RRR"] },
  // { name: "roadSW", edges: ["GGG", "RRR", "RRR", "GGG"] },
  // { name: "bridgeLowEW", edges: ["RRR", "RRR", "RRR", "RRR"] },
  // { name: "bridgeLowNS", edges: ["RRR", "RRR", "RRR", "RRR"] },
  // { name: "riverES", edges: ["W", "W", "GGG", "GGG"] },
  // { name: "riverEW", edges: ["W", "GGG", "W", "GGG"] },
  // { name: "riverNE", edges: ["W", "GGG", "GGG", "W"] },
  // { name: "riverNS", edges: ["GGG", "W", "GGG", "W"] },
  // { name: "riverNW", edges: ["GGG", "GGG", "W", "W"] },
  // { name: "riverSW", edges: ["GGG", "W", "W", "GGG"] },
  { name: "grass", edges: ["GGG", "GGG", "GGG", "GGG"] },
  // { name: "riverES", edges: ["GWG", "GWG", "GGG", "GGG"] },
  // { name: "riverEW", edges: ["GWG", "GGG", "GWG", "GGG"] },
  // { name: "riverNE", edges: ["GWG", "GGG", "GGG", "GWG"] },
  // { name: "riverNS", edges: ["GGG", "GWG", "GGG", "GWG"] },
  // { name: "riverNW", edges: ["GGG", "GGG", "GWG", "GWG"] },
  // { name: "riverSW", edges: ["GGG", "GWG", "GWG", "GGG"] },
  { name: "water", edges: ["WWW", "WWW", "WWW", "WWW"] },
  { name: "waterCornerES", edges: ["WWG", "GWW", "WWW", "WWW"] },
  { name: "waterCornerNE", edges: ["GWW", "WWW", "WWW", "WWG"] },
  { name: "waterCornerNW", edges: ["WWW", "WWW", "WWG", "GWW"] },
  { name: "waterCornerSW", edges: ["WWW", "WWG", "GWW", "WWW"] },
  { name: "waterE", edges: ["GGG", "GWW", "WWW", "WWG"] },
  { name: "waterES", edges: ["GGG", "GGG", "GWW", "WWG"] },
  { name: "waterN", edges: ["GWW", "WWW", "WWG", "GGG"] },
  { name: "waterNE", edges: ["GGG", "GWW", "WWG", "GGG"] },
  { name: "waterNW", edges: ["GWW", "WWG", "GGG", "GGG"] },
  { name: "waterS", edges: ["WWG", "GGG", "GWW", "WWW"] },
  { name: "waterSW", edges: ["WWG", "GGG", "GGG", "GWW"] },
  { name: "waterW", edges: ["WWW", "WWG", "GGG", "GWW"] },
  // { name: "beach", edges: ["BBB", "BBB", "BBB", "BBB"] },
  // { name: "beachCornerES", edges: ["WWB", "BWW", "WWW", "WWW"] },
  // { name: "beachCornerNE", edges: ["BWW", "WWW", "WWW", "WWB"] },
  // { name: "beachCornerNW", edges: ["WWW", "WWW", "WWB", "BWW"] },
  // { name: "beachCornerSW", edges: ["WWW", "WWB", "BWW", "WWW"] },
  // { name: "beachE", edges: ["BBB", "BWW", "WWW", "WWB"] },
  // { name: "beachES", edges: ["BWW", "WWB", "GGG", "GGG"] },
  // { name: "beachN", edges: ["BWW", "WWW", "WWB", "BBB"] },
  // { name: "beachNE", edges: ["WWB", "GGG", "GGG", "BWW"] },
  // { name: "beachNW", edges: ["GGG", "GGG", "BWW", "WWB"] },
  // { name: "beachS", edges: ["WWB", "BBB", "BWW", "WWW"] },
  // { name: "beachSW", edges: ["GGG", "BWW", "WWB", "GGG"] },
  // { name: "beachW", edges: ["WWW", "WWB", "BBB", "BWW"] },
  // { name: "", edges: ["", "", "", ""] },
  // { name: "", edges: ["", "", "", ""] },
  // { name: "", edges: ["", "", "", ""] },
  // { name: "", edges: ["", "", "", ""] },
  // { name: "", edges: ["", "", "", ""] },
  // { name: "", edges: ["", "", "", ""] },
];

//=================Variables=============================

let lfo1;
let center;
const tiles = [];
let grid;
let frontier = [];
let treeMatrix;
//=================Preload===========================
function preload() {
  trees = [
    {
      img: loadImage(`../../public/images/tiles/isometric/coniferShort.png`),
      width: 14,
      height: 36,
    },
    {
      img: loadImage(`../../public/images/tiles/isometric/coniferTall.png`),
      width: 19,
      height: 48,
    },
    {
      img: loadImage(`../../public/images/tiles/isometric/coniferAltShort.png`),
      width: 14,
      height: 36,
    },
    {
      img: loadImage(`../../public/images/tiles/isometric/coniferAltTall.png`),
      width: 19,
      height: 48,
    },
    {
      img: loadImage(`../../public/images/tiles/isometric/treeAltShort.png`),
      width: 11,
      height: 32,
    },
    {
      img: loadImage(`../../public/images/tiles/isometric/treeAltTall.png`),
      width: 11,
      height: 41,
    },
    {
      img: loadImage(`../../public/images/tiles/isometric/treeShort.png`),
      width: 11,
      height: 32,
    },
    {
      img: loadImage(`../../public/images/tiles/isometric/treeTall.png`),
      width: 12,
      height: 41,
    },
  ];

  tileImages.forEach((t) => {
    const img = loadImage(`../../public/images/tiles/isometric/${t.name}.png`);
    tiles.push(new Tile(img, t.edges, t.name));
  });

  treeMatrix = new Matrix(config.cols, config.rows, null);
  for (let i = 0; i < treeMatrix.cols; i++) {
    for (let j = 0; j < treeMatrix.rows; j++) {
      if (random(1) < 0.5) {
        treeMatrix.set(i, j, random(trees));
      }
    }
  }
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
  loop();
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
    return true;
  }

  const nextGrid = new Matrix(grid.cols, grid.rows, null);

  // first check if we can collapse any cell
  let somethingChanged = false;
  if (frontier.length > 0) {
    for (const c of frontier) {
      const cell = c.value;
      let nextPossibleTiles = cell.calculatePossibleTiles(
        c.col,
        c.row,
        grid,
        tiles
      );
      if (nextPossibleTiles.length < cell.entropy) {
        // collapsed

        if (nextPossibleTiles.length === 0) {
          console.log("impossible - frontier");
          // debugger;
          // nextPossibleTiles = cell.calculatePossibleTiles(
          //   c.col,
          //   c.row,
          //   grid,
          //   tiles
          // );
          noLoop();
          return false;
        }
        somethingChanged = true;
        nextGrid.set(c.col, c.row, new Cell(nextPossibleTiles));
        frontier.push(...grid.getNeighbors(c.col, c.row));
        if (nextPossibleTiles === 1) {
          break;
        }
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

    const selectedCoords = random(lowestEntropyCellCoords);
    const selectedCell = grid.get(selectedCoords.col, selectedCoords.row);
    // collapse it
    // selectedCell.tiles = [random(selectedCell.tiles)];
    // remove one tile from it's possible tiles
    const tileIndexToRemove = int(random(selectedCell.tiles.length));
    selectedCell.tiles = selectedCell.tiles.filter(
      (_, index) => index !== tileIndexToRemove
    );
  }

  // update the grid
  let impossible = false;
  for (let col = 0; col < grid.cols; col++) {
    for (let row = 0; row < grid.rows; row++) {
      if (!!nextGrid.get(col, row)) {
        continue;
      }

      let nextPossibleTiles = grid
        .get(col, row)
        .calculatePossibleTiles(col, row, grid, tiles);
      // console.log(col, row, nextPossibleTiles);
      // if (!nextPossibleTiles) {
      //   debugger;
      //   grid.get(col, row).calculatePossibleTiles(col, row, grid, tiles);
      // }
      if (nextPossibleTiles.length === 0) {
        impossible = true;
        // debugger;
        // nextPossibleTiles = grid
        //   .get(col, row)
        //   .calculatePossibleTiles(col, row, grid, tiles);
        console.log("impossible - grid");
        noLoop();
        return false;
        // break;
      } else {
        nextGrid.set(col, row, new Cell(nextPossibleTiles));
      }
    }
    if (impossible) {
      break;
    }
  }

  if (impossible) {
    console.log("impossible - grid");
    // noLoop();
    // reset();
    return false;
  }

  grid = nextGrid;

  // calculate the frontier
  frontier = [];
  for (let col = 0; col < grid.cols; col++) {
    for (let row = 0; row < grid.rows; row++) {
      if (!grid.get(col, row)) debugger;
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
  return true;
}

function draw() {
  if (config.record.shouldRecord && frameCount === 1) {
    const capture = P5Capture.getInstance();
    capture.start({
      duration: config.record.duration * config.fps,
    });
  }
  for (let i = 0; i < config.iterationsPerFrame; i++) {
    iteration();
  }

  background(0);
  for (let col = 0; col < grid.cols; col++) {
    for (let row = 0; row < grid.rows; row++) {
      const cell = grid.get(col, row);
      if (cell.collapsed) {
        cell.tile.draw(col, row, config);
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
