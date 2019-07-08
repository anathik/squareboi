// I'm aware it's usually frowned upon to use globals
// but we're making a fast mess here.

let Game;

// Player variables
let squareboy;
let squareboyHealth;
let squareboyPoints;
let squareboyAmmo;

// Intervals
let squareboyAmmoReloadInterval;
let squareboyHPRecoveryInterval;
let randomEnemyMovementInterval;

// Object Stores
let playerProjectiles = []
let enemies = []