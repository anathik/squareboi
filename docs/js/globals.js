// ESTABLISHING GLOBAL VARIABLES AND VALUE DEFAULTS.
// **Note: I'm aware it's usually frowned upon to use globals
// but we're making a fast mess here**

let Game;
let gameTitle;
let showGameTitle; /* true = game is stopped or unstarted, false */

// Player controls
const controls = {
  // Directions
  up: 87, /* W */
  left: 65, /* A */
  down: 83, /* S */
  right: 68, /* D  */

  // Other Controls
  action: 32, /* Spacebar */
  pause: 80 /* P */
  // defend: 87,
}

// Player variables
let squareboy;
let squareboyHealth;
let squareboyPoints;
let squareboyAmmo;
let squareboyPower; /* TODO: Implement different power-ups (i.e. boost, invulnerable, shield) */

// Intervals
let squareboyAmmoReloadInterval;
let squareboyHPRecoveryInterval;
let randomEnemyMovementInterval;

// Object Stores
let playerProjectiles = []

let enemies = []
let maxEnemyCount = 20;


// Power-Ups
// TODO: Define different power-ups