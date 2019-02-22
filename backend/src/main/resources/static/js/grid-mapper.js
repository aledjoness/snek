// let stage;
// let stageW;
// let stageH;
//
// function init_grid_mapper(_stage, _stageW, _stageH) {
//   stage = _stage;
//   stageW = _stageW;
//   stageH = _stageH;
// }

function convertGridToCoord(tile) {
  // if (tile < 0 || tile > stageW) {
  //   return null;
  // }
  return (tile * 36) + 3; // now round up or down ...
}

// function convertGridToCoord(tile) {
//   if (tile < 0 || tile > stageW) {
//     return null;
//   }
//   let modVal = tile % 36; // now round up or down ...
//   return Math.floor(modVal);
// }