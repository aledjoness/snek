const Direction = {};
Direction.NORTH = "North";
Direction.EAST = "East";
Direction.SOUTH = "South";
Direction.WEST = "West";

const runner = {};
runner.colourOne = convertColor("#2200ff", "rgba", 1);
runner.colourTwo = convertColor("#6ff0fc", "rgba", 1);
runner.head = null;
runner.head.xGrid = 1;
runner.head.yGrid = 11;
runner.headStartDirection = Direction.EAST;
// runner.speedup = null;
// runner.slowdown = null;
// runner.selfEat = false;
// runner.selfEatPiece = null;
// runner.reflection = false;
// runner.dead = false;
// snek2.colourOne = convertColor("#811ca5", "rgba", 1);
// snek2.colourTwo = convertColor("#ff44f5", "rgba", 1);
// snek3.colourOne = convertColor("#ef9907", "rgba", 1);
// snek3.colourTwo = convertColor("#efdb43", "rgba", 1);
// snek4.colourOne = convertColor("#595858", "rgba", 1);
// snek4.colourTwo = convertColor("#d8d8d8", "rgba", 1);

const drops = {};
drops.food = null;
drops.speedup = null;
drops.slowdown = null;
drops.selfEat = null;
drops.reflection = null;

function updateSnekPieces(snekIndex, pieceIndex, snekPiece) {
  //console.log("x: " + snekPiece.xGrid + " y: " + snekPiece.yGrid);
  grid[snekPiece.xGrid][snekPiece.yGrid] = 1;
  sneks[snekIndex].pieces[pieceIndex] = snekPiece;
}

function printSnekPiecesArrays(_noOfSneks) {
  for (let i = 0; i < _noOfSneks; i++) {
    let res = "Snek[" + i + "]: ";
    console.log("SIZE:" + Object.keys(sneks[i].pieces).length);
    for (let j = 0; j < Object.keys(sneks[i].pieces).length; j++) {
      res += j + ": (" + sneks[i].pieces[j].xGrid + "," + sneks[i].pieces[j].yGrid + ") ";
    }
    console.log(res);
  }
}

function printUnderlyingGrid(grid) {
  // let top = "[ ] ";
  // for (let i = 0; i < 19; i++) {
  //   top += i + " ";
  // }
  //console.log(top);
  let res = "";
  for (let i = 0; i < grid.length; i++) {
    i < 10 ? res += "[" + i + " ] " : res += "[" + i + "] ";
    for (let j = 0; j < grid[i].length; j++) {
      res += grid[i][j] + " ";
    }
    res += "\n";
  }
  console.log(res);
  // console.log(grid);
}

function clearNextMoves() {
  for (let i = 0; i < 4; i++) {
    sneks[i].nextMove = null;
  }
}

function oppositeDirection(direction) {
  switch (direction) {
    case Direction.NORTH:
      return Direction.SOUTH;
    case Direction.EAST:
      return Direction.WEST;
    case Direction.SOUTH:
      return Direction.NORTH;
    case Direction.WEST:
      return Direction.EAST;
  }
}

function leftDirection(direction) {
  switch (direction) {
    case Direction.NORTH:
      return Direction.WEST;
    case Direction.EAST:
      return Direction.NORTH;
    case Direction.SOUTH:
      return Direction.EAST;
    case Direction.WEST:
      return Direction.SOUTH;
  }
}

function rightDirection(direction) {
  switch (direction) {
    case Direction.NORTH:
      return Direction.EAST;
    case Direction.EAST:
      return Direction.SOUTH;
    case Direction.SOUTH:
      return Direction.WEST;
    case Direction.WEST:
      return Direction.NORTH;
  }
}
