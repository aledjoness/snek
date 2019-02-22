let noOfSnakes = 0;

function init_controller(_noOfSnakes) {
  //stage = _stage;
  noOfSnakes = _noOfSnakes;
  //gameClock();

  window.addEventListener("keydown", function (event) {
    processKeyPressEvent(event);
  });
}

function processKeyPressEvent(event) {
  let keyPressed = event.key;
  if (sneks[0].nextMove == null) {
    if (sneks[0].pieces[0].direction === Direction.NORTH) {
      if (keyPressed === "ArrowLeft") {
        turnHead("Left");
      }
      if (keyPressed === "ArrowRight") {
        turnHead("Right");
      }
    } else if (sneks[0].pieces[0].direction === Direction.EAST) {
      if (keyPressed === "ArrowUp") {
        turnHead("Left");
      }
      if (keyPressed === "ArrowDown") {
        turnHead("Right");
      }
    } else if (sneks[0].pieces[0].direction === Direction.SOUTH) {
      if (keyPressed === "ArrowLeft") {
        turnHead("Right");
      }
      if (keyPressed === "ArrowRight") {
        turnHead("Left");
      }
    } else if (sneks[0].pieces[0].direction === Direction.WEST) {
      if (keyPressed === "ArrowUp") {
        turnHead("Right");
      }
      if (keyPressed === "ArrowDown") {
        turnHead("Left");
      }
    }
  }
}


// zim.Ticker.add(gameClock, stage);
function gameClock() {
  // animationCounter.move({x:newPoint.CounterList[newPoint.Count-1].boundsToGlobal().x+50, y:newPoint.CounterList[newPoint.Count-1].boundsToGlobal().y+50, time:600});
  // let x = 5;
  // zim.Ticker.add(doStuff, stage);
  // function doStuff() {
  //   timeout(2000, function() {
  //     zog("heh");
  //     x--;
  //     if (x === 0) {
  //       zog("5s");
  //       zim.Ticker.remove(doStuff);
  //     }
  //   });
  let x = 0;
  let y = interval(1000, function () {
    makeSnekMoves();
    clearNextMoves();


    // x++;
    // zog("yooooo " + x);
    // if (x === 10) {
    //   y.clear();
    // }
  });
}

function makeSnekMoves() {
  // for (let i = 0; i < noOfSnakes; i++) {
  let nextHeadPositions = [];
  for (let i = 0; i < 1; i++) {
    if (nextMoveIsInBounds(sneks[i].pieces[0].xGrid, sneks[i].pieces[0].yGrid, sneks[i].nextMove)) {
      nextHeadPositions[i] = nextHeadGridLocation(sneks[i].pieces[0].xGrid, sneks[i].pieces[0].yGrid, sneks[i].nextMove);

      moveSnekPiece(sneks[i].pieces[0], nextHeadPositions[i].nextX, nextHeadPositions[i].nextY);
      // updateSnekPieces(i, 0, sneks[i].pieces[0]);

      let movingX = null;
      let movingY = null;
      for (let j = 1; j < Object.keys(sneks[i].pieces).length; j++) {
        movingX = sneks[i].pieces[j].xGrid;
        movingY = sneks[i].pieces[j].yGrid; // old x/y coords, next iteration needs to use them to update position
        moveSnekPiece(sneks[i].pieces[j], sneks[i].pieces[j-1].xGrid, sneks[i].pieces[j-1].yGrid);
      }




      sneks[i].pieces[0].xGrid = nextHeadPositions[i].nextX;
      sneks[i].pieces[0].yGrid = nextHeadPositions[i].nextY;

      // TODO Need to work out next body positions


    } else {
      zog("OUT OF BOUNDS");
      let outOfBoundsHeadPos = {};
      outOfBoundsHeadPos.nextX = sneks[i].pieces[0].xGrid;
      outOfBoundsHeadPos.nextY = sneks[i].pieces[0].yGrid;
      nextHeadPositions[i] = outOfBoundsHeadPos;
    }
  }


  updateSneks(nextHeadPositions);
}

function nextMoveIsInBounds(currentX, currentY, direction) {
  if (direction === Direction.NORTH && (currentY - 1 < 0)) {
    return false;
  } else if (direction === Direction.SOUTH && (currentY - 1 > 19)) {
    return false;
  } else if (direction === Direction.EAST && (currentX + 1 > 35)) {
    return false;
  } else if (direction === Direction.WEST && (currentY - 1 < 0)) {
    return false;
  }
  return true;
}

function nextHeadGridLocation(currentX, currentY, direction) {
  let result = {};
  result.nextX = currentX;
  result.nextY = currentY;
  if (direction === Direction.NORTH) {
    result.nextY--;
  } else if (direction === Direction.SOUTH && (currentY - 1 > 19)) {
    result.nextY++;
  } else if (direction === Direction.EAST && (currentX + 1 > 35)) {
    result.nextX++;
  } else if (direction === Direction.WEST && (currentY - 1 < 0)) {
    result.nextX--;
  }
  return result;
}
