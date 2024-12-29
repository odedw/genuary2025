class Tile {
  constructor(img, edges) {
    this.img = img;
    this.edges = edges;

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
}
