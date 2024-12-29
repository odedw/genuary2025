class Cell {
  constructor(tiles) {
    this.tiles = tiles;
  }

  get tile() {
    if (this.collapsed) {
      return this.tiles[0];
    } else {
      return null;
    }
  }

  get entropy() {
    return this.tiles.length;
  }

  get collapsed() {
    return this.tiles.length === 1;
  }

  calculatePossibleTiles(col, row, grid, allTiles) {
    if (this.collapsed) {
      return this.tiles;
    }

    const totalPossibleTiles = [];

    // up
    const up = grid.get(col, row - 1);
    if (up?.collapsed) {
      totalPossibleTiles.push(
        allTiles.filter((t) => doesFit(t.up, up.tile.down))
      );
      // for (const possibleTile of up.tiles) {
      //   // if (up.collapsed) debugger;
      //   totalPossibleTiles.push(
      //     ...allTiles.filter((t) => t.up === possibleTile.down)
      //   );
      // }
    }
    // right
    const right = grid.get(col + 1, row);
    if (right?.collapsed) {
      totalPossibleTiles.push(
        allTiles.filter((t) => doesFit(t.right, right.tile.left))
      );
      // for (const possibleTile of right.tiles) {
      // if (right.collapsed) debugger;
      //   totalPossibleTiles.push(
      //     ...allTiles.filter((t) => t.right === possibleTile.left)
      //   );
      // }
    }
    // down
    const down = grid.get(col, row + 1);
    if (down?.collapsed) {
      totalPossibleTiles.push(
        allTiles.filter((t) => doesFit(t.down, down.tile.up))
      );
      // for (const possibleTile of down.tiles) {
      //   // if (down.collapsed) debugger;
      //   totalPossibleTiles.push(
      //   ...allTiles.filter((t) => t.down === possibleTile.up)
      // }
    }
    // left
    const left = grid.get(col - 1, row);
    if (left?.collapsed) {
      totalPossibleTiles.push(
        allTiles.filter((t) => doesFit(t.left, left.tile.right))
      );
      // for (const possibleTile of left.tiles) {
      //   // if (left.collapsed) debugger;
      //   totalPossibleTiles.push(
      //     ...allTiles.filter((t) => t.left === possibleTile.right)
      //   );
      // }
    }

    // intersection of current tiles and possible tiles of neighbors
    const nextPossibleTiles = this.tiles.filter((tile) => {
      return totalPossibleTiles.every((tiles) => tiles.includes(tile));
    });

    return nextPossibleTiles;
  }
}
