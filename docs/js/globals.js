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
let powerMeter = 1000;

let combatMultiplier = 1;
let combatMultiplierCheckpoints = [1, 5, 15, 30, 50];

// TODO: Define different power-ups


// Menus

const randomSubheaders = [
  'Fun Fact: 100% of players who pause the game are actually amatuers',
  'Is the game too hard for you, bud?',
  '"Squareboy? Aw yeah, yeah that game\'s dope. Must\'ve taken forever to make..." - Kanye West',
  'This game can cure some illnesses... but it won\'t',
  'Are you even trying at this point?'
]