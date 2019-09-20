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
  let timeoutMillis = 500;
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
          window.addEventListener("keydown", processKeyPressEvent);
        })
      })
    })
  })
}

function gameClock() {
  let clock = interval(100, function () {

    for (let i = 1; i < noOfSnakes; i++) {
      calculateNextCpuHeadDirection(i);
    }

    for (let i = 0; i < noOfSnakes; i++) {
      makeSnekMove(i);
    }

    updateSneks(noOfSnakes);

    makeAdditionalSnekMoves();

    randomlyPlaceDrops(false);

    if (gameOver) {
      clock.clear();
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

function makeSnekMove(snekIndex) {
  let nextHeadPosition = {};
  if (sneks[snekIndex] !== null && !sneks[snekIndex].dead) {
    if (snekShouldMove(snekIndex)) {
      if (nextMoveIsInBounds(sneks[snekIndex].pieces[0].xGrid, sneks[snekIndex].pieces[0].yGrid, sneks[snekIndex].nextMove, sneks[snekIndex].reflection)) {
        nextHeadPosition[snekIndex] = nextHeadGridLocation(sneks[snekIndex].pieces[0].xGrid, sneks[snekIndex].pieces[0].yGrid, sneks[snekIndex].nextMove);

        //printUnderlyingGrid(grid);

        // So this gets evaluated first, maybe need to keep grid ==1 for snek just died? see if there was a head on collision
        // or just check for head on collision???
        if (snekEatsItselfOrOtherSnek(snekIndex, nextHeadPosition[snekIndex].nextX, nextHeadPosition[snekIndex].nextY)) {
          if (snekInvolvedInHeadOnCollision(snekIndex, nextHeadPosition[snekIndex].nextX, nextHeadPosition[snekIndex].nextY)) {
            killSneksInvolvedInHeadOnCollision(snekIndex, nextHeadPosition[snekIndex].nextX, nextHeadPosition[snekIndex].nextY);
          } else {
            killSneks([snekIndex]);
          }
        } else {
          grid[nextHeadPosition[snekIndex].nextX][nextHeadPosition[snekIndex].nextY] = 1;

          let growSnek = false;
          if (snekEatsFood(nextHeadPosition[snekIndex].nextX, nextHeadPosition[snekIndex].nextY)) {
            growSnek = true;
          }

          if (snekSpeedsUp(nextHeadPosition[snekIndex].nextX, nextHeadPosition[snekIndex].nextY)) {
            absorbSpeedUp(snekIndex);
          }

          if (snekSlowsDown(nextHeadPosition[snekIndex].nextX, nextHeadPosition[snekIndex].nextY)) {
            absorbSlowDown(snekIndex);
          }

          if (snekSelfEats(nextHeadPosition[snekIndex].nextX, nextHeadPosition[snekIndex].nextY)) {
            absorbSelfEat(snekIndex);
          }

          if (snekReflects(nextHeadPosition[snekIndex].nextX, nextHeadPosition[snekIndex].nextY)) {
            absorbReflection(snekIndex);
          }

          let nextXMove = nextHeadPosition[snekIndex].nextX, nextYMove = nextHeadPosition[snekIndex].nextY;
          for (let j = 0; j < Object.keys(sneks[snekIndex].pieces).length; j++) {
            let prevXPlacement = sneks[snekIndex].pieces[j].xGrid, prevYPlacement = sneks[snekIndex].pieces[j].yGrid;

            sneks[snekIndex].pieces[j].xGrid = nextXMove;
            sneks[snekIndex].pieces[j].yGrid = nextYMove;

            nextXMove = prevXPlacement;
            nextYMove = prevYPlacement;

            if (j === Object.keys(sneks[snekIndex].pieces).length - 1) {
              if (growSnek) {
                eatFood(snekIndex, nextXMove, nextYMove, j + 1);
                growSnek = false;
                sneks[snekIndex].pieces[0].addTo(stage);
              } else {
                grid[nextXMove][nextYMove] = 0;
              }
            }
          }
          sneks[snekIndex].neckDirection = sneks[snekIndex].nextMove;
        }
      } else {
        nextHeadPosition[snekIndex] = null;
        killSneks([snekIndex]);
      }
    }
  }
}

function makeAdditionalSnekMoves() {
  for (let i = 0; i < noOfSnakes; i++) {
    if (sneks[i].speedup) {
      if (sneks[i].speedup % 2 !== 0) {
        timeout(50, () => {
          makeSnekMove(i);
          updateSingleSnek(i);
        });
      }
      sneks[i].speedup--;
    }
    if (sneks[i].speedup === 0) {
      sneks[i].speedup = null;
    }
  }
}

function snekShouldMove(snekIndex) {
  if (sneks[snekIndex].slowdown) {
    if (sneks[snekIndex].slowdown % 2 === 0) {
      sneks[snekIndex].slowdown--;
      return false;
    } else {
      sneks[snekIndex].slowdown--;
      return true;
    }
  }
  if (sneks[snekIndex].slowdown === 0) {
    sneks[snekIndex].slowdown = null;
  }
  return true;
}

function snekEatsItselfOrOtherSnek(snekIndex, nextX, nextY) {
  if (grid[nextX][nextY] === 1) {
    if (sneks[snekIndex].selfEat) { // check if another snek
      for (let i = 0; i < Object.keys(sneks[snekIndex].pieces).length; i++) {
        if (nextX === sneks[snekIndex].pieces[i].xGrid && nextY === sneks[snekIndex].pieces[i].yGrid) {
          return false;
        }
      }
      return true;
    } else {
      return true;
    }
  }
  return false;
}

function snekInvolvedInHeadOnCollision(snekIndex, nextX, nextY) {
  for (let i = 0; i < noOfSnakes; i++) {
    if (i !== snekIndex
        && !sneks[i].dead
        && sneks[i].pieces[0].xGrid === nextX
        && sneks[i].pieces[0].yGrid === nextY
        && sneks[snekIndex].neckDirection === oppositeDirection(sneks[i].neckDirection)) {
      return true;
    }
  }
  return false;
}

function killSneksInvolvedInHeadOnCollision(snekIndex, nextX, nextY) {
  for (let i = 0; i < noOfSnakes; i++) {
    if (i !== snekIndex
        && !sneks[i].dead
        && sneks[i].pieces[0].xGrid === nextX
        && sneks[i].pieces[0].yGrid === nextY
        && sneks[snekIndex].neckDirection === oppositeDirection(sneks[i].neckDirection)) {
      killSneks([snekIndex, i]);
    }
  }
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

function absorbSpeedUp(snekIndex) {
  if (sneks[snekIndex].slowdown) {
    sneks[snekIndex].slowdown = null;
  }
  sneks[snekIndex].speedup = 60;
  removeItemFromStage(drops.speedup);
  drops.speedup = null;
  stage.update();
}

function absorbSlowDown(snekIndex) {
  if (sneks[snekIndex].speedup) {
    sneks[snekIndex].speedup = null;
  }
  sneks[snekIndex].slowdown = 60;
  removeItemFromStage(drops.slowdown);
  drops.slowdown = null;
  stage.update();
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
  let head;
  if (sneks[snekIndex].reflection) {
    sneks[snekIndex].reflection = false;
    head = makeSnekHead(sneks[snekIndex].pieces[0].direction, sneks[snekIndex].selfEat, snekIndex);
  } else {
    sneks[snekIndex].reflection = true;
    head = makeInvertedHead(sneks[snekIndex].pieces[0].direction, sneks[snekIndex].selfEat, snekIndex);
  }
  head.addTo(stage).pos(convertGridToCoord(sneks[snekIndex].headStartGridX), convertGridToCoord(sneks[snekIndex].headStartGridY));
  head.xGrid = sneks[snekIndex].pieces[0].xGrid;
  head.yGrid = sneks[snekIndex].pieces[0].yGrid;
  head.direction = sneks[snekIndex].pieces[0].direction;
  removeItemFromStage(sneks[snekIndex].pieces[0]);
  updateSnekPieces(snekIndex, 0, head);

  sneks[snekIndex].pieces[0] = head;
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

function nextMoveIsInBounds(currentX, currentY, direction, canReflect) {
  if (canReflect) {
    return true;
  }
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
    if (--result.nextY < 0) {
      result.nextY = 18;
    }
  } else if (direction === Direction.SOUTH) {
    result.nextY = (result.nextY + 1) % 19;
  } else if (direction === Direction.EAST) {
    result.nextX = (result.nextX + 1) % 35;
  } else if (direction === Direction.WEST) {
    if (--result.nextX < 0) {
      result.nextX = 34;
    }
  }
  return result;
}
