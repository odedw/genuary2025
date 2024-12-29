class Tile {
  constructor(img, edges, name) {
    this.img = img;
    this.edges = edges;
    this.name = name;

    if (this.edges.length !== 4) {
      throw new Error("Tile must have 4 edges");
    }

    // valid neighbors
    // this.up = [];
    // this.down = [];
    // this.left = [];
    // this.right = [];
  }

  get up() {
    return this.edges[0];
  }

  get right() {
    return this.edges[1];
  }

  get down() {
    return this.edges[2];
  }

  get left() {
    return this.edges[3];
  }

  getPosition(col, row, config) {
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

  draw(col, row, config) {
    const pos = this.getPosition(col, row, config);
    if (pos.x < -config.tileWidth || pos.x > width + config.tileWidth) {
      return;
    }
    if (pos.y < -config.tileHeight || pos.y > height + config.tileHeight) {
      return;
    }
    image(
      grid.get(col, row).tile.img,
      pos.x,
      pos.y,
      config.tileWidth,
      config.tileHeight
    );

    const tree = treeMatrix.get(col, row);
    if (!!tree) {
      if (this.name === "grass") {
        image(
          tree.img,
          pos.x,
          pos.y,
          tree.width * config.ratio,
          tree.height * config.ratio
        );
      }
    }
  }
}

function doesFit(edge1, edge2) {
  const reverse = edge2.split("").reverse().join("");
  return edge1 === reverse;
}
