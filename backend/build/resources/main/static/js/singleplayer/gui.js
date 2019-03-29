let stage;
let stageW;
let stageH;

function init_gui(_stage, _stageW, _stageH, _noOfSneks) {
  stage = _stage;
  stageW = _stageW;
  stageH = _stageH;

  // init_grid_mapper(_stage, _stageW, _stageH);

  // 589145 94c185
  var backgroundColour = convertColor("#94c185", "rgba", 1);
  var canvasFrame = new zim.Rectangle({
    width: stageW,
    height: stageH,
    color: backgroundColour,
    borderColor: black,
    borderWidth: 6
  });
  canvasFrame.center(stage);

  // Add frame to ;
  printGrid();
  stage.update();

  init_controller(_noOfSneks);

  makeSnek(_noOfSneks);

  // init_controller(_noOfSneks);

  stage.update();
}

function printGrid() {
  var line;
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
    let snekHead = makeSnekHead(sneks[i].headStartDirection);
    snekHead.addTo(stage).pos(convertGridToCoord(sneks[i].headStartGridX), convertGridToCoord(sneks[i].headStartGridY));
    snekHead.xGrid = sneks[i].headStartGridX;
    snekHead.yGrid = sneks[i].headStartGridY;
    snekHead.direction = sneks[i].headStartDirection;
    updateSnekPieces(i, 0, snekHead);
    let prevGridTileX = sneks[i].headStartGridX;
    let prevGridTileY = sneks[i].headStartGridY;
    for (let j = 0; j < 4; j++) {
      let body = makeSnekBody(i, j);
      let prevGridTileCoords = attachSnekPiece(body, prevGridTileX, prevGridTileY, oppositeDirection(sneks[i].headStartDirection));
      prevGridTileX = prevGridTileCoords.newPrevGridTileX;
      prevGridTileY = prevGridTileCoords.newPrevGridTileY;
      body.xGrid = prevGridTileX;
      body.yGrid = prevGridTileY;
      updateSnekPieces(i, j+1, body);
    }
  }
}

function turnHead(newDirection) {
  updateHeadDirection(sneks[0].pieces[0], newDirection);
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


function killSnek(snekIndex) {
  let snekToTheSlaughter = sneks[snekIndex];
  sneks[snekIndex] = null;

  for (let i = 0; i < Object.keys(snekToTheSlaughter.pieces).length; i++) {
    snekToTheSlaughter.pieces[i].animate({
      props:{alpha:0},
      time:450,
      from:false
    });
  }

  // If singleplayer - stop game
  gameOver = true;
}


