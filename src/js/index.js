let Game;

let squareboy;
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
    gameBoard.start();

    window.addEventListener('click', (e) => {
      showGameTitle = false

      const mousePos = {
        x: e.clientX,
        y: e.clientY
      };

      playerProjectiles.push(new PlayerAttackProjectile(10, 10, 'red', squareboy.x, squareboy.y, parseInt(mousePos.x), parseInt(mousePos.y)))
      // playerProjectiles.push(new PlayerAttackProjectile(10, 10, 'red', mousePos.x - 5, mousePos.y - 5))

      console.log(mousePos.x, mousePos.y)
      console.log(squareboy.x, squareboy.y)

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
    }

    if (!showGameTitle) {
      if (gameBoard.keys && gameBoard.keys[controls.left]) { squareboy.moveAngle = -5; }
      if (gameBoard.keys && gameBoard.keys[controls.right]) { squareboy.moveAngle = 5; }
      if (gameBoard.keys && gameBoard.keys[controls.up]) { squareboy.speed = 8; }
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
    this.health
  }

  newPos() {
    this.angle += this.moveAngle * Math.PI / 180;
    this.x += this.speed * Math.sin(this.angle);
    this.y -= this.speed * Math.cos(this.angle);
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