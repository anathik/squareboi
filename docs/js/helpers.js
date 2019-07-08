function getRandomInt(max, min) {
  min = min ? Math.ceil(min) : 0
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function calculateAngle(cx, cy, ex, ey) {
  var dy = ey - cy;
  var dx = ex - cx;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  //if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}

// Returns Boolean
function detectCollision(primaryObjectSet, secondaryObjectSet) {

}

// Returns Boolean
function detectBoundaryInfraction(primaryObjectSet, secondaryObjectSet) {

}

function randomizeObjectMovements() {
  console.error('enemies', enemies)
}