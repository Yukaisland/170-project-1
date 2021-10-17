title = "Gravity Swap";

description = `
      [Hold] 
      
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



options = {
  theme:"pixel",
  isPlayingBgm: true,
  isReplayEnabled: false,
  seed: 2000,
};



/** @type {{x: number, height: number}[]} */
let walls;
let wallHeight;
let wallHeightVel;
let ship;
let swap;
let scrolling;

/** @type {Vector[]} */
let coin;
let nextCoindist;

//************************************* */
function update() {
  if (!ticks) {
    walls = times(11, (i) => {
      return { x: i * 10, height: 5 };
    });
    wallHeight = 10;
    wallHeightVel = 0;
    ship = { pos: vec(10, 50), vy: 0 };
    scrolling = 1;
    
    //
    coin = [];
    nextCoindist = 10
    

  }

  //********************************* */
  scrolling = difficulty;
  score += scrolling / 100;
  
 //********************************** */
  const scr = difficulty * 0.4;
  /** @type {Color} */
  // @ts-ignore
  const wallColor = [
    "purple", "blue", "green", "red","yellow"]
    [floor(ticks / 50) % 5];
  color(wallColor);

//Generate Walls
  walls.forEach((w) => {
    w.x -= scr;
    if (w.x < -10) {
      w.x += 110;
      wallHeight += wallHeightVel;
      if (
        (wallHeight < 10 && wallHeightVel < 0) ||
        (wallHeight > 50 && wallHeightVel > 0)
      ) {
        wallHeightVel *= -1;
        wallHeight += wallHeightVel;
      } else if (rnd() < 0.2) {
        wallHeightVel = 0;
      } else if (rnd() < 0.3) {
        wallHeightVel = rnd() < 0.5 ? -10 : 10;
      }
      w.height = wallHeight;

      //Coin generate
      nextCoindist--;
      if (nextCoindist < 0) {
        coin.push(vec(w.x + 0.1, 90 - w.height - 3));
      }
     
    }
    rect(w.x, 90 - w.height, 9, w.height);
    rect(w.x, 0, 9, 5);
  });
  
  //Generate players
  if (swap) {
    ship.vy -= input.isPressed ? 0.0001 : 0.004;
    ship.pos.y += ship.vy;
    }
  color("black");
  ship.vy += 0.001555 * difficulty;
  ship.vy *= 0.9855;
  ship.pos.y += ship.vy;
  if (
    char("ab ", ship.pos).isColliding.rect[
      wallColor
    ]
  ) {
    play("explosion");
    end();
  }

  color("blue");
  particle(ship.pos.x - 2, ship.pos.y, 0.5, 0.5, PI, PI / 5);

  //Hold to change gravity
  if(!swap && input.isPressed){
    play("lucky")
    swap = true;
    ship.vy = 0.1;
  }

  //Generate coins
  coin.forEach((c) => {
    c.x -= scr; 
      color("yellow");
      char("c", c);
      color("red");
    
    return c.x > -3;
  });



 /*    if (coin !== "none") {
      color("black");
      const x = coin === "left" ? 30 : 70;
      if (char(addWithCharCode("p", ship.vy < 0 ? 0 : 1), 
      ship.pos).isColliding.char.a) {
        play("coin");
        coin =  + 1;

        coin = "none";
      }
    } */

}