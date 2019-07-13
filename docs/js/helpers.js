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
      enemy.width -= dmg
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

function detectPlayerEnemyCollisions(object) {
  let x = object.x
  let y = object.y
  let dmg = 10

  let allEnemies = []
  let isCollision = false
  enemies.map((enemy) => {
    if (x > enemy.minX && x < enemy.maxX && y > enemy.minY && y < enemy.maxY) {
      squareboy.health -= enemy.damage
      if (enemy.isKamikaze) {
        enemy.damage = 0
        enemy.health = 0
        enemy.width = 0
      }
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

// this.pointValue

function generateEnemyObject() {
  let x = getRandomInt(gameBoard.width - 150, 150)
  let y = getRandomInt(gameBoard.height - 150, 150)

  if (!showGameTitle && enemies.length < maxEnemyCount) {
    let circleSquad = getRandomInt(5, 1)

    for (let i = 1; i <= circleSquad; i++) {
      enemies.push(new Enemy(getRandomInt(200, 40), x, y, squareboy.x, squareboy.y))
      x = getRandomInt(gameBoard.width - 150, 150)
      y = getRandomInt(gameBoard.height - 150, 150)
    }
  }
}

function generatePlayerProjectileObject(mousePosX, mousePosY) {
  if (squareboyAmmo.ammoClip >= 8) {
    if (laser.paused) {
      laser.play();
    } else {
      laser.currentTime = 0
    }
    playerProjectiles.push(new PlayerAttackProjectile(10, 10, 'red', squareboy.x, squareboy.y, parseInt(mousePosX), parseInt(mousePosY)));
    squareboyAmmo.ammoClip -= 8;
  }
}

function randomizeEnemyMovement() {

}