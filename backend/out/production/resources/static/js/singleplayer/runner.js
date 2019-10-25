function makeRunnerHead(direction) {
  let head = new Rectangle(37, 37, "green");
  let eye1 = new Rectangle(4, 4, "black");
  let eye2 = new Rectangle(4, 4, "black");

  positionEyes(head, eye1, eye2, direction);

  head.eye1 = eye1;
  head.eye2 = eye2;

  // if (selfEat) {
  //   sneks[snekIndex].selfEatPiece.center(head);
  // }
  return head;
}

function makeInvertedHead(direction, selfEat, snekIndex) {
  let head = new Rectangle(37, 37, "black");
  let eye1 = new Rectangle(4, 4, "red");
  let eye2 = new Rectangle(4, 4, "red");

  positionEyes(head, eye1, eye2, direction);

  head.eye1 = eye1;
  head.eye2 = eye2;

  if (selfEat) {
    sneks[snekIndex].selfEatPiece.center(head);
  }
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

function updateHeadDirection(head, newDirection, snekIndex) {
  if (newDirection === "Left") {
    head.direction = leftDirection(head.direction);
  } else if (newDirection === "Right") {
    head.direction = rightDirection(head.direction);
  } else if (newDirection === "Opposite") {
    head.direction = oppositeDirection(head.direction);
  }
  sneks[snekIndex].nextMove = head.direction;
  positionEyes(head, head.eye1, head.eye2, head.direction);
  stage.update();
}

function updateHeadDirectionDirectly(snekIndex, newDirection) {
  sneks[snekIndex].pieces[0].direction = newDirection;
  sneks[snekIndex].nextMove = newDirection;
  positionEyes(sneks[snekIndex].pieces[0], sneks[snekIndex].pieces[0].eye1,
      sneks[snekIndex].pieces[0].eye2, sneks[snekIndex].pieces[0].direction);
}

function positionEyes(head, eye1, eye2, direction) {
  eye1.center(head);
  eye2.center(head);
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
  head.eye1 = eye1;
  head.eye2 = eye2;
}
