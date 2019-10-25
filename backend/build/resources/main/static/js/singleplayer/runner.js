function makeRunnerHead(direction) {
  let head = new Rectangle(35, 35, "green");
  runner.head = head;
  let eye1 = new Rectangle(4, 4, "black");
  let eye2 = new Rectangle(4, 4, "black");

  positionEyes(eye1, eye2, direction);

  head.eye1 = eye1;
  head.eye2 = eye2;

  // snekHead.xGrid = sneks[i].headStartGridX;
  // snekHead.yGrid = sneks[i].headStartGridY;

  // if (selfEat) {
  //   sneks[snekIndex].selfEatPiece.center(head);
  // }
  return head;
}

function makeInvertedHead(direction, selfEat, snekIndex) {
  let head = new Rectangle(36, 36, "black");
  let eye1 = new Rectangle(4, 4, "red");
  let eye2 = new Rectangle(4, 4, "red");

  positionEyes(eye1, eye2, direction);

  head.eye1 = eye1;
  head.eye2 = eye2;

  // if (selfEat) {
  //   sneks[snekIndex].selfEatPiece.center(head);
  // }
  return head;
}

function makeSnekBody(snekIndex, nextPieceLength) {
  let bodyColour = (nextPieceLength % 2 === 0 ? sneks[snekIndex].colourOne : sneks[snekIndex].colourTwo);
  return new Rectangle(37, 37, bodyColour); // either 36, 37 or 37, 36 or 37, 37 ...
}

function attachSnekPiece(snekBody, prevGridTileX, prevGridTileY, directionToAddTo) {
  if (directionToAddTo === Direction.NORTH) {
    snekBody.addTo(stage).pos(convertGridToCoord(prevGridTileX), convertGridToCoord(prevGridTileY - 1));
    prevGridTileY--;
  } else if (directionToAddTo === Direction.EAST) {
    snekBody.addTo(stage).pos(convertGridToCoord(prevGridTileX + 1), convertGridToCoord(prevGridTileY));
    prevGridTileX++;
  } else if (directionToAddTo === Direction.SOUTH) {
    snekBody.addTo(stage).pos(convertGridToCoord(prevGridTileX), convertGridToCoord(prevGridTileY + 1));
    prevGridTileY++;
  } else if (directionToAddTo === Direction.WEST) {
    snekBody.addTo(stage).pos(convertGridToCoord(prevGridTileX - 1), convertGridToCoord(prevGridTileY));
    prevGridTileX--;
  }
  return {newPrevGridTileX: prevGridTileX, newPrevGridTileY: prevGridTileY};
}

function addPieceToTail(snekBody, snekIndex, x, y, newIndex) {
  snekBody.addTo(stage).pos(convertGridToCoord(x), convertGridToCoord(y)); // need to adjust x/y value by 1/-1
  snekBody.xGrid = x;
  snekBody.yGrid = y;
  updateSnekPieces(snekIndex, newIndex, snekBody);
}

function moveSnekPiece(snekBody, newGridX, newGridY) {
  snekBody.pos(convertGridToCoord(newGridX), convertGridToCoord(newGridY));
}

function moveRunnerHead(newGridX, newGridY) {
  runner.head.pos(convertGridToCoord(newGridX), convertGridToCoord(newGridY));
}

function updateHeadDirection(newDirection) {
  positionEyes(runner.head.eye1, runner.head.eye2, newDirection);
  stage.update();
}

function moveHeadOneSpace() {

}

// function updateHeadDirectionDirectly(snekIndex, newDirection) {
//   sneks[snekIndex].pieces[0].direction = newDirection;
//   sneks[snekIndex].nextMove = newDirection;
//   positionEyes(sneks[snekIndex].pieces[0], sneks[snekIndex].pieces[0].eye1,
//       sneks[snekIndex].pieces[0].eye2, sneks[snekIndex].pieces[0].direction);
// }

function positionEyes(eye1, eye2, direction) {
  eye1.center(runner.head);
  eye2.center(runner.head);
  if (direction === Direction.NORTH) {
    eye1.mov(8, -12); // 12 or 16
    eye2.mov(-8, -12);
  } else if (direction === Direction.EAST) {
    eye1.mov(12, 8); // 12 or 16
    eye2.mov(12, -8);
  } else if (direction === Direction.SOUTH) {
    eye1.mov(8, 12); // 12 or 16
    eye2.mov(-8, 12);
  } else if (direction === Direction.WEST) {
    eye1.mov(-12, 8); // 12 or 16
    eye2.mov(-12, -8);
  }
  runner.head.eye1 = eye1;
  runner.head.eye2 = eye2;
}
