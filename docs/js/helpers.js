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
function detectProjectileEnemyCollisions(object) {
  let x = object.x
  let y = object.y
  let dmg = object.damage

  let allEnemies = []
  let isCollision = false
  enemies.map((enemy) => {
    if (x > enemy.minX && x < enemy.maxX && y > enemy.minY && y < enemy.maxY) {
      squareboyAmmo.ammoClip += 2
      enemy.health -= dmg
      allEnemies.push(enemy)
      isCollision = true
      return
    } else {
      allEnemies.push(enemy)
    }
  })
  enemies = allEnemies
  return isCollision;
}

// Returns Boolean
function generateEnemyObject() {
  let x = getRandomInt(gameBoard.width - 150, 150)
  let y = getRandomInt(gameBoard.height - 150, 150)

  if (!showGameTitle && enemies.length < maxEnemyCount) enemies.push(new Enemy(getRandomInt(200, 40), x, y, squareboy.x, squareboy.y))
}

function randomizeObjectMovements() {
  console.error('enemies', enemies)
}