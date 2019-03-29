const Direction = {};
Direction.NORTH = "North";
Direction.EAST = "East";
Direction.SOUTH = "South";
Direction.WEST = "West";

const snek1 = {}, snek2 = {}, snek3 = {}, snek4 = {};
snek1.colourOne = convertColor("#2200ff", "rgba", 1);
snek1.colourTwo = convertColor("#6ff0fc", "rgba", 1);
snek1.headStartGridX = 1;
snek1.headStartGridY = 11;
snek1.headStartDirection = Direction.SOUTH;
snek1.neckDirection = Direction.SOUTH;
snek1.nextMove = Direction.SOUTH;
snek1.selfEat = false;
snek1.pieces = {};
snek2.colourOne = convertColor("#811ca5", "rgba", 1);
snek2.colourTwo = convertColor("#ff44f5", "rgba", 1);
snek2.headStartGridX = 33;
snek2.headStartGridY = 7;
snek2.headStartDirection = Direction.NORTH;
snek2.neckDirection = Direction.NORTH;
snek2.nextMove = Direction.NORTH;
snek2.selfEat = false;
snek2.pieces = {};
snek3.colourOne = convertColor("#ef9907", "rgba", 1);
snek3.colourTwo = convertColor("#efdb43", "rgba", 1);
snek3.headStartGridX = 15;
snek3.headStartGridY = 1;
snek3.headStartDirection = Direction.WEST;
snek3.neckDirection = Direction.WEST;
snek3.nextMove = Direction.WEST;
snek3.selfEat = false;
snek3.pieces = {};
snek4.colourOne = convertColor("#595858", "rgba", 1);
snek4.colourTwo = convertColor("#d8d8d8", "rgba", 1);
snek4.headStartGridX = 19;
snek4.headStartGridY = 17;
snek4.headStartDirection = Direction.EAST;
snek4.neckDirection = Direction.EAST;
snek4.nextMove = Direction.EAST;
snek4.selfEat = false;
snek4.pieces = {};

const sneks = [snek1, snek2, snek3, snek4];

const drops = {};
drops.food = null;
drops.speedup = null;
drops.slowdown = null;
drops.selfEat = null;
drops.reflection = null;

function updateSnekPieces(snekIndex, pieceIndex, snekPiece) {
  grid[snekPiece.xGrid][snekPiece.yGrid] = 1;
  sneks[snekIndex].pieces[pieceIndex] = snekPiece;
}

function printSnekPiecesArrays(_noOfSneks) {
  for (let i = 0; i < _noOfSneks; i++) {
    let res = "Snek[" + i + "]: ";
    zog("SIZE:" + Object.keys(sneks[i].pieces).length);
    for (let j = 0; j < Object.keys(sneks[i].pieces).length; j++) {
      res += j + ": (" + sneks[i].pieces[j].xGrid + "," + sneks[i].pieces[j].yGrid + ") ";
    }
    zog(res);
  }
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
