let Game;

let squareboy;
let squareboyHealth;
let squareboyPoints;
let squareboyAmmo;

let squareboyAmmoReloadInterval;
let squareboyHPRecoveryInterval;

let playerProjectiles = []

let gameTitle;
let showGameTitle; /* true = game is stopped or unstarted, false */

window.onload = () => {
  Game = new SquareboyGame()
  Game.startGame()
};

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
        squareboyAmmo.ammoClip += 10
      }
    }, 550);

    window.addEventListener('click', (e) => {
      if (showGameTitle) {
        showGameTitle = false
        playMusic()
      }
      const mousePos = {
        x: e.clientX,
        y: e.clientY
      };

      if (squareboyAmmo.ammoClip >= 10) {
        playerProjectiles.push(new PlayerAttackProjectile(10, 10, 'red', squareboy.x, squareboy.y, parseInt(mousePos.x), parseInt(mousePos.y)));
        squareboyAmmo.ammoClip -= 10;
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
      if (gameBoard.keys && gameBoard.keys[controls.up]) { squareboy.speed = 12; }
      if (gameBoard.keys && gameBoard.keys[controls.down]) { squareboy.speed = 5; }
      if (gameBoard.keys && gameBoard.keys[controls.action]) { squareboy.color = 'white'; } else {
        squareboy.color = 'red'
      }
    }

    for (let i = 0; i < playerProjectiles.length; i++) {
      if (playerProjectiles && playerProjectiles[i]) { playerProjectiles[i].newPos(); }
      if (playerProjectiles && playerProjectiles[i]) { playerProjectiles[i].update(); }
    }

    squareboy.newPos();
    squareboy.update();

    // Enemies (Circles)


    // Recursively updating frames.
    requestAnimationFrame(Game.updateGameArea)
  }
};

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

    if (this.x > gameBoard.width + 15) { this.x = -15 }
    if (this.x < -15) { this.x = gameBoard.width + 15 }
    if (this.y > gameBoard.height + 15) { this.y = -15 }
    if (this.y < -15) { this.y = gameBoard.height + 15 }

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

class HealthBar {
  constructor() {
    this.maxHP
    this.recoveryRate
  }
  update() {
    let ctx = gameBoard.canvas.getContext("2d");
    ctx.save();

    ctx.fillStyle = "#188d36";
    ctx.fillRect(20, gameBoard.height - 45, (squareboy.health / 100) * 140, 30);
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
    ctx.fillRect(gameBoard.width - ((this.ammoClip / 100) * 140) - 20, gameBoard.height - 45, (this.ammoClip / 100) * 140, 30);
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
    ctx.font = 'bold 12pt Pragati Narrow'
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
    this.speed = 12;
    this.angle = 0;
    this.destX = destX;
    this.destY = destY;
    this.moveAngle = calculateAngle(this.x, this.y, this.destX, this.destY) + 90;
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


function calculateAngle(cx, cy, ex, ey) {
  var dy = ey - cy;
  var dx = ex - cx;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  //if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}