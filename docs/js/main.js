window.onload = () => {
  Game = new SquareboyGame()
  Game.startGame()
};

let enemyInterval = setInterval(() => {
  generateEnemyObject()
}, getRandomInt(3000, 1500))

let gameBoard = {
  canvas: document.getElementById('gameView'),
  start: function () {
    showGameTitle = true

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
    let ctx = gameBoard.canvas.getContext("2d");
    squareboy = new Player(30, 30, "red", (window.innerWidth / 2) - 15, (window.innerHeight / 2) + 45);
    squareboyHealth = new HealthBar()
    squareboyPoints = new PlayerScore()
    squareboyAmmo = new AmmunitionBar()

    gameBoard.start();

    squareboyAmmoReloadInterval = setInterval(() => {
      if (squareboyAmmo.ammoClip <= 140 && !showGameTitle) {
        squareboyAmmo.ammoClip += 5
      }
    }, 1500);

    window.addEventListener('click', (e) => {
      if (showGameTitle) {
        showGameTitle = false
        playMusic()
      }
      const mousePos = {
        x: e.clientX,
        y: e.clientY
      };

      if (squareboyAmmo.ammoClip >= 6) {
        if (laser.paused) {
          laser.play();
        } else {
          laser.currentTime = 0
        }
        playerProjectiles.push(new PlayerAttackProjectile(10, 10, 'red', squareboy.x, squareboy.y, parseInt(mousePos.x), parseInt(mousePos.y)));
        squareboyAmmo.ammoClip -= 6;
      }

    })
  }

  updateGameArea() {
    gameBoard.clear();

    let ctx = gameBoard.canvas.getContext("2d");

    if (showGameTitle) {
      ctx.fillStyle = 'white';
      ctx.font = 'bold 34pt Pragati Narrow'
      ctx.fillText("SQUAREBOY", (window.innerWidth / 2) - (ctx.measureText('SQUAREBOY').width / 2), window.innerHeight / 2);

      ctx.font = '12pt Pragati Narrow'
      ctx.fillText("CLICK ANYWHERE TO BEGIN", (window.innerWidth / 2) - (ctx.measureText('CLICK ANYWHERE TO BEGIN').width / 2), (window.innerHeight / 2) + 100);
    }

    let allEnemies = []
    enemies.map((enemy) => {
      if (enemy.x > (gameBoard.width - (enemy.width)) || enemy.x < + (enemy.width)) {
        enemy.moveAngle = calculateAngle(enemy.x, enemy.y, squareboy.x, squareboy.y) + 90;
      }
      if (enemy.y > (gameBoard.height - (enemy.width)) || enemy.y < + (enemy.width)) {
        enemy.moveAngle = calculateAngle(enemy.x, enemy.y, squareboy.x, squareboy.y) + 90;
      }

      if (enemy.health > 30) {
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

    if (showGameTitle) {
      squareboy.speed = 0;
    } else {
      squareboy.speed = 8;
      squareboyHealth.update()
      squareboyPoints.update(1)
      squareboyAmmo.update()
    }

    if (!showGameTitle) {
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

    let newPlayerProjectiles = []
    if (playerProjectiles.length > 0) {
      playerProjectiles.map(async (projectile) => {
        if (await !detectProjectileEnemyCollisions(projectile)) {
          newPlayerProjectiles.push(projectile)
        }
      })
      playerProjectiles = newPlayerProjectiles
    }

    for (let i = 0; i < enemies.length; i++) {
      if (enemies && enemies[i]) { enemies[i].newPos(); }
      if (enemies && enemies[i]) { enemies[i].update(); }
    }

    squareboy.newPos();
    squareboy.update();

    // Recursively updating frames.
    requestAnimationFrame(Game.updateGameArea)
  }
};

// Le Square XD
class Player {
  constructor(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

    // Boundaries
    this.leftX = x;
    this.topY = y;
    this.rightX = x + this.width;
    this.bottomY = y + this.height;

    this.color = color
    this.speed = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.health = 150
  }

  newPos() {
    this.angle += this.moveAngle * Math.PI / 180;
    this.x += this.speed * Math.sin(this.angle);
    this.y -= this.speed * Math.cos(this.angle);

    if (this.x > gameBoard.width + 15) { this.x = -15; squareboy.health -= 5; }
    if (this.x < -15) { this.x = gameBoard.width + 15; squareboy.health -= 5; }
    if (this.y > gameBoard.height + 15) { this.y = -15; squareboy.health -= 5; }
    if (this.y < -15) { this.y = gameBoard.height + 15; squareboy.health -= 5; }

  }

  update() {
    let ctx = gameBoard.canvas.getContext("2d");
    ctx = gameBoard.context;
    ctx = gameBoard.context;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
    ctx.restore();
  }

};

// Circles >8(
class Enemy {
  constructor(radius, x, y, destX, destY) {
    this.width = radius;
    this.height = radius;
    this.x = x;
    this.y = y;
    this.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`
    this.speed = getRandomInt(4, 1);
    this.angle = 0;
    this.destX = destX;
    this.destY = destY;
    this.moveAngle = calculateAngle(this.x, this.y, this.destX, this.destY) + 90;


    // Enemy Area
    this.minX = this.x - radius
    this.minY = this.y - radius
    this.maxX = this.x + radius
    this.maxY = this.y + radius

    this.damage = getRandomInt(50, 15);
    this.health = this.width
  }

  newPos() {
    this.angle = this.moveAngle * Math.PI / 180;
    this.x += this.speed * Math.sin(this.angle);
    this.y -= this.speed * Math.cos(this.angle);

    this.width = this.health;
    if (this.width < 30) {
      this.width = 0
    }

    this.minX = this.x - this.width + (parseInt(this.width / 5))
    this.minY = this.y - this.width + (parseInt(this.width / 5))
    this.maxX = this.x + this.width - (parseInt(this.width / 5))
    this.maxY = this.y + this.width - (parseInt(this.width / 5))
  }

  update() {
    let ctx = gameBoard.canvas.getContext("2d");

    ctx.beginPath()
    ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.lineWidth = 1;
    ctx.strokeStyle = this.color;
    ctx.stroke();
  }
};

class HealthBar {
  constructor() {
    this.maxHP
    this.recoveryRate
  }
  update() {
    let ctx = gameBoard.canvas.getContext("2d");
    ctx.save();

    ctx.fillStyle = "#188d36";
    ctx.fillRect(20, gameBoard.height - 45, (squareboy.health / 100) * 200, 30);
    ctx.restore();

    ctx.fillStyle = 'white';
    ctx.font = 'bold 14pt Pragati Narrow'
    ctx.fillText("HP", 25, gameBoard.height - 25);
  }
}

class AmmunitionBar {
  constructor() {
    this.ammoClip = 150
  }
  update() {
    let ctx = gameBoard.canvas.getContext("2d");
    ctx.save();

    ctx.fillStyle = "#ebad1d";
    ctx.fillRect(gameBoard.width - ((this.ammoClip / 100) * 200) - 20, gameBoard.height - 45, (this.ammoClip / 100) * 200, 30);
    ctx.restore();

    ctx.fillStyle = 'white';
    ctx.font = 'bold 14pt Pragati Narrow'
    ctx.fillText("AMMO", gameBoard.width - (ctx.measureText("AMMO").width) - 15, gameBoard.height - 25);
  }
}

class PlayerScore {
  constructor() {
    this.points = 0
  }
  update(points) {
    this.points += points
    let ctx = gameBoard.canvas.getContext("2d");
    ctx.save();

    ctx.fillStyle = 'white';
    ctx.font = 'bold 10pt Pragati Narrow'
    ctx.fillText("SCORE", (gameBoard.width / 2) - (ctx.measureText("SCORE").width / 2), 30);

    ctx.fillStyle = '#22bff3';
    ctx.font = 'bold 15pt Pragati Narrow'
    ctx.fillText(this.points, (gameBoard.width / 2) - (ctx.measureText(this.points).width / 2), 55);
  }
}

class PlayerAttackProjectile {
  constructor(width, height, color, x, y, destX, destY) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color
    this.speed = 8;
    this.angle = 0;
    this.destX = destX;
    this.destY = destY;
    this.moveAngle = calculateAngle(this.x, this.y, this.destX, this.destY) + 90;

    this.damage = parseInt(getRandomInt(60, 25))
  }

  newPos() {
    let newPlayerProjectiles = []

    if (this.x > gameBoard.width + 5 || this.x < -5) {
      playerProjectiles.map((projectile) => {
        if (projectile.x > gameBoard.width || projectile.x < 0) {
          return
        }
        if (projectile.y > gameBoard.height || projectile.y < 0) {
          return
        }
        newPlayerProjectiles.push(projectile)
      })
      playerProjectiles = newPlayerProjectiles
    }
    if (this.y > gameBoard.height + 5 || this.y < -5) {
      playerProjectiles.map((projectile) => {
        if (projectile.x > gameBoard.width || projectile.x < 0) {
          return
        }
        if (projectile.y > gameBoard.height || projectile.y < 0) {
          return
        }
        newPlayerProjectiles.push(projectile)
      })
      playerProjectiles = newPlayerProjectiles
    }

    this.angle = this.moveAngle * Math.PI / 180;
    this.x += this.speed * Math.sin(this.angle);
    this.y -= this.speed * Math.cos(this.angle);
  }

  update() {
    let ctx = gameBoard.canvas.getContext("2d");
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
    ctx.restore();
  }
};