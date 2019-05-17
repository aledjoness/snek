function calculateNextCpuHeadDirection(snekIndex) {
  if ((sneks[snekIndex].neckDirection === Direction.NORTH && sneks[snekIndex].pieces[0].yGrid === 1) ||
      (sneks[snekIndex].neckDirection === Direction.EAST && sneks[snekIndex].pieces[0].xGrid === 33) ||
      (sneks[snekIndex].neckDirection === Direction.SOUTH && sneks[snekIndex].pieces[0].yGrid === 17) ||
      (sneks[snekIndex].neckDirection === Direction.WEST && sneks[snekIndex].pieces[0].xGrid === 1)) {
    turnCpuHead(snekIndex, "Left");
  }
}

function turnCpuHead(snekIndex, newDirection) {
  updateHeadDirection(sneks[snekIndex].pieces[0], newDirection, snekIndex);
}