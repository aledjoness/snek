let noOfSnakes = 0;
let gameOver = false;
let rezz;
let grid;

const X_AXIS_LEN = 35;
const Y_AXIS_LEN = 19;

function init_controller() {
  // rezz = [];
  // for (let i = 0; i < 100; i++) {
  //   rezz[i] = 0;
  // }
  initGrid();
  // countdown();
  let head = makeRunnerHead(Direction.EAST);
  head.center(stage);
  // head.xGrid =
  stage.update();
  window.addEventListener("keydown", processKeyPressEvent);

}

function initGrid() {
  grid = new Array(X_AXIS_LEN);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(Y_AXIS_LEN);
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

  if (keyPressed === "ArrowLeft") {
    turnHead(Direction.WEST)
  } else if (keyPressed === "ArrowRight") {
    turnHead(Direction.EAST)
  } else if (keyPressed === "ArrowDown") {
    turnHead(Direction.SOUTH)
  } else if (keyPressed === "ArrowUp") {
    turnHead(Direction.NORTH)
  }
  moveHeadOneSpace();
};

function getFreeCoords() {
  let proposedX = Math.floor(Math.random() * Math.floor(X_AXIS_LEN));
  let proposedY = Math.floor(Math.random() * Math.floor(Y_AXIS_LEN));

  while (squareNotFree(proposedX, proposedY)) {
    proposedX = Math.floor(Math.random() * Math.floor(X_AXIS_LEN));
    proposedY = Math.floor(Math.random() * Math.floor(Y_AXIS_LEN));
  }
  return {x: proposedX, y: proposedY};
}

function squareNotFree(proposedX, proposedY) {
  // Go through each snek piece and see if it resides at (proposedX, proposedY)
  for (let i = 0; i < noOfSnakes; i++) {
    if (snekIsAliveAndWell(i)) {
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
  } else if (direction === Direction.SOUTH && (currentY + 1 > Y_AXIS_LEN - 1)) {
    return false;
  } else if (direction === Direction.EAST && (currentX + 1 > X_AXIS_LEN - 1)) {
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
      result.nextY = Y_AXIS_LEN - 1;
    }
  } else if (direction === Direction.SOUTH) {
    result.nextY = (result.nextY + 1) % Y_AXIS_LEN;
  } else if (direction === Direction.EAST) {
    result.nextX = (result.nextX + 1) % X_AXIS_LEN;
  } else if (direction === Direction.WEST) {
    if (--result.nextX < 0) {
      result.nextX = X_AXIS_LEN - 1;
    }
  }
  return result;
}
