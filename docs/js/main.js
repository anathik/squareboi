window.onload = () => {
  Game = new SquareboyGame()
  Game.startGame()
};

let enemyInterval = setInterval(() => {
  generateEnemyObject()
}, 3000)

let gameBoard = {
  canvas: document.getElementById('gameView'),
  start: function () {
    areMenusActive = true

    gameBoard.width = window.innerWidth
    gameBoard.height = window.innerHeight

    document.getElementsByTagName("canvas")[0].setAttribute("width", window.innerWidth);
    document.getElementsByTagName("canvas")[0].setAttribute("height", window.innerHeight);
    this.context = this.canvas.getContext("2d");
    this.frameNo = 0;
    this.interval = requestAnimationFrame(Game.updateGameArea);

    window.addEventListener('keydown', (e) => {
      e.preventDefault();
      gameBoard.keys = (gameBoard.keys || []);
      gameBoard.keys[e.keyCode] = (e.type === "keydown");

      if (gameBoard.keys && gameBoard.keys[controls.pause]) {
        if (!mainMenu.isActive) pauseMenu.toggleDisplay()
      }
    })
    window.addEventListener('keyup', (e) => {
      gameBoard.keys[e.keyCode] = (e.type === "keydown");
    })

  },
  stop: function () {

  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

class SquareboyGame {
  constructor() {
  }

  startGame() {
    squareboy = new Player(30, 30, "red", (window.innerWidth / 2) - 15, (window.innerHeight / 2) + 45);
    squareboyHealth = new HealthBar()
    squareboyPoints = new PlayerScore()
    squareboyAmmo = new AmmunitionBar()

    gameBoard.start();

    squareboyAmmoReloadInterval = setInterval(() => {
      if (squareboyAmmo.ammoClip <= 140 && !areMenusActive) {
        squareboyAmmo.ammoClip += 5
      }
    }, 1500);

    window.addEventListener('click', (e) => {
      mainMenu.isActive = false
      if (areMenusActive) {
        areMenusActive = false
        playMusic()
      }
      const mousePos = {
        x: e.clientX,
        y: e.clientY
      };

      generatePlayerProjectileObject(mousePos.x, mousePos.y)
    })
  }

  updateGameArea() {
    let allEnemies = []
    let newPlayerProjectiles = []

    if (areMenusActive) {
      mainMenu.updateDisplay()
      pauseMenu.updateDisplay()
      defeatedScreen.updateDisplay()

      if (mainMenu.isActive) {
        squareboy.newPos()
        squareboy.update()
      }

    } else {
      gameBoard.clear();

      enemies.map((enemy) => {
        if (enemy.x > (gameBoard.width - (enemy.width)) || enemy.x < + (enemy.width)) {
          enemy.width -= 5
          enemy.health -= 5
          enemy.moveAngle = calculateAngle(enemy.x, enemy.y, squareboy.x, squareboy.y) + 90;
        }
        if (enemy.y > (gameBoard.height - (enemy.width)) || enemy.y < + (enemy.width)) {
          enemy.width -= 5
          enemy.health -= 5
          enemy.moveAngle = calculateAngle(enemy.x, enemy.y, squareboy.x, squareboy.y) + 90;
        }

        if (enemy.health > 25) {
          allEnemies.push(enemy)
        } else {
          squareboyAmmo.ammoClip <= 130 ? squareboyAmmo.ammoClip += 20 : squareboyAmmo.ammoClip = 150
          squareboy.health <= 145 ? squareboy.health += 5 : squareboy.health = 150
        }
      })
      enemies = allEnemies

      // Squareboy
      squareboy.moveAngle = 0;
      squareboy.speed = 0;

      if (areMenusActive) {
        squareboy.speed = 0;
      } else {
        squareboy.speed = 8;
        squareboyHealth.update()
        squareboyPoints.update(1)
        squareboyAmmo.update()
      }

      if (!areMenusActive) {
        if (gameBoard.keys && gameBoard.keys[controls.left]) { squareboy.moveAngle = -5; }
        if (gameBoard.keys && gameBoard.keys[controls.right]) { squareboy.moveAngle = 5; }
        if (gameBoard.keys && gameBoard.keys[controls.up]) { squareboy.speed = 10; }
        if (gameBoard.keys && gameBoard.keys[controls.down]) { squareboy.speed = 6; }
        if (gameBoard.keys && gameBoard.keys[controls.action]) { squareboy.color = 'white'; squareboy.speed = 16; } else {
          squareboy.color = 'red'
        }
      }

      for (let i = 0; i < playerProjectiles.length; i++) {
        if (playerProjectiles && playerProjectiles[i]) { playerProjectiles[i].newPos(); }
        if (playerProjectiles && playerProjectiles[i]) { playerProjectiles[i].update(); }
      }


      if (playerProjectiles.length > 0) {
        playerProjectiles.map(async (projectile) => {
          if (await !detectProjectileEnemyCollisions(projectile)) {
            newPlayerProjectiles.push(projectile)
          }
        })
        playerProjectiles = newPlayerProjectiles
      }

      squareboy.newPos()
      squareboy.update()
      detectPlayerEnemyCollisions(squareboy)

      for (let i = 0; i < enemies.length; i++) {
        if (enemies && enemies[i]) { enemies[i].newPos(); }
        if (enemies && enemies[i]) { enemies[i].update(); }
      }
    }

    // Recursively updating frames.
    requestAnimationFrame(Game.updateGameArea)
  }
};