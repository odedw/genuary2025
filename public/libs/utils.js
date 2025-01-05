function drawFramerate() {
  stroke(255);
  strokeWeight(1);
  fill(255);
  textSize(20);
  text(int(frameRate()), 10, 20);
}

function polarToCartesian(r, a) {
  return {
    x: cos(a) * r,
    y: sin(a) * r,
  };
}

function cartesianToPolar(x, y) {
  const r = sqrt(sq(x) + sq(y));
  let a = atan(y / x);
  if (x < 0) {
    a += PI;
  }
  return { r, a };
}

function createColorLfo() {
  const phase = 0; //int(random(60));
  const hFrequency = 100 * 60;
  const hPhase = random(hFrequency);

  const obj = {
    l: createLfo(LfoWaveform.Sine, Timing.frames(int(random(20 * 60, phase)))),
    s: createLfo(LfoWaveform.Sine, Timing.frames(int(random(20 * 60, phase)))),
    h: createLfo(
      LfoWaveform.Sine,
      Timing.frames(int(hFrequency), hPhase),
      -1,
      1
    ),
  };

  obj.color = function () {
    const h = map(obj.h.value, -1, 1, 0, 360);
    const s = map(obj.s.value, -1, 1, 20, 100);
    const l = map(obj.l.value, -1, 1, 30, 70);

    let color = new Color("hsl", [h, s, l]);
    return {
      r: color.srgb.r * 255,
      g: color.srgb.g * 255,
      b: color.srgb.b * 255,
    };
  };

  obj.fill = function () {
    const color = obj.color();
    fill(color.r, color.g, color.b);
  };

  obj.stroke = function () {
    const color = obj.color();
    stroke(color.r, color.g, color.b);
  };

  return obj;
}

class Matrix {
  constructor(cols, rows, defaultValue = 0) {
    this._matrix = [];

    for (let i = 0; i < cols; i++) {
      this._matrix.push([]);
      for (let j = 0; j < rows; j++) {
        this._matrix[i].push(defaultValue);
      }
    }
  }

  get(col, row) {
    if (col < 0 || col >= this.width || row < 0 || row >= this.height) {
      return null;
    }
    return this._matrix[col][row];
  }

  set(col, row, value) {
    this._matrix[col][row] = value;
  }

  get width() {
    return this._matrix.length;
  }

  get cols() {
    return this._matrix.length;
  }

  get rows() {
    return this._matrix[0].length;
  }

  get cells() {
    return this._matrix.flat();
  }

  getNeighbors(col, row) {
    const neighbors = [];
    const up = this.get(col, row - 1);
    const right = this.get(col + 1, row);
    const down = this.get(col, row + 1);
    const left = this.get(col - 1, row);

    if (up) neighbors.push({ col: col, row: row - 1, value: up });
    if (right) neighbors.push({ col: col + 1, row: row, value: right });
    if (down) neighbors.push({ col: col, row: row + 1, value: down });
    if (left) neighbors.push({ col: col - 1, row: row, value: left });

    return neighbors;
  }

  //   bfs(startPoint, predicate) {
  //     const queue = [startPoint];
  //     const visited = new Set([`${startPoint.x},${startPoint.y}`]);

  //     while (queue.length > 0) {
  //       const { x, y } = queue.shift(); // Dequeue the next cell

  //       if (predicate(this.get(x, y))) {
  //         return { x, y }; // Found the target cell
  //       }

  //       // Get all valid, not yet visited neighbors
  //       const neighbors = this.getNeighbors(x, y).filter((neighbor) => {
  //         const key = `${neighbor.x},${neighbor.y}`;
  //         if (visited.has(key)) {
  //           return false;
  //         }
  //         visited.add(key); // Mark this neighbor as visited
  //         return true;
  //       });

  //       // Enqueue all unvisited neighbors
  //       for (const neighbor of neighbors) {
  //         queue.push(neighbor);
  //       }
  //     }

  //     return null; // No cell with value true was found
  //   }
}

function generateGrid(cols, rows, w, h) {
  let points = [];
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      let x = col * (w / (cols - 1));
      let y = row * (h / (rows - 1));
      if (x >= 0 && x <= w && y >= 0 && y <= h)
        points.push({ x: int(x), y: int(y), col, row });
    }
  }
  return points;
}

let scenes;
let currentScene;
let currentSceneIndex = 0;
function initScenes(s) {
  scenes = s;
  currentScene = scenes[0];
}

function onSceneChanged(prevScene, currentScene) {
  console.log("scene changed", prevScene, currentScene);
}
function nextScene() {
  let prevScene = currentScene;
  currentSceneIndex = (currentSceneIndex + 1) % scenes.length;
  // console.log('next scene', currentSceneIndex);
  currentScene = scenes[currentSceneIndex];
  onSceneChanged(prevScene, currentScene);
}

// Define a point type
function Point(x, y) {
  this.x = x;
  this.y = y;
}

function getVertices(rect, gap = 0) {
  const points = [];
  const cosAngle = Math.cos(rect.a);
  const sinAngle = Math.sin(rect.a);

  const halfWidth = (rect.w + gap) / 2;
  const halfHeight = (rect.h + gap) / 2;

  points.push({
    x: rect.x + cosAngle * halfWidth - sinAngle * halfHeight,
    y: rect.y + sinAngle * halfWidth + cosAngle * halfHeight,
  });
  points.push({
    x: rect.x - cosAngle * halfWidth - sinAngle * halfHeight,
    y: rect.y - sinAngle * halfWidth + cosAngle * halfHeight,
  });
  points.push({
    x: rect.x - cosAngle * halfWidth + sinAngle * halfHeight,
    y: rect.y - sinAngle * halfWidth - cosAngle * halfHeight,
  });
  points.push({
    x: rect.x + cosAngle * halfWidth + sinAngle * halfHeight,
    y: rect.y + sinAngle * halfWidth - cosAngle * halfHeight,
  });

  return points;
}

function getAxes(vertices) {
  const axes = [];
  for (let i = 0; i < vertices.length; i++) {
    const p1 = vertices[i];
    const p2 = vertices[(i + 1) % vertices.length];
    const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
    axes.push({ x: -edge.y, y: edge.x });
  }
  return axes;
}

function dotProduct(a, b) {
  return a.x * b.x + a.y * b.y;
}

function projectRectangle(axis, vertices) {
  let min = dotProduct(axis, vertices[0]);
  let max = min;
  vertices.forEach((vertex) => {
    const projection = dotProduct(axis, vertex);
    if (projection < min) min = projection;
    if (projection > max) max = projection;
  });
  return [min, max];
}

function isOverlapOnAxis(axis, rectA, rectB) {
  const projectionA = projectRectangle(axis, rectA);
  const projectionB = projectRectangle(axis, rectB);
  return projectionA[1] >= projectionB[0] && projectionB[1] >= projectionA[0];
}

function areRectanglesColliding(rectA, rectB, gap = 0) {
  const verticesA = getVertices(rectA, gap);
  const verticesB = getVertices(rectB, gap);

  const axes = getAxes(verticesA).concat(getAxes(verticesB));
  return axes.every((axis) => isOverlapOnAxis(axis, verticesA, verticesB));
}
