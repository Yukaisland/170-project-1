title = "";

description = `
`;

characters = [];

const G = {
	WIDTH: 175,
	HEIGHT: 75,
  STAR_SPEED_MIN: 0.1,
	STAR_SPEED_MAX: 0.1
};

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  theme:"pixel",
  isPlayingBgm: false,
  isReplayEnabled: false,
  seed: 4000,
};

/**
* @typedef {{
  * pos: Vector,
  * speed: number
  * }} Star
  */
  
  /*** @type  { Star [] }*/
  let stars;

  //let scrolling;

function update() {
  if (!ticks) {

    stars = times(200, () => {
      
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

  }

  //Star color setup
    /** @type {Color} */
  // @ts-ignore
  const starColor = [
    "purple", "blue", "green", "red","yellow","black","cyan","white"]
    [floor(ticks / 7) % 8];
  color(starColor);

  //Generate stars
  stars.forEach((s) => {
    // Move the star forward
    s.pos.x += s.speed;
    // Bring the star back to top once it's past the bottom of the screen
    if (s.pos.x > G.WIDTH) s.pos.x = 0;
    // Choose a color to draw
    char( "", s.pos);
    // Draw the star as a square of size 1
    box(s.pos, 1);
  });
}


