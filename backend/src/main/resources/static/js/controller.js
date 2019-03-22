let noOfSnakes = 0;
let gameOver = false;
let rezz;

function init_controller(_noOfSnakes) {
  noOfSnakes = _noOfSnakes;
  rezz = [];
  for (let i = 0; i < 100; i++) {
    rezz[i] = 0;
  }
  //randomlyPlaceFood(); // new items to be added should be event-driven
  gameClock();

  window.addEventListener("keydown", function (event) {
    processKeyPressEvent(event);
  });
}

function gameClock() {
  let clock = interval(130, function () {
    makeSnekMoves();
    randomlyPlaceFood();
    randomlyPlaceSpecialDrop();
    // TODO: Handle end game
    if (gameOver) {
      clock.clear();
      console.log(rezz);
      zog("Game over");
    }
  });
}

function processKeyPressEvent(event) {
  let keyPressed = event.key;
  if (sneks[0] !== null) {
    if (sneks[0].pieces[0].direction === Direction.NORTH) {
      if (keyPressed === "ArrowLeft" && sneks[0].neckDirection !== Direction.EAST) {
        turnHead("Left");
      }
      if (keyPressed === "ArrowRight" && sneks[0].neckDirection !== Direction.WEST) {
        turnHead("Right");
      }
      if (keyPressed === "ArrowDown" && sneks[0].neckDirection !== Direction.NORTH) {
        turnHead("Opposite");
      }
    } else if (sneks[0].pieces[0].direction === Direction.EAST) {
      if (keyPressed === "ArrowUp" && sneks[0].neckDirection !== Direction.SOUTH) {
        turnHead("Left");
      }
      if (keyPressed === "ArrowDown" && sneks[0].neckDirection !== Direction.NORTH) {
        turnHead("Right");
      }
      if (keyPressed === "Left" && sneks[0].neckDirection !== Direction.EAST) {
        turnHead("Opposite");
      }
    } else if (sneks[0].pieces[0].direction === Direction.SOUTH) {
      if (keyPressed === "ArrowLeft" && sneks[0].neckDirection !== Direction.EAST) {
        turnHead("Right");
      }
      if (keyPressed === "ArrowRight" && sneks[0].neckDirection !== Direction.WEST) {
        turnHead("Left");
      }
      if (keyPressed === "ArrowUp" && sneks[0].neckDirection !== Direction.SOUTH) {
        turnHead("Opposite");
      }
    } else if (sneks[0].pieces[0].direction === Direction.WEST) {
      if (keyPressed === "ArrowUp" && sneks[0].neckDirection !== Direction.SOUTH) {
        turnHead("Right");
      }
      if (keyPressed === "ArrowDown" && sneks[0].neckDirection !== Direction.NORTH) {
        turnHead("Left");
      }
      if (keyPressed === "Right" && sneks[0].neckDirection !== Direction.WEST) {
        turnHead("Opposite");
      }
    }
  }
}

function makeSnekMoves() {
  let nextHeadPositions = [];
  for (let i = 0; i < 1; i++) { // TODO: update for multiple sneks
    if (sneks[i] !== null) {
      if (nextMoveIsInBounds(sneks[i].pieces[0].xGrid, sneks[i].pieces[0].yGrid, sneks[i].nextMove)) {
        nextHeadPositions[i] = nextHeadGridLocation(sneks[i].pieces[0].xGrid, sneks[i].pieces[0].yGrid, sneks[i].nextMove);

        let growSnek = false;
        if (snekEatsFood(nextHeadPositions[i].nextX, nextHeadPositions[i].nextY)) {
          growSnek = true;
        }

        let nextXMove = nextHeadPositions[i].nextX, nextYMove = nextHeadPositions[i].nextY;
        for (let j = 0; j < Object.keys(sneks[i].pieces).length; j++) {
          let prevXPlacement = sneks[i].pieces[j].xGrid, prevYPlacement = sneks[i].pieces[j].yGrid;

          if (j === Object.keys(sneks[i].pieces).length - 1 && growSnek) {
            eatFood(i, sneks[i].pieces[j].xGrid, sneks[i].pieces[j].yGrid, j+1);
            growSnek = false;
          }

          sneks[i].pieces[j].xGrid = nextXMove;
          sneks[i].pieces[j].yGrid = nextYMove;

          nextXMove = prevXPlacement;
          nextYMove = prevYPlacement;
        }
        sneks[i].neckDirection = sneks[i].nextMove;

        // If next move is drops / other snek respond appropriately
        // console.log(sneks[0].pieces[0].xGrid + " , " + sneks[0].pieces[0].yGrid);
        // TODO: Try obj.hitTestRect(other, num, boundsCheck)
        if (squareNotFree(nextXMove, nextYMove)) {
          console.log("Ruh Roh");
        }


      } else {
        nextHeadPositions[i] = null;
        killSnek(0);
      }
    }
  }
  updateSneks(noOfSnakes);
}

function snekEatsFood(x, y) {
  if (drops.food !== null && x === drops.food.xGrid && y === drops.food.yGrid) {
    return true;
  }
}

function eatFood(snekIndex, x, y, newIndex) {
  let body = makeSnekBody(snekIndex, Object.keys(sneks[snekIndex].pieces).length-1);
  addPieceToTail(body, snekIndex, x, y, newIndex);
  removeItemFromStage(drops.food);
  drops.food = null;
}

function snekSpeedsUp(x, y) {
  if (drops.speedup !== null && x === drops.speedup.xGrid && y === drops.speedup.yGrid) {
    return true;
  }
}

function snekSlowsDown(x, y) {
  if (drops.slowdown !== null && x === drops.slowdown.xGrid && y === drops.slowdown.yGrid) {
    return true;
  }
}

function randomlyPlaceFood() {
  // Place random item at random location
  // Items to choose from: Manga, speed up, slow down, reflection, self-immunity
  // Changes: Manga 14/20, speed-up 2/20, slow-down 2/20, reflection 1/20, self-immunity 1/20
  //addItemToStage(createFood());
  // Update: always place food, but maybe sometimes place something else

  // Decide whether to also place another item
  // Also need to consider removing an item (maybe put a timer on it)


  if (drops.food === null) {
    let freeCoords = getFreeCoords();
    let food = createFood();
    food.xGrid = freeCoords.x;
    food.yGrid = freeCoords.y;
    drops.food = food;
    addItemToStage(food);
  }
}

function randomlyPlaceSpecialDrop() {
  if (drops.speedup === null || drops.slowdown === null) {
    let res = Math.floor(Math.random() * Math.floor(100));
    rezz[res]++;
    if (res === 0) {
      if (drops.speedup !== null) {
        let sd = createSlowdown();
        let freeCoords = getFreeCoords();
        sd.xGrid = freeCoords.x;
        sd.yGrid = freeCoords.y;
        drops.slowdown = sd;
        addItemToStage(sd);
      } else if (drops.slowdown !== null) {
        let su = createSpeedup();
        let freeCoords = getFreeCoords();
        su.xGrid = freeCoords.x;
        su.yGrid = freeCoords.y;
        drops.speedup = su;
        addItemToStage(su);
      } else {
        if (Math.floor(Math.random() * Math.floor(2)) === 0) {
          let su = createSpeedup();
          let freeCoords = getFreeCoords();
          su.xGrid = freeCoords.x;
          su.yGrid = freeCoords.y;
          drops.speedup = su;
          addItemToStage(su);
        } else {
          let sd = createSlowdown();
          let freeCoords = getFreeCoords();
          sd.xGrid = freeCoords.x;
          sd.yGrid = freeCoords.y;
          drops.slowdown = sd;
          addItemToStage(sd);
        }
      }
    }
  }
}

function getFreeCoords() {
  let proposedX = Math.floor(Math.random() * Math.floor(35));
  let proposedY = Math.floor(Math.random() * Math.floor(19));

  while (squareNotFree(proposedX, proposedY)) {
    proposedX = Math.floor(Math.random() * Math.floor(35));
    proposedY = Math.floor(Math.random() * Math.floor(19));
  }
  return {x: proposedX, y: proposedY};
}

function squareNotFree(proposedX, proposedY) {
  // Go through each snek piece and see if it resides at (proposedX, proposedY)
  for (let i = 0; i < noOfSnakes; i++) {
    if (sneks[i] !== null) {
      for (let j = 0; j < Object.keys(sneks[i].pieces).length; j++) {
        if (sneks[i].pieces[j].xGrid === proposedX && sneks[i].pieces[j].yGrid === proposedY) {
          return true;
        }
      }
    }
  }
  if (drops.food !== null) {
    if (drops.food.xGrid === proposedX && drops.food.yGrid === proposedY) {
      return true;
    }
  }
  if (drops.speedup !== null) {
    if (drops.speedup.xGrid === proposedX && drops.speedup.yGrid === proposedY) {
      return true;
    }
  }
  if (drops.slowdown !== null) {
    if (drops.slowdown.xGrid === proposedX && drops.slowdown.yGrid === proposedY) {
      return true;
    }
  }
  return false;
}

function nextMoveIsInBounds(currentX, currentY, direction) {
  if (direction === Direction.NORTH && (currentY - 1 < 0)) {
    return false;
  } else if (direction === Direction.SOUTH && (currentY + 1 > 18)) {
    return false;
  } else if (direction === Direction.EAST && (currentX + 1 > 34)) {
    return false;
  } else if (direction === Direction.WEST && (currentX - 1 < 0)) {
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
  } else if (direction === Direction.SOUTH) {
    result.nextY++;
  } else if (direction === Direction.EAST) {
    result.nextX++;
  } else if (direction === Direction.WEST) {
    result.nextX--;
  }
  return result;
}
