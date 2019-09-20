function calculateNextCpuHeadDirection(snekIndex) {

  turnCpuHead(snekIndex, nextHeadDirection(snekIndex));

}

function turnCpuHead(snekIndex, newDirection) {
  // updateHeadDirection(sneks[snekIndex].pieces[0], newDirection, snekIndex);
  updateHeadDirectionDirectly(snekIndex, newDirection);
}

function inImmediateDanger(snekIndex) {
  return (sneks[snekIndex].neckDirection === Direction.NORTH && sneks[snekIndex].pieces[0].yGrid === 0) ||
      (sneks[snekIndex].neckDirection === Direction.NORTH && sneks[snekIndex].pieces[0].yGrid === 1) ||
      (sneks[snekIndex].neckDirection === Direction.EAST && sneks[snekIndex].pieces[0].xGrid === 33) ||
      (sneks[snekIndex].neckDirection === Direction.EAST && sneks[snekIndex].pieces[0].xGrid === 34) ||
      (sneks[snekIndex].neckDirection === Direction.SOUTH && sneks[snekIndex].pieces[0].yGrid === 17) ||
      (sneks[snekIndex].neckDirection === Direction.SOUTH && sneks[snekIndex].pieces[0].yGrid === 18) ||
      (sneks[snekIndex].neckDirection === Direction.WEST && sneks[snekIndex].pieces[0].xGrid === 0) ||
      (sneks[snekIndex].neckDirection === Direction.WEST && sneks[snekIndex].pieces[0].xGrid === 1);
}

function nextHeadDirection(snekIndex) {
  let bestWeightedDirection = {};
  bestWeightedDirection.direction = sneks[snekIndex].neckDirection;
  bestWeightedDirection.weight = 0;

  let totalDirections = [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST];

  let impossibleDirections = [oppositeDirection(sneks[snekIndex].neckDirection)];

  let possibleDirections = totalDirections.filter(direction => !impossibleDirections.includes(direction));

  console.log("Possible directions: " + possibleDirections);

  possibleDirections.forEach(direction => {
    let weight = calculateTotalWeight(snekIndex, direction);
    if (weight > bestWeightedDirection.weight) {
      bestWeightedDirection.weight = weight;
      bestWeightedDirection.direction = direction;
    }
  });

  // Should give a weight to each direction choice - like a line of sight of 5 free squares is good, a box of 5 squared is excellent etc
  console.log("Turning " + bestWeightedDirection.direction + " with a weight of " + bestWeightedDirection.weight);
  return bestWeightedDirection.direction;
}

function calculateTotalWeight(snekIndex, direction) {
  // Need some nice maths-y function to compute how good the next move would be
  // based on grid position (if no go through walls), chance of crashing into another snek, chance of picking up good drop,
  // chance of picking up bad drop, chance of causing another snek to crash into us
  // All of these things can affect the weight, just do a combination of +/- and you get a weight
  let weight = 0;
  //weight += calculateBoundaryWeight(snekIndex, direction);
  weight += calculateCollidingWeight(snekIndex, direction);
  return weight;
}

function calculateBoundaryWeight(snekIndex, direction) {
  if (sneks[snekIndex].reflection) {
    return 34; // possibly reconsider this
  } else {
    return calculateDistanceToBoundary(snekIndex, direction);
  }
}

function calculateDistanceToBoundary(snekIndex, direction) {
  if (direction === Direction.NORTH) {
    return sneks[snekIndex].pieces[0].yGrid;
  } else if (direction === Direction.EAST) {
    return 34 - sneks[snekIndex].pieces[0].xGrid;
  } else if (direction === Direction.SOUTH) {
    return 18 - sneks[snekIndex].pieces[0].yGrid;
  } else if (direction === Direction.WEST) {
    return sneks[snekIndex].pieces[0].xGrid;
  }
}

// Need to consider both reflection and self eat
// [11][10][11] ||
// [9] [8] [9]  ||    [1][3][5][7][9][11]
// [7] [6] [7]  ||  > [0][2][4][6][8][10]
// [5] [4] [5]  ||    [1][3][5][7][9][11]
// [3] [2] [3]  ||
// [1] [0] [1]  ||
//     /\
function calculateCollidingWeight(snekIndex, direction) {
  // TODO: calculate start grid x & y
  if (direction === Direction.NORTH) {
    let startGrid = {};
    startGrid.x = sneks[snekIndex].pieces[0].xGrid + 1;
    startGrid.y = sneks[snekIndex].pieces[0].yGrid - 1;

    return gridCollisionCalculation(snekIndex, Direction.NORTH, startGrid, 3, 6, calculateXCoefficient(Direction.NORTH), calculateYCoefficient(Direction.NORTH)); // is this not the same for most???
  }
}

function gridCollisionCalculation(snekIndex, direction, startGrid, colsToCheck, rowsToCheck, xCoefficient, yCoefficient) {
  let currentWeight = 0;
  if (direction === Direction.NORTH || direction === Direction.SOUTH) {
    for (let row = 0; row < rowsToCheck; row++) { // rowsToCheck = 6
      for (let col = 0; col < colsToCheck; col++) { // colsToCheck = 3

        let xScan = startGrid.x + (row * xCoefficient);
        let yScan = startGrid.y + (col * yCoefficient);

        // If to check boundaries/reflection
        if (!sneks[snekIndex].reflection) {
          if (xScan < 0 || xScan > 34 || yScan < 0 || yScan > 18) {
            console.log("ABORTING: nextX: " + xScan + " nextY: " + yScan);
            continue;
          }
        } else {
          xScan = calculateModuloXScan(xScan);
          yScan = calculateModuloYScan(yScan);
        }

        currentWeight = row * 2;

        if (grid[xScan][yScan] === 1) {
          if (sneks[snekIndex].selfEat) {
            for (let i = 0; i < Object.keys(sneks[snekIndex].pieces).length; i++) {
              if (xScan !== sneks[snekIndex].pieces[i].xGrid && yScan !== sneks[snekIndex].pieces[i].yGrid) {
                if (col === 1) {
                  return currentWeight;
                } else {
                  return currentWeight + 1;
                }
              }
            }
          } else {
            if (col === 1) {
              return currentWeight;
            } else {
              return currentWeight + 1;
            }
          }
        }
        if (row === rowsToCheck - 1 && col === colsToCheck - 1) {
          currentWeight = 12;
        }
      }
    }
  } else {
    for (let col = 0; col < rowsToCheck; col++) { // rowsToCheck = 6
      for (let row = 0; row < colsToCheck; row++) { // colsToCheck = 3

        currentWeight = col * 2;

        // x/yCoefficient = 1 or -1
        let xScan = startGrid.x + (col * xCoefficient);
        let yScan = startGrid.y + (row * yCoefficient);

        // If to check boundaries/reflection
        if (!sneks[snekIndex].reflection) {
          if (xScan < 0 || xScan > 34 || yScan < 0 || yScan > 18) {
            console.log("ABORTING: nextX: " + xScan + " nextY: " + yScan);
            continue;
          }
        } else {
          xScan = calculateModuloXScan(xScan);
          yScan = calculateModuloYScan(yScan);
        }

        if (grid[xScan][yScan] === 1) {
          if (sneks[snekIndex].selfEat) {
            for (let i = 0; i < Object.keys(sneks[snekIndex].pieces).length; i++) {
              if (xScan !== sneks[snekIndex].pieces[i].xGrid && yScan !== sneks[snekIndex].pieces[i].yGrid) {
                if (row === 1) {
                  return currentWeight;
                } else {
                  return currentWeight + 1;
                }
              }
            }
          }
        } else {
          if (row === 1) {
            return currentWeight;
          } else {
            return currentWeight + 1;
          }
        }
      }
    }
  }
  return currentWeight;
}

function calculateModuloXScan(baseX) {
  if (baseX < 0)
    return 34;
  if (baseX > 34)
    return 0;
  return baseX;
}

function calculateModuloYScan(baseY) {
  if (baseY < 0) {
    return 18;
  }
  if (baseY > 18) {
    return 0;
  }
  return baseY;
}

function calculateXCoefficient(direction) {
  if (direction === Direction.NORTH) {
    return 1;
  } else if (direction === Direction.EAST) {
    return 1;
  } else if (direction === Direction.SOUTH) {
    return -1;
  } else if (direction === Direction.WEST) {
    return -1;
  }
}

function calculateYCoefficient(direction) {
  if (direction === Direction.NORTH) {
    return -1;
  } else if (direction === Direction.EAST) {
    return value;
  } else if (direction === Direction.SOUTH) {
    return 0;
  } else if (direction === Direction.WEST) {
    return value * -1;
  }
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

function getPlayerSnekHead() {
  return sneks[0].pieces[0];
}