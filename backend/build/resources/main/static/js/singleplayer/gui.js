let stage;
let stageW;
let stageH;
let noOfSneks;

function init_gui(_stage, _stageW, _stageH, _noOfSneks) {
  stage = _stage;
  stageW = _stageW;
  stageH = _stageH;
  noOfSneks = _noOfSneks;

  let backgroundColour = convertColor("#94c185", "rgba", 1);
  let canvasFrame = new zim.Rectangle({
    width: stageW,
    height: stageH,
    color: backgroundColour,
    borderColor: black,
    borderWidth: 6
  });
  canvasFrame.center(stage);

  printGrid();

  init_controller(_noOfSneks);

  makeSnek(_noOfSneks);

  stage.update();
}

function printGrid() {
  let line;
  for (let i = 0; i < 35; i++) {
    line = new Rectangle(1, 684, convertColor("#589145", "rgba", 1));
    line.addTo(stage);
    line.pos(3 + (36 * (i + 1)), 3);
  }
  for (let i = 0; i < 18; i++) {
    line = new Rectangle(1260, 1, convertColor("#589145", "rgba", 1));
    line.addTo(stage);
    line.pos(3, 3 + (36 * (i + 1)));
  }
}

function makeSnek(_noOfSneks) {
  for (let i = 0; i < _noOfSneks; i++) {
    sneks[i].pieces = {};

    // TODO: make init snek default values method
    if (sneks[i].selfEat) {
      sneks[i].selfEat = false;
      sneks[i].selfEatPiece.removeFrom(sneks[i].pieces[0]);
      sneks[i].selfEatPiece = null;
    }
    sneks[i].slowdown = null;
    sneks[i].reflection = false;
    sneks[i].dead = false;

    let snekHead = makeSnekHead(sneks[i].headStartDirection, false, i);
    snekHead.addTo(stage).pos(convertGridToCoord(sneks[i].headStartGridX), convertGridToCoord(sneks[i].headStartGridY));
    snekHead.xGrid = sneks[i].headStartGridX;
    snekHead.yGrid = sneks[i].headStartGridY;
    snekHead.direction = sneks[i].headStartDirection;
    updateSnekPieces(i, 0, snekHead);
    sneks[i].neckDirection = sneks[i].neckStartDirection;
    sneks[i].nextMove = sneks[i].headStartDirection;
    let prevGridTileX = sneks[i].headStartGridX;
    let prevGridTileY = sneks[i].headStartGridY;
    for (let j = 0; j < 4; j++) {
      let body = makeSnekBody(i, j);
      let prevGridTileCoords = attachSnekPiece(body, prevGridTileX, prevGridTileY, oppositeDirection(sneks[i].headStartDirection));
      prevGridTileX = prevGridTileCoords.newPrevGridTileX;
      prevGridTileY = prevGridTileCoords.newPrevGridTileY;
      body.xGrid = prevGridTileX;
      body.yGrid = prevGridTileY;
      updateSnekPieces(i, j + 1, body);
    }
  }
}

function turnHead(newDirection) {
  updateHeadDirection(sneks[0].pieces[0], newDirection, 0);
}

function updateSneks(_noOfSnakes) {
  for (let i = 0; i < _noOfSnakes; i++) {
    if (sneks[i] !== null) {
      for (let j = 0; j < Object.keys(sneks[i].pieces).length; j++) {
        moveSnekPiece(sneks[i].pieces[j], sneks[i].pieces[j].xGrid, sneks[i].pieces[j].yGrid);
      }
    }
  }
  stage.update();
}

function updateSingleSnek(snekIndex) {
  if (sneks[snekIndex] !== null) {
    for (let j = 0; j < Object.keys(sneks[snekIndex].pieces).length; j++) {
      moveSnekPiece(sneks[snekIndex].pieces[j], sneks[snekIndex].pieces[j].xGrid, sneks[snekIndex].pieces[j].yGrid);
    }
  }
  stage.update();
}

function addItemToStage(item) {
  let square = new Rectangle(37, 37, red);
  square.addTo(stage);
  square.pos(convertGridToCoord(item.xGrid), convertGridToCoord(item.yGrid));
  item.center(square);
  item.addTo(stage);
  item.removeFrom(square);
  square.removeFrom(stage);
  stage.update();
}

function removeItemFromStage(item) {
  item.removeFrom(stage);
  stage.update();
}

// TODO: clean up grid after death
function killSnek(snekIndex) {
  let snekToTheSlaughter = sneks[snekIndex];
  sneks[snekIndex].dead = true;

  for (let i = 0; i < Object.keys(snekToTheSlaughter.pieces).length; i++) {
    grid[snekToTheSlaughter.pieces[i].xGrid][snekToTheSlaughter.pieces[i].yGrid] = 0;
    snekToTheSlaughter.pieces[i].animate({
      props: {alpha: 0},
      time: 450,
      from: false
    });
  }

  let noOfDead = 0;
  for (let i = 0; i < noOfSneks; i++) {
    if (sneks[i].dead) {
      noOfDead++;
    }
  }
  if (sneks[0].dead || noOfDead === noOfSneks || noOfDead === noOfSneks - 1) {
    gameOver = true;
  }

  if (gameOver) {
    for (let i = 0; i < noOfSneks; i++) {
      if (!sneks[i].dead) {
        wiggleSnek(i);
      }
    }
  }
}

function wiggleSnek(snekIndex) {
  console.log(snekIndex + " is the winner!");

  for (let i = 0; i < Object.keys(sneks[snekIndex].pieces).length; i++) {
    if (i % 2 === 0) {
      sneks[snekIndex].pieces[i].wiggle("x", sneks[snekIndex].pieces[i].x, 10, 30, 300, 1000);
    } else {
      sneks[snekIndex].pieces[i].wiggle("y", sneks[snekIndex].pieces[i].y, 10, 30, 300, 1000);
    }
  }
}

function playAgain() {
  let playAgainLab = new Label({
    text: "Play Again", size: 50, color: "white", outlineColor: "black"
  });
  let pa = new Button({
    width: 300, height: 110, label: playAgainLab, backgroundColor: convertColor("#0042ad", "rgba", 1),
    rollBackgroundColor: convertColor("#1a62d8", "rgba", 1), borderColor: "black", borderWidth: 3
  });
  pa.center(stage);
  pa.on("click", function () {
    stage.removeAllChildren();
    stage.update();

    gameOver = false;
    drops.food = null;
    drops.speedup = null;
    drops.slowdown = null;
    drops.selfEat = null;
    drops.reflection = null;
    init_gui(stage, stageW, stageH, noOfSneks);
  });
}


