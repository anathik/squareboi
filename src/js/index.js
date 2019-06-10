let Game
window.onload = () => {
  Game = new SquareboyGame()
  Game.startGame()
};

let squareboy;
let gameTitle;

let gameBoard = {
  canvas: document.getElementById('gameView'),
  start: function () {
    let title = new GameTitle();
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
    clearInterval(this.interval);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

class SquareboyGame {
  constructor() {
  }

  startGame() {
    squareboy = new Player(30, 30, "red", 225, 225);
    gameTitle = new GameTitle();
    requestAnimationFrame(gameTitle.showTitle)
    gameBoard.start();
  }

  updateGameArea() {
    gameBoard.clear();

    // Squareboy
    squareboy.moveAngle = 0;
    squareboy.speed = 0;
    if (gameBoard.keys && gameBoard.keys[controls.left]) { squareboy.moveAngle = -5; }
    if (gameBoard.keys && gameBoard.keys[controls.right]) { squareboy.moveAngle = 5; }
    if (gameBoard.keys && gameBoard.keys[controls.up]) { squareboy.speed = 5; }
    if (gameBoard.keys && gameBoard.keys[controls.down]) { squareboy.speed = -5; }
    if (gameBoard.keys && gameBoard.keys[controls.action]) { squareboy.color = 'white'; } else {
      squareboy.color = 'red'
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

class Enemies {
  constructor(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color
    this.speed = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.health
  }

  newPos() {
    this.angle += this.moveAngle * Math.PI / 180;
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

class GameTitle {
  constructor() {

  }

  showTitle() {

  }
  hideTitle() {

  }

};



