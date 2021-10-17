title = "GRAVITY WELL";

description = 
`     [Hold] 
       to
  Change Gravity
`;

characters = [

  `
   rrr
  ll   
yrbbll
yrbbll
  ll   
   rrr
    `,
  `
  rrrr  
llllll
  bbbb
  bbbb
llllll
  rrrr
    `,
    `
  bbbb  
  yyyy
rrrrrr
rrrrrr
  yyyy
  bbbb
    `
    ,
    `
bbbb  
yyyy
rrrryyyy
rrrryyyy
yyyy
bbbb
    `
];
const G = {
	WIDTH: 175,
	HEIGHT: 75,
  STAR_SPEED_MIN: 0.1,
	STAR_SPEED_MAX: 0.5
};

const GAME = {
  CHUNKSPAWNTIME: 140,
  COLUMNDISTANCE: 25,
  OBSTACLESPEED: .4,
  POWMETERMAX: 600,
  POWMETERRATE: 1
}
 
const LEVEL = {
  BOTSPAWNY: 25,
  MIDSPAWNY: 38,
  TOPSPAWNY: 51,
  SPAWNX: G.WIDTH * 1.1,
  LOWERBOUND: 20,
  UPPERBOUND: 50
}

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  theme:"pixel",
  isPlayingBgm: true,
  isReplayEnabled: false,
  seed: 4000,
};

// -- Define Player --------------------------------
/**
 * @typedef {{
 * pos: Vector,
 * vy: number,
 * isPoweredUp: Boolean,
 * powerMeter: number
 * }} Player
 */

// -- Declare player --------------------------------
/**
 * @type { Player }
 */
 let player;

// ** Define Obstacle *********************
/**
 * @typedef {{
 * pos: Vector
 * }} Obstacle
 */
 
// ** Declare obstacles array *********************
/**
 * @type { Obstacle [] }
 */
let obstacles;

// ** Define PowerUp *********************
/**
 * @typedef {{
 * pos: Vector
 * }} PowerUp
 */
 
// ** Declare powerUps array *********************
/**
 * @type { PowerUp [] }
 */
let powerUps;
 
// ** Define ColumnSpawnCombo *********************
/**
 * @typedef {{
 * bot: number,
 * mid: number,
 * top: number
 * }} ColumnSpawnCombo
 */
 
// ** Declare columnSpawnList Array *********************
/**
 * @type { ColumnSpawnCombo [] }
 */
 let columnSpawnList = [
  // Empty
  {bot: 0, mid: 0, top: 0}, // 0
  // Obstacles, no powerups
  {bot: 1, mid: 0, top: 0}, // 1
  {bot: 0, mid: 1, top: 0}, // 2
  {bot: 0, mid: 0, top: 1}, // 3
  {bot: 1, mid: 1, top: 0}, // 4
  {bot: 1, mid: 0, top: 1}, // 5
  {bot: 0, mid: 1, top: 1}, // 6
  {bot: 0, mid: 0, top: 1}, // 7
  // Obstacles and powerups 
  {bot: 1, mid: 2, top: 0}, // 8
  {bot: 0, mid: 1, top: 2}, // 9
  {bot: 2, mid: 0, top: 1}, // 10
  {bot: 1, mid: 1, top: 2}, // 11
  {bot: 1, mid: 2, top: 1}, // 12
  {bot: 2, mid: 1, top: 1}, // 13
  {bot: 0, mid: 2, top: 1}, // 14
  // powerups, no obstacles
  {bot: 2, mid: 0, top: 0}, // 15
  {bot: 0, mid: 2, top: 0}, // 16
  {bot: 0, mid: 0, top: 2}, // 17
];
 
// ** Declare columnSpawnList Array *********************
/**
 * @type { number [][] }
 */
 let chunkSpawnList = [
  // No powerups included
  [1,2,2,1,7],
  [7,2,2,7,1],
  [0,5,5,5,0],
  [0,2,0,2,0],
  [1,1,0,7,7],
  [6,6,6,6,0],
  [4,4,0,0,6],
  [7,6,0,1,4],
  // power ups included
  [14,3,0,2,3],
  [1,0,4,0,8],
  [17,2,0,15,0],
  [1,1,0,17,7]
 ]
 
// ** Define Spawner *********************
/**
 * @typedef {{
 * chunkCooldown: number,
 * }} Spawner
 */
 
// ** Declare spawner *********************
/**
 * @type { Spawner }
 */
let spawner;

/**
* @typedef {{
* pos: Vector,
* speed: number
* }} Star
*/

/*** @type  { Star [] }*/
let stars;

let swap;
let scrolling;

/** @type {Vector[]} */
let coin;
let nextCoindist;

//*************************************************** */

function update() {
  if (!ticks) {

    stars = times(20, () => {
      
      const posX = rnd(0, G.WIDTH);
      const posY = rnd(0, G.HEIGHT);
      // An object of type Star with appropriate properties
      return {
        // Creates a Vector
          pos: vec(posX, posY),
          // More RNG
          speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX)
          
      };

    });

    // Init spawner
    spawner = {
      chunkCooldown: 0
    }

    // Init obstacle array
    obstacles = [];

    // Init powerUps array
    powerUps = [];

    // Init player
    player = { 
      pos: vec(10, 50), 
      vy: 0, 
      isPoweredUp: false,
      powerMeter: 0
    }

    scrolling = 1;  
  }


  //Generate stars
  stars.forEach((s) => {
    // Move the star forward
    s.pos.x += s.speed;
    // Bring the star back to top once it's past the bottom of the screen
    if (s.pos.x > G.WIDTH) s.pos.x = 0;
    // Choose a color to draw
    color("yellow");
    char( "", s.pos);
    // Draw the star as a square of size 1
    box(s.pos, 1);
});

  //********************************* */
  scrolling = difficulty;
  score += scrolling / 100;
  spawner.chunkCooldown--;
 //********************************** */
  //Generate players
  color("black");
  player.vy += 0.0015 * difficulty;
  player.vy *= 0.985;
  player.pos.y += player.vy;
  char( "abd", player.pos);

  color("yellow");
  particle(player.pos.x - 2, player.pos.y, 0.5, 0.5, PI, PI / 5);

  //Hold to change gravity
  if(!swap && input.isPressed){
    play("powerUp")
    swap = true;
    player.vy = 0.1;
  }
  if (swap) {
    player.vy -= input.isPressed ? 0.00001 : 0.004;
    player.pos.y += player.vy;
  }

  // clamp player position within bounds
  player.pos.clamp(0, G.WIDTH, LEVEL.LOWERBOUND, LEVEL.UPPERBOUND);

  // Update and draw obstacles and remove any that satisfy the conditions
      remove(obstacles, (o) => {
    // draw enemy and check collision
    color("purple");
    char( "a", o.pos);
    //const isCollidingWithPlayer = rect(o.pos, 15).isColliding.char.a;
    const c = char("adc", o.pos).isColliding;

    // if colliding, end game
    if (c.char.c || c.char.d) {
      if (player.isPoweredUp) {
        play("explosion");
        player.isPoweredUp = false;
        return true;
      } else {
        play("explosion");
        end();
      }
    }
    
    o.pos.x -= GAME.OBSTACLESPEED;

    // remove unseen enemies
    return o.pos.x < -25;
    });

  // Update and draw powerUps and remove any that satisfy the conditions
  remove(powerUps, (p) => {
    // draw powerUps and check collision
    color("cyan");
    const c = char("c", p.pos).isColliding;
 
    // if colliding, give the player a powerup
    if (c.char.c || c.char.d) {
      play("explosion");
      player.isPoweredUp = true;
      player.powerMeter = GAME.POWMETERMAX;
      return true;
    }
    
    p.pos.x -= GAME.OBSTACLESPEED;
 
    // remove unseen powerUps
    return p.pos.x < -25;
  });
  
  // determine if obstacles and powerups will spawn
  if (spawner.chunkCooldown <= 0) {
    let currChunk = chunkSpawnList[rndi(0, chunkSpawnList.length)];
    for (let i = 0; i < currChunk.length; i++) {
      let currColumn = columnSpawnList[currChunk[i]];
      
      if (currColumn.bot == 1) {
        SpawnObstacle('bot', i*GAME.COLUMNDISTANCE);
      } else if (currColumn.bot == 2) {
        SpawnPowerUp('bot', i*GAME.COLUMNDISTANCE);
      } 

      if (currColumn.mid == 1) {
        SpawnObstacle('mid', i*GAME.COLUMNDISTANCE);
      } else if (currColumn.mid == 2) {
        SpawnPowerUp('mid', i*GAME.COLUMNDISTANCE);
      }

      if (currColumn.top == 1) {
        SpawnObstacle('top', i*GAME.COLUMNDISTANCE);
      } else if (currColumn.top == 2) {
        SpawnPowerUp('top', i*GAME.COLUMNDISTANCE);
      }
    }
    
    // reset the spawn cooldown
    spawner.chunkCooldown = GAME.CHUNKSPAWNTIME * (1/GAME.OBSTACLESPEED);
  }

  // manage player power up meter
  if (player.powerMeter <= 0) {
    player.isPoweredUp = false;
  }

  if (player.isPoweredUp) {
    player.powerMeter -= GAME.POWMETERRATE;
    color("cyan")
    rect(player.pos.x, player.pos.y - 7, (player.powerMeter / GAME.POWMETERMAX ) * 15, 3);
  }
}

// --- Helper Functions
function SpawnObstacle(laneName, xOffset) {
  let lane;
  if (laneName == 'bot') {
    lane = LEVEL.BOTSPAWNY;
  } else if (laneName == 'mid') {
    lane = LEVEL.MIDSPAWNY;
  } else if (laneName == 'top') {
    lane = LEVEL.TOPSPAWNY;
  }
 
  obstacles.push({
    pos: vec(LEVEL.SPAWNX + xOffset, lane)
  });
}

function SpawnPowerUp(laneName, xOffset) {
  let lane;
  if (laneName == 'bot') {
    lane = LEVEL.BOTSPAWNY;
  } else if (laneName == 'mid') {
    lane = LEVEL.MIDSPAWNY;
  } else if (laneName == 'top') {
    lane = LEVEL.TOPSPAWNY;
  }
 
  powerUps.push({
    pos: vec(LEVEL.SPAWNX + xOffset, lane)
  });
}