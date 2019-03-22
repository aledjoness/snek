function makeSnekHead(direction) {
  let head = new zim.Rectangle(37, 37, "red");
  let eye1 = new zim.Rectangle(4, 4, "black");
  let eye2 = new zim.Rectangle(4, 4, "black");

  positionEyes(head, eye1, eye2, direction);

  head.eye1 = eye1;
  head.eye2 = eye2;
  return head;
}

function makeSnekBody(snekIndex, jValue) {
  let bodyColour = (jValue % 2 === 0 ? sneks[snekIndex].colourOne : sneks[snekIndex].colourTwo);
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
  console.log("Adding piece to " + snekIndex + " at " + x + ", " + y);

  snekBody.addTo(stage).pos(convertGridToCoord(x), convertGridToCoord(y));

  updateSnekPieces(snekIndex, newIndex, snekBody);
}

function moveSnekPiece(snekBody, newGridX, newGridY) {
  //zog("Snek bodyX: " + snekBody.x + " snek bodyY: " + snekBody.y);
  snekBody.pos(convertGridToCoord(newGridX), convertGridToCoord(newGridY));
}

function updateHeadDirection(head, newDirection) {
  if (newDirection === "Left") {
    //zog("Old head direction: " + head.direction);
    head.direction = leftDirection(head.direction);
    //zog("New head direction: " + head.direction);
  } else if (newDirection === "Right") {
    //zog("Old head direction: " + head.direction);
    head.direction = rightDirection(head.direction);
    //zog("New head direction: " + head.direction);
  } else if (newDirection === "Opposite") {
    //zog("Old head direction: " + head.direction);
    head.direction = oppositeDirection(head.direction);
    //zog("New head direction: " + head.direction);
  }
  sneks[0].nextMove = head.direction;
  positionEyes(head, head.eye1, head.eye2, head.direction);
  stage.update();
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
