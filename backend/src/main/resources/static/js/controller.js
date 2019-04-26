let noOfSnakes = 0;
let gameOver = false;
let rezz;
let grid;

function init_controller(_noOfSnakes) {
  noOfSnakes = _noOfSnakes;
  rezz = [];
  for (let i = 0; i < 100; i++) {
    rezz[i] = 0;
  }
  initGrid();
  countdown();
}

function initGrid() {
  grid = new Array(35);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(19);
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = 0;
    }
  }
}

function countdown() {
  let timeoutMillis = 700;
  let labSize = 75;
  let color = "white";
  let outlineColor = "black";
  let lab = new Label({
    text: "3", size: labSize, color: color, outlineColor: outlineColor
  });
  lab.center(stage);
  timeout(timeoutMillis, () => {
    removeItemFromStage(lab);
    lab = new Label({
      text: "2", size: labSize, color: color, outlineColor: outlineColor
    });
    lab.center(stage);
    stage.update();
    timeout(timeoutMillis, () => {
      removeItemFromStage(lab);
      lab = new Label({
        text: "1", size: labSize, color: color, outlineColor: outlineColor
      });
      lab.center(stage);
      stage.update();
      timeout(timeoutMillis, () => {
        removeItemFromStage(lab);
        lab = new Label({
          text: "GO!", size: labSize, color: color, outlineColor: outlineColor
        });
        lab.center(stage);
        stage.update();
        timeout(timeoutMillis, () => {
          removeItemFromStage(lab);
          gameClock();
          zog("Starting again");
          window.addEventListener("keydown", processKeyPressEvent);
        })
      })
    })
  })
}


function gameClock() {
  let clock = interval(100, function () {
    makeSnekMoves();
    //randomlyPlaceFood();
    randomlyPlaceDrops(false);
    // TODO: Handle end game
    if (gameOver) {
      clock.clear();
      zog("Game over");
      window.removeEventListener("keydown", processKeyPressEvent);
      playAgain();
    }
  });
}

let processKeyPressEvent = (event) => {
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
};

function makeSnekMoves() {
  let nextHeadPositions = [];
  for (let i = 0; i < 1; i++) { // TODO: update for multiple sneks
    if (sneks[i] !== null) {
      if (nextMoveIsInBounds(sneks[i].pieces[0].xGrid, sneks[i].pieces[0].yGrid, sneks[i].nextMove)) {
        nextHeadPositions[i] = nextHeadGridLocation(sneks[i].pieces[0].xGrid, sneks[i].pieces[0].yGrid, sneks[i].nextMove);

        if (snekEatsItselfOrOtherSnek(i, nextHeadPositions[i].nextX, nextHeadPositions[i].nextY)) {
          killSnek(i);
        } else {
          grid[nextHeadPositions[i].nextX][nextHeadPositions[i].nextY] = 1;

          let growSnek = false;
          if (snekEatsFood(nextHeadPositions[i].nextX, nextHeadPositions[i].nextY)) {
            growSnek = true;
          }

          if (snekSpeedsUp(nextHeadPositions[i].nextX, nextHeadPositions[i].nextY)) {
            console.log("speeding up");
          }

          if (snekSlowsDown(nextHeadPositions[i].nextX, nextHeadPositions[i].nextY)) {
            console.log("slowing down");
          }

          if (snekSelfEats(nextHeadPositions[i].nextX, nextHeadPositions[i].nextY)) {
            console.log("self eat");
            absorbSelfEat(i);
          }

          if (snekReflects(nextHeadPositions[i].nextX, nextHeadPositions[i].nextY)) {
            console.log("reflecting");
            absorbReflection(i);
          }

          let nextXMove = nextHeadPositions[i].nextX, nextYMove = nextHeadPositions[i].nextY;
          for (let j = 0; j < Object.keys(sneks[i].pieces).length; j++) {
            let prevXPlacement = sneks[i].pieces[j].xGrid, prevYPlacement = sneks[i].pieces[j].yGrid;

            sneks[i].pieces[j].xGrid = nextXMove;
            sneks[i].pieces[j].yGrid = nextYMove;

            nextXMove = prevXPlacement;
            nextYMove = prevYPlacement;

            if (j === Object.keys(sneks[i].pieces).length - 1) {
              if (growSnek) {
                eatFood(i, nextXMove, nextYMove, j + 1);
                printSnekPiecesArrays(1);
                growSnek = false;
                sneks[i].pieces[0].addTo(stage);
              } else {
                grid[sneks[i].pieces[j].xGrid][sneks[i].pieces[j].yGrid] = 0;
              }
            }
          }
          sneks[i].neckDirection = sneks[i].nextMove;
        }
      } else {
        nextHeadPositions[i] = null;
        killSnek(i);
      }
    }
  }
  updateSneks(noOfSnakes);
}

function snekEatsItselfOrOtherSnek(snekIndex, nextX, nextY) {
  if (grid[nextX][nextY] === 1) {
    if (sneks[snekIndex].selfEat) { // check if another snek
      for (let i = 0; i < Object.keys(sneks[snekIndex].pieces).length; i++) {
        if (nextX === sneks[snekIndex].pieces[i].xGrid && nextY === sneks[snekIndex].pieces[i].yGrid) {
          return false;
        }
      }
    } else { // TODO: this logic broke fam, snek goes straight through other snek
      return true;
    }
  }
  return false;
}

function snekEatsFood(nextX, nextY) {
  return drops.food !== null && nextX === drops.food.xGrid && nextY === drops.food.yGrid;

}

function eatFood(snekIndex, x, y, newIndex) {
  let body = makeSnekBody(snekIndex, newIndex - 1);
  addPieceToTail(body, snekIndex, x, y, newIndex);
  removeItemFromStage(drops.food);
  drops.food = null;
}

function snekSpeedsUp(x, y) {
  return drops.speedup !== null && x === drops.speedup.xGrid && y === drops.speedup.yGrid;
}

function snekSlowsDown(x, y) {
  return drops.slowdown !== null && x === drops.slowdown.xGrid && y === drops.slowdown.yGrid;
}

function snekSelfEats(x, y) {
  return drops.selfEat !== null && x === drops.selfEat.xGrid && y === drops.selfEat.yGrid;
}

function absorbSelfEat(snekIndex) {
  if (sneks[snekIndex].selfEat) {
    sneks[snekIndex].selfEat = false;
    sneks[snekIndex].selfEatPiece.removeFrom(sneks[snekIndex].pieces[0]);
  } else {
    sneks[snekIndex].selfEat = true;
    let mse = createMiniSelfEat();
    mse.center(sneks[snekIndex].pieces[0]);
    sneks[snekIndex].selfEatPiece = mse;
  }
  removeItemFromStage(drops.selfEat);
  drops.selfEat = null;
  stage.update();
}

function snekReflects(x, y) {
  return drops.reflection !== null && x === drops.reflection.xGrid && y === drops.reflection.yGrid;
}

function absorbReflection(snekIndex) {
  if (sneks[snekIndex].reflection) {
    sneks[snekIndex].reflection = false;
    let head = makeSnekHead(sneks[snekIndex].pieces[0].direction, sneks[snekIndex].selfEat, snekIndex);
    head.addTo(stage).pos(convertGridToCoord(sneks[snekIndex].headStartGridX), convertGridToCoord(sneks[snekIndex].headStartGridY));
    head.xGrid = sneks[snekIndex].pieces[0].xGrid;
    head.yGrid = sneks[snekIndex].pieces[0].yGrid;
    head.direction = sneks[snekIndex].pieces[0].direction;
    removeItemFromStage(sneks[snekIndex].pieces[0]);
    updateSnekPieces(snekIndex, 0, head);
    sneks[snekIndex].pieces[0] = head;
  } else {
    sneks[snekIndex].reflection = true;
    let invertedHead = makeInvertedHead(sneks[snekIndex].pieces[0].direction, sneks[snekIndex].selfEat, snekIndex);
    invertedHead.addTo(stage).pos(convertGridToCoord(sneks[snekIndex].headStartGridX), convertGridToCoord(sneks[snekIndex].headStartGridY));
    invertedHead.xGrid = sneks[snekIndex].pieces[0].xGrid;
    invertedHead.yGrid = sneks[snekIndex].pieces[0].yGrid;
    invertedHead.direction = sneks[snekIndex].pieces[0].direction;
    removeItemFromStage(sneks[snekIndex].pieces[0]);
    updateSnekPieces(snekIndex, 0, invertedHead);
    sneks[snekIndex].pieces[0] = invertedHead;
  }
  removeItemFromStage(drops.reflection);
  drops.reflection = null;
  stage.update();
}

function randomlyPlaceFood() {
  if (drops.food === null) {
    let freeCoords = getFreeCoords();
    let food = createFood();
    food.xGrid = freeCoords.x;
    food.yGrid = freeCoords.y;
    drops.food = food;
    addItemToStage(food);
  }
}

function randomlyPlaceDrops(testing) {
  if (testing) {
    let sd = createSlowdown();
    sd.xGrid = 10;
    sd.yGrid = 10;
    addItemToStage(sd);

    let r = createReflection();
    r.xGrid = 15;
    r.yGrid = 15;
    addItemToStage(r);

    let cf = createSelfEat();
    cf.xGrid = 18;
    cf.yGrid = 18;
    addItemToStage(cf);

    let mf = createMiniSelfEat();
    mf.xGrid = 17;
    mf.yGrid = 17;
    addItemToStage(mf);
  } else {
    if (drops.speedup === null || drops.slowdown === null || drops.selfEat === null || drops.reflection === null) {
      let res = Math.floor(Math.random() * Math.floor(10)); // TODO: set to 100 for live
      rezz[res]++;
      if (res === 0) { // placing drop
        let totalDrops = ["speedup", "slowdown", "selfEat", "reflection"];
        let nonPlacedDrops = populateNonPlacedDrops();

        let dropsToChooseFrom = totalDrops.filter(placedDrop => nonPlacedDrops.includes(placedDrop));

        if (dropsToChooseFrom.length > 0) {
          let result = Math.floor(Math.random() * Math.floor(dropsToChooseFrom.length));
          let dropToPlace = dropsToChooseFrom[result];
          if (dropToPlace === "speedup") {
            let su = createSpeedup();
            let freeCoords = getFreeCoords();
            su.xGrid = freeCoords.x;
            su.yGrid = freeCoords.y;
            drops.speedup = su;
            addItemToStage(su);
          } else if (dropToPlace === "slowdown") {
            let sd = createSlowdown();
            let freeCoords = getFreeCoords();
            sd.xGrid = freeCoords.x;
            sd.yGrid = freeCoords.y;
            drops.slowdown = sd;
            addItemToStage(sd);
          } else if (dropToPlace === "selfEat") {
            let se = createSelfEat();
            let freeCoords = getFreeCoords();
            se.xGrid = freeCoords.x;
            se.yGrid = freeCoords.y;
            drops.selfEat = se;
            addItemToStage(se);
          } else if (dropToPlace === "reflection") {
            let r = createReflection();
            let freeCoords = getFreeCoords();
            r.xGrid = freeCoords.x;
            r.yGrid = freeCoords.y;
            drops.reflection = r;
            addItemToStage(r);
          }
        }
      }
    }
    randomlyPlaceFood();
  }
}

function populateNonPlacedDrops() {
  let result = [];
  if (!drops.speedup) {
    result.push("speedup");
  }
  if (!drops.slowdown) {
    result.push("slowdown");
  }
  if (!drops.selfEat) {
    result.push("selfEat");
  }
  if (!drops.reflection) {
    result.push("reflection");
  }
  return result;
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
