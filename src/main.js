import kaboom from "kaboom";

// Initialize Kaboom
kaboom({ background: [0, 0, 0] });

// Constants
const SPEED = 320;

// // Load assets
// loadSprite("bed", "/sprites/bed.png");
// loadSprite("table", "/sprites/table.png");
// loadSprite("closet", "/sprites/closet.png");
// loadSprite("door", "/sprites/door.png");
// loadSprite("doorOpen", "/sprites/doorOpen.png");
// loadSprite("kitchen", "/sprites/kitchen.png");
// loadSprite("tableFlower", "/sprites/tableFlower.png");
// loadSprite("plantDeco", "/sprites/plantDeco.png");
// loadSprite("windowDouble", "/sprites/windowDouble.png");
// loadSprite("window", "/sprites/window.png");
// loadSprite("clockWide", "/sprites/clockWide.png");
// loadSprite("hero", "/sprites/hero.png");
// loadSprite("light_switch", "https://kaboomjs.com/sprites/coin.png");
// loadSprite("bg", "/sprites/parquet.png");
// loadSprite("brickWall", "/sprites/brickWall.jpg");

// scene("flat", (levelIdx) => {
//   const levels = [
//     [
//       "xxxxxxxxxx",
//       "x___x____x",
//       "x___x____x",
//       "x___x____x",
//       "xx_xx____x",
//       "x________x",
//       "x________x",
//       "x________x",
//       "xx|xxxxxxx",
//     ],
//   ];

//   const level = addLevel(levels[levelIdx], {
//     tileWidth: 64,
//     tileHeight: 64,
//     pos: vec2(0, 0),

//     tiles: {
//       x: () => [
//         sprite("brickWall", { width: 64, height: 64 }),
//         area(),
//         body({ isStatic: true }),
//         anchor("center"),
//       ],
//       _: () => [
//         sprite("bg", { width: 64, height: 64 }),
//         area(),
//         anchor("center"),
//       ],
//       "|": () => [
//         sprite("door", { width: 64, height: 64 }),
//         area(),
//         body({ isStatic: true }),
//         anchor("center"),
//       ],
//     },
//   });

//   // Game state
//   let isLightOn = true;
//   let canToggleLight = false;
//   let canTakeElevator = false;
//   let blackScreen = null;

//   function addDialog() {
//     const h = 340;
//     const pad = 16;
//     const bg = add([
//       pos(0, height() - h),
//       rect(width(), h),
//       color(0, 0, 0),
//       z(100),
//     ]);
//     const txt = add([
//       text("", {
//         width: width(),
//       }),
//       pos(0 + pad, height() - h + pad),
//       z(100),
//     ]);
//     bg.hidden = true;
//     txt.hidden = true;
//     return {
//       say(t) {
//         txt.text = t;
//         bg.hidden = false;
//         txt.hidden = false;
//       },
//       dismiss() {
//         if (!this.active()) {
//           return;
//         }
//         txt.text = "";
//         bg.hidden = true;
//         txt.hidden = true;
//       },
//       active() {
//         return !bg.hidden;
//       },
//       destroy() {
//         bg.destroy();
//         txt.destroy();
//       },
//     };
//   }
//   const dirs = {
//     left: LEFT,
//     right: RIGHT,
//     up: UP,
//     down: DOWN,
//   };

//   // Player
//   const player = add([
//     sprite("hero", { width: 38, height: 64 }),
//     pos(100, 100),
//     area(),
//     body(),
//     "player",
//   ]);

//   const bed = add([
//     sprite("bed", { width: 64, height: 64 }),
//     pos(95, 38),
//     area(),
//     body({ isStatic: true }),
//     "bed",
//   ]);
//   const table = add([
//     sprite("table", { width: 64, height: 64 }),
//     pos(400, 200),
//     area(),
//     body({ isStatic: true }),
//     "table",
//   ]);
//   const kitchen = add([
//     sprite("kitchen", { width: 180, height: 86 }),
//     pos(360, 10),
//     area(),
//     body({ isStatic: true }),
//     "kitchen",
//   ]);
//   const tableFlower = add([
//     sprite("tableFlower", { width: 24, height: 42 }),
//     pos(65, 25),
//     area(),
//     body({ isStatic: true }),
//     "tableFlower",
//   ]);
//   const doorOpen = add([
//     sprite("doorOpen", { width: 64, height: 64 }),
//     pos(96, 225),
//     area(),
//     "doorOpen",
//   ]);
//   const plantDeco = add([
//     sprite("plantDeco", { width: 64, height: 64 }),
//     pos(290, 25),
//     area(),
//     body({ isStatic: true }),
//     "plantDeco",
//   ]);
//   const closet = add([
//     sprite("closet", { width: 64, height: 46 }),
//     pos(160, 30),
//     area(),
//     body({ isStatic: true }),
//     "closet",
//   ]);
//   const windowDouble = add([
//     sprite("windowDouble", { width: 80, height: 55 }),
//     pos(366, -27),
//     area(),
//     body({ isStatic: true }),
//     "windowDouble",
//   ]);
//   const window = add([
//     sprite("window", { width: 46, height: 50 }),
//     pos(103, -27),
//     area(),
//     body({ isStatic: true }),
//     "window",
//   ]);
//   const clockWide = add([
//     sprite("clockWide", { width: 72, height: 72 }),
//     pos(225, 230),
//     area(),
//     "clockWide",
//   ]);

//   // Camera setup
//   player.onUpdate(() => {
//     camPos(player.pos);
//   });

//   // Light switch
//   const lightSwitch = add([
//     sprite("light_switch"),
//     pos(170, 450),
//     area(),
//     "light_switch",
//   ]);

//   // Dialog
//   const dialog = addDialog();

//   // Player movement
//   for (const dir in dirs) {
//     onKeyPress(dir, () => {
//       dialog.dismiss();
//     });
//     onKeyDown(dir, () => {
//       player.move(dirs[dir].scale(SPEED));
//     });
//   }

//   // Player collisions interactions
//   player.onCollide("light_switch", () => {
//     dialog.say("You found a light switch ! Press 'E' to activate");
//     canToggleLight = true;
//   });

//   player.onCollideEnd("light_switch", () => {
//     canToggleLight = false;
//   });

//   player.onCollide("clockWide", () => {
//     dialog.say("It's 1.30pm");
//   });

//   // Toggle light
//   onKeyPress("e", () => {
//     if (canToggleLight) {
//       if (isLightOn) {
//         isLightOn = false;
//         blackScreen = add([
//           rect(580, 480),
//           pos(0, 0),
//           color(0, 0, 0),
//           "black_screen",
//         ]);
//       } else {
//         isLightOn = true;
//         if (blackScreen) {
//           destroy(blackScreen);
//           blackScreen = null;
//         }
//       }
//     }
//   });
// });
// go("flat", 0);

// Load assets
loadSprite("brickWall", "/sprites/brickWall.jpg");
loadSprite("carrelage", "/sprites/carrelage.png");
loadSprite("hero", "/sprites/hero.png");
loadSprite("elevator", "/sprites/elevator.png");

scene("elevator1", (levelIdx) => {
  const levels = [
    [
      "xxxxxxxxxxxxxxxx",
      "x______________x",
      "x______________x",
      "x______________x",
      "x______________x",
      "xxxxxxxxxxxxxxxx",
    ],
  ];

  const level = addLevel(levels[levelIdx], {
    tileWidth: 64,
    tileHeight: 64,
    pos: vec2(480, 250),

    tiles: {
      x: () => [
        sprite("brickWall", { width: 64, height: 64 }),
        area(),
        body({ isStatic: true }),
        anchor("center"),
      ],
      _: () => [
        sprite("carrelage", { width: 64, height: 64 }),
        area(),
        anchor("center"),
      ],
    },
  });

  const elevator = add([
    sprite("elevator", { width: 260, height: 160 }),
    pos(1450, 280),
    area(),
    body({ isActive: true }),
    rotate(90),
    "elevator",
  ]);

  const player = add([
    sprite("hero", { width: 38, height: 64 }),
    pos(600, 350),
    area(),
    body(),
    "player",
  ]);
  player.onUpdate(() => {
    camPos(player.pos);
  });

  const dirs = {
    left: LEFT,
    right: RIGHT,
    up: UP,
    down: DOWN,
  };

  function addDialog() {
    const h = 220;
    const pad = 16;
    const bg = add([
      pos(width() / 4, height() - h), // Déplace le bloc de dialogue vers la droite
      rect(width(), h), // Réduit la largeur du bloc pour qu'il ne prenne que la moitié de l'écran
      color(0, 0, 0),
      z(100),
    ]);
    const txt = add([
      text("", {
        width: width() / 2 - 2 * pad, // Ajuste la largeur du texte pour correspondre à la nouvelle taille du bloc
      }),
      pos(width() / 2.5 + pad, height() - h + pad), // Positionne le texte à l'intérieur du bloc de dialogue
      z(100),
    ]);
    bg.hidden = true;
    txt.hidden = true;
    return {
      say(t) {
        txt.text = t;
        bg.hidden = false;
        txt.hidden = false;
      },
      dismiss() {
        if (!this.active()) {
          return;
        }
        txt.text = "";
        bg.hidden = true;
        txt.hidden = true;
      },
      active() {
        return !bg.hidden;
      },
      destroy() {
        bg.destroy();
        txt.destroy();
      },
    };
  }

  const dialog = addDialog();

  for (const dir in dirs) {
    onKeyPress(dir, () => {
      dialog.dismiss();
    });
    onKeyDown(dir, () => {
      player.move(dirs[dir].scale(SPEED));
    });
  }
  player.onCollide("elevator", () => {
    dialog.say(
      "Oh no !! The elevator is out of order !! How am I going to do ??"
    );
  });
});

go("elevator1", 0);
