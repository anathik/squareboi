class Player {
  constructor(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

    // Boundaries
    this.minX = x;
    this.miny = y;
    this.maxX = x + this.width;
    this.maxY = y + this.height;

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

    if (this.x > gameBoard.width + 15) { this.x = -15; this.health -= 5; }
    if (this.x < -15) { this.x = gameBoard.width + 15; this.health -= 5; }
    if (this.y > gameBoard.height + 15) { this.y = -15; this.health -= 5; }
    if (this.y < -15) { this.y = gameBoard.height + 15; this.health -= 5; }

    if (this.health < 0) {
      defeatedScreen.toggleDisplay()
    }
  }

  update() {
    gameBoard.context = gameBoard.context;
    gameBoard.context = gameBoard.context;
    gameBoard.context.save();
    gameBoard.context.translate(this.x, this.y);
    gameBoard.context.rotate(this.angle);
    gameBoard.context.fillStyle = this.color;
    gameBoard.context.fillRect(this.width / -2, this.height / -2, this.width, this.height);
    gameBoard.context.restore();
  }

};

// Circles >8(
class Enemy {
  constructor(radius, x, y, destX, destY) {
    this.isKamikaze = false

    this.width = radius;
    this.height = radius;
    this.x = x;
    this.y = y;
    this.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`
    this.speed = getRandomInt(5, 1);
    this.angle = 0;
    this.destX = destX;
    this.destY = destY;
    this.moveAngle = calculateAngle(this.x, this.y, this.destX, this.destY) + 90;


    // Enemy Area
    this.minX = this.x - radius
    this.minY = this.y - radius
    this.maxX = this.x + radius
    this.maxY = this.y + radius

    this.damage = Math.ceil(this.width / 100)
    this.health = this.width
    this.pointValue = this.width
  }

  newPos() {
    this.angle = this.moveAngle * Math.PI / 180;
    this.x += this.speed * Math.sin(this.angle);
    this.y -= this.speed * Math.cos(this.angle);

    if (this.width < 25) {
      this.width = 0
    }

    this.minX = this.x - this.width + (parseInt(this.width / 5))
    this.minY = this.y - this.width + (parseInt(this.width / 5))
    this.maxX = this.x + this.width - (parseInt(this.width / 5))
    this.maxY = this.y + this.width - (parseInt(this.width / 5))

    if (this.width < 45) {
      this.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`
      this.speed = getRandomInt(9, 4)
      this.moveAngle = calculateAngle(this.x, this.y, squareboy.x, squareboy.y) + 90;
      this.isKamikaze = true
    }

    if (this.isKamikaze) {
      this.damage = 21;
    }
  }

  update() {
    gameBoard.context.beginPath()
    gameBoard.context.arc(this.x, this.y, this.width, 0, Math.PI * 2, false);
    gameBoard.context.fillStyle = this.color;
    gameBoard.context.fill();

    gameBoard.context.lineWidth = 1;
    gameBoard.context.strokeStyle = this.color;
    gameBoard.context.stroke();
  }
};

class HealthBar {
  constructor() {
    this.maxHP
    this.recoveryRate
  }
  update() {
    gameBoard.context.save();

    gameBoard.context.fillStyle = "#188d36";
    gameBoard.context.fillRect(20, gameBoard.height - 45, (squareboy.health / 100) * 200, 30);
    gameBoard.context.restore();

    gameBoard.context.fillStyle = 'white';
    gameBoard.context.font = 'bold 14pt Pragati Narrow'
    gameBoard.context.fillText("HP", 25, gameBoard.height - 25);
  }
}

class AmmunitionBar {
  constructor() {
    this.ammoClip = 150
  }
  update() {
    gameBoard.context.save();

    gameBoard.context.fillStyle = "#ebad1d";
    gameBoard.context.fillRect(gameBoard.width - ((this.ammoClip / 100) * 200) - 20, gameBoard.height - 45, (this.ammoClip / 100) * 200, 30);
    gameBoard.context.restore();

    gameBoard.context.fillStyle = 'white';
    gameBoard.context.font = 'bold 14pt Pragati Narrow'
    gameBoard.context.fillText("AMMO", gameBoard.width - (gameBoard.context.measureText("AMMO").width) - 15, gameBoard.height - 25);
  }
}

class PlayerScore {
  constructor() {
    this.points = 0
  }
  update(points) {
    this.points += points
    gameBoard.context.save();

    gameBoard.context.fillStyle = 'white';
    gameBoard.context.font = 'bold 10pt Pragati Narrow'
    gameBoard.context.fillText("SCORE", (gameBoard.width / 2) - (gameBoard.context.measureText("SCORE").width / 2), 30);

    gameBoard.context.fillStyle = '#22bff3';
    gameBoard.context.font = 'bold 15pt Pragati Narrow'
    gameBoard.context.fillText(this.points, (gameBoard.width / 2) - (gameBoard.context.measureText(this.points).width / 2), 55);
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
    gameBoard.context.save();
    gameBoard.context.translate(this.x, this.y);
    gameBoard.context.rotate(this.angle);
    gameBoard.context.fillStyle = this.color;
    gameBoard.context.fillRect(this.width / -2, this.height / -2, this.width, this.height);
    gameBoard.context.restore();
  }
};


// MENUS //

class PauseMenu {
  constructor() {
    this.isActive = false
    this.isGameStopped = false
    this.isGamePaused = true
    this.headerText = 'PAUSED'
    this.subheaderText = randomSubheaders[getRandomInt(randomSubheaders.length - 1, 0)]
  }

  toggleDisplay() {
    this.subheaderText = randomSubheaders[getRandomInt(randomSubheaders.length - 1, 0)]
    if (this.isActive) {
      myAudio.play();
      areMenusActive = false
      this.isActive = false
    } else {
      areMenusActive = true
      this.isActive = true
      myAudio.pause()
    }
  }

  updateDisplay() {
    if (this.isActive) {
      gameBoard.context.fillStyle = 'white';
      gameBoard.context.font = 'bold 50pt Pragati Narrow'
      gameBoard.context.fillText(this.headerText, (window.innerWidth / 2) - (gameBoard.context.measureText(this.headerText).width / 2), window.innerHeight / 2);

      gameBoard.context.font = '10pt Pragati Narrow'
      gameBoard.context.fillText(this.subheaderText.toUpperCase(), (window.innerWidth / 2) - (gameBoard.context.measureText(this.subheaderText.toUpperCase()).width / 2), (window.innerHeight / 2) + 100);
    }
  }
}

// Grim naming convention - oops.
class DeathMenu {
  constructor() {
    this.isActive = false
    this.isGameStopped = true
    this.isGamePaused = true
    this.headerText = 'DEFEAT'
    this.subheaderText = 'CLICK TO TRY AGAIN'
  }

  toggleDisplay() {
    this.subheaderText = `DIED LIKE A BITCH WITH JUST ${squareboyPoints.points} SCHECKLES`
    if (this.isActive) {
      myAudio.play();
      areMenusActive = false
      this.isActive = false
    } else {
      areMenusActive = true
      this.isActive = true
      myAudio.pause()
      resetGame()
    }
  }

  updateDisplay() {
    if (this.isActive) {
      gameBoard.context.fillStyle = 'orange';
      gameBoard.context.font = 'bold 34pt Pragati Narrow'
      gameBoard.context.fillText(this.headerText, (window.innerWidth / 2) - (gameBoard.context.measureText(this.headerText).width / 2), window.innerHeight / 2);

      gameBoard.context.font = '12pt Pragati Narrow'
      gameBoard.context.fillText(this.subheaderText, (window.innerWidth / 2) - (gameBoard.context.measureText(this.subheaderText).width / 2), (window.innerHeight / 2) + 100);
    }
  }
}

class OpeningMenu {
  constructor() {
    this.isActive = true
    this.isGameStopped = true
    this.isGamePaused = true
    this.headerText = 'SQUAREBOY'
    this.subheaderText = 'CLICK ANYWHERE TO BEGIN'
  }

  toggleDisplay() {
    this.isActive ? this.isActive = false : this.isActive = true

    if (areMenusActive) {
      areMenusActive = false
      playMusic()
    } else {
      myAudio.paused(true)
    }
  }

  updateDisplay() {
    if (this.isActive) {
      gameBoard.context.fillStyle = 'white';
      gameBoard.context.font = 'bold 34pt Pragati Narrow'
      gameBoard.context.fillText(this.headerText, (window.innerWidth / 2) - (gameBoard.context.measureText(this.headerText).width / 2), window.innerHeight / 2);

      gameBoard.context.font = '12pt Pragati Narrow'
      gameBoard.context.fillText(this.subheaderText, (window.innerWidth / 2) - (gameBoard.context.measureText(this.subheaderText).width / 2), (window.innerHeight / 2) + 100);
    }
  }
}