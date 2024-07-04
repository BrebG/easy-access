import kaboom from "kaboom";

// Initialize Kaboom
kaboom({ background: [0, 0, 0] });

// Constants
let SPEED = 320;

// Load assets
loadSprite("bed", "/sprites/bed.png");
loadSprite("table", "/sprites/table.png");
loadSprite("closet", "/sprites/closet.png");
loadSprite("door", "/sprites/door.png");
loadSprite("doorOpen", "/sprites/doorOpen.png");
loadSprite("kitchen", "/sprites/kitchen.png");
loadSprite("tableFlower", "/sprites/tableFlower.png");
loadSprite("plantDeco", "/sprites/plantDeco.png");
loadSprite("windowDouble", "/sprites/windowDouble.png");
loadSprite("window", "/sprites/window.png");
loadSprite("clockWide", "/sprites/clockWide.png");
loadSprite("heroRight", "/sprites/heroRight.png");
loadSprite("heroLeft", "/sprites/heroLeft.png");
loadSprite("heroDown", "/sprites/heroDown.png");
loadSprite("heroUp", "/sprites/heroUp.png");
loadSprite("light_switch", "https://kaboomjs.com/sprites/coin.png");
loadSprite("bg", "/sprites/parquet.png");
loadSprite("brickWall", "/sprites/brickWall.jpg");
loadSprite("car", "sprites/voiture1.png");
loadSprite("car2", "sprites/voiture2.png");
loadSprite("metal", "sprites/metal.png");
loadSprite("grass", "sprites/grass.png");
loadSprite("road", "sprites/road.jpg");
loadSprite("parquet", "sprites/parquet.png");
loadSprite("pedestrian", "sprites/bean.png");
loadSprite("box", "sprites/box.png");

scene("flat", () => {
  const levels = [
    "xxxxxxxxxx",
    "x___x____x",
    "x___x____x",
    "x___x____x",
    "xx_xx____x",
    "x________x",
    "x________x",
    "x________x",
    "xx|xxxxxxx",
  ];

  const level = addLevel(levels, {
    tileWidth: 64,
    tileHeight: 64,
    pos: vec2(0, 0),

    tiles: {
      x: () => [
        sprite("brickWall", { width: 64, height: 64 }),
        area(),
        body({ isStatic: true }),
        anchor("center"),
      ],
      _: () => [
        sprite("bg", { width: 64, height: 64 }),
        area(),
        anchor("center"),
      ],
      "|": () => [
        sprite("door", { width: 64, height: 64 }),
        area(),
        body({ isStatic: true }),
        anchor("center"),
        "door",
      ],
    },
  });

  // Game state
  let isLightOn = true;
  let canToggleLight = false;
  let blackScreen = null;

  function addDialog() {
    const h = 340;
    const pad = 16;
    const bg = add([
      pos(0, height() - h),
      rect(width(), h),
      color(0, 0, 0),
      z(100),
    ]);
    const txt = add([
      text("", {
        width: width(),
      }),
      pos(0 + pad, height() - h + pad),
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
  const dirs = {
    left: LEFT,
    right: RIGHT,
    up: UP,
    down: DOWN,
  };

  // Player

  const player = add([
    sprite("heroDown", { width: 48, height: 64 }),
    pos(100, 100),
    area(),
    body(),
    "player",
  ]);

  onKeyDown("right", () => {
    player.use(sprite("heroRight", { width: 48, height: 64 }));
    player.move(SPEED, 0);
  });

  onKeyDown("left", () => {
    player.use(sprite("heroLeft", { width: 48, height: 64 }));
    player.move(-SPEED, 0);
  });

  onKeyDown("down", () => {
    player.use(sprite("heroDown", { width: 40, height: 64 }));
    player.move(0, SPEED);
  });

  onKeyDown("up", () => {
    player.use(sprite("heroUp", { width: 40, height: 64 }));
    player.move(0, -SPEED);
  });

  const bed = add([
    sprite("bed", { width: 64, height: 64 }),
    pos(95, 38),
    area(),
    body({ isStatic: true }),
    "bed",
  ]);
  const table = add([
    sprite("table", { width: 64, height: 64 }),
    pos(400, 200),
    area(),
    body({ isStatic: true }),
    "table",
  ]);
  const kitchen = add([
    sprite("kitchen", { width: 180, height: 86 }),
    pos(360, 10),
    area(),
    body({ isStatic: true }),
    "kitchen",
  ]);
  const tableFlower = add([
    sprite("tableFlower", { width: 24, height: 42 }),
    pos(65, 25),
    area(),
    body({ isStatic: true }),
    "tableFlower",
  ]);
  const doorOpen = add([
    sprite("doorOpen", { width: 64, height: 64 }),
    pos(96, 225),
    area(),
    "doorOpen",
  ]);
  const plantDeco = add([
    sprite("plantDeco", { width: 64, height: 64 }),
    pos(290, 25),
    area(),
    body({ isStatic: true }),
    "plantDeco",
  ]);
  const closet = add([
    sprite("closet", { width: 64, height: 46 }),
    pos(160, 30),
    area(),
    body({ isStatic: true }),
    "closet",
  ]);
  const windowDouble = add([
    sprite("windowDouble", { width: 80, height: 55 }),
    pos(366, -27),
    area(),
    body({ isStatic: true }),
    "windowDouble",
  ]);
  const window = add([
    sprite("window", { width: 46, height: 50 }),
    pos(103, -27),
    area(),
    body({ isStatic: true }),
    "window",
  ]);
  const clockWide = add([
    sprite("clockWide", { width: 72, height: 72 }),
    pos(225, 230),
    area(),
    "clockWide",
  ]);
  // Light switch
  const lightSwitch = add([
    sprite("light_switch"),
    pos(170, 450),
    area(),
    "light_switch",
  ]);

  // Camera setup
  player.onUpdate(() => {
    camPos(player.pos);
  });
  // Dialog
  const dialog = addDialog();

  // Player collisions interactions
  player.onCollide("light_switch", () => {
    dialog.say("You found a light switch ! Press 'E' to activate");
    canToggleLight = true;
  });

  player.onCollideEnd("light_switch", () => {
    dialog.dismiss();
    canToggleLight = false;
  });

  player.onCollide("clockWide", () => {
    dialog.say("It's 1.30pm");
  });

  player.onCollideEnd("clockWide", () => {
    dialog.dismiss();
  });

  player.onCollide("door", () => {
    go("elevator1");
  });

  // Toggle light
  onKeyPress("e", () => {
    if (canToggleLight) {
      if (isLightOn) {
        isLightOn = false;
        blackScreen = add([
          rect(580, 480),
          pos(0, 0),
          color(0, 0, 0),
          "black_screen",
        ]);
      } else {
        isLightOn = true;
        if (blackScreen) {
          destroy(blackScreen);
          blackScreen = null;
        }
      }
    }
  });
});

const carSpeed = 200;
const carDirection = vec2(1, 0);

function createPedestrian(x, y) {
  const pedestrianSpeed = 100;
  const pedestrianDirection = choose([
    vec2(1, 0),
    vec2(-1, 0),
    vec2(0, 1),
    vec2(0, -1),
  ]);

  const pedestrian = add([
    sprite("pedestrian"),
    pos(x, y),
    area(),
    body({ isStatic: true }),
    move(pedestrianDirection, pedestrianSpeed),
    "pedestrian",
  ]);

  wait(10, () => {
    destroy(pedestrian);
  });
}

function spawnFirstCar() {
  add([
    sprite("car"),
    pos(0, 280),
    area(),
    body(),
    move(carDirection, carSpeed),
    "car",
  ]);
  wait(rand(1, 4), spawnFirstCar);
}
function spawnSecondCar() {
  add([
    sprite("car2"),
    pos(1920, 380),
    area(),
    body(),
    move(vec2(-1, 0), carSpeed),
    "car2",
  ]);
  wait(rand(1, 4), spawnSecondCar);
}
function spawnThirdCar() {
  add([
    sprite("car"),
    pos(0, 480),
    area(),
    body(),
    move(carDirection, carSpeed),
    "car",
  ]);
  wait(rand(1, 4), spawnThirdCar);
}
function spawnFourthCar() {
  add([
    sprite("car"),
    pos(0, 580),
    area(),
    body(),
    move(carDirection, carSpeed),
    "car",
  ]);
  wait(rand(1, 4), spawnFourthCar);
}

scene("car", () => {
  add([sprite("road", { width: width("100vw"), height: height("100vh") })]);

  spawnFirstCar();
  spawnSecondCar();
  spawnThirdCar();
  spawnFourthCar();

  // Player

  const player = add([
    sprite("heroDown", { width: 48, height: 64 }),
    pos(100, 100),
    area(),
    body(),
    "player",
  ]);

  onKeyDown("right", () => {
    player.use(sprite("heroRight", { width: 48, height: 64 }));
    player.move(SPEED, 0);
  });

  onKeyDown("left", () => {
    player.use(sprite("heroLeft", { width: 48, height: 64 }));
    player.move(-SPEED, 0);
  });

  onKeyDown("down", () => {
    player.use(sprite("heroDown", { width: 40, height: 64 }));
    player.move(0, SPEED);
  });

  onKeyDown("up", () => {
    player.use(sprite("heroUp", { width: 40, height: 64 }));
    player.move(0, -SPEED);
  });
  const metal = add([
    sprite("metal"),
    pos(width("100vw") - 200, height("100vh") - 200),
    area(),
    body(),
    "metal",
  ]);

  player.onCollide("metal", () => {
    go("park");
  });

  player.onCollide("car", () => {
    burp();
    addKaboom(player.pos);
    go("car");
  });

  onKeyDown("left", () => {
    player.move(-SPEED, 0);
  });

  onKeyDown("right", () => {
    player.move(SPEED, 0);
  });

  onKeyDown("up", () => {
    player.move(0, -SPEED);
  });

  onKeyDown("down", () => {
    player.move(0, SPEED);
  });
});

scene("park", () => {
  add([sprite("grass", { width: width("100vw"), height: height("100vh") })]);

  loop(1, () => {
    createPedestrian(rand(0, width()), rand(0, height()));
  });

  // Player

  const player = add([
    sprite("heroDown", { width: 48, height: 64 }),
    pos(100, 100),
    area(),
    body(),
    "player",
  ]);

  onKeyDown("right", () => {
    player.use(sprite("heroRight", { width: 48, height: 64 }));
    player.move(SPEED, 0);
  });

  onKeyDown("left", () => {
    player.use(sprite("heroLeft", { width: 48, height: 64 }));
    player.move(-SPEED, 0);
  });

  onKeyDown("down", () => {
    player.use(sprite("heroDown", { width: 40, height: 64 }));
    player.move(0, SPEED);
  });

  onKeyDown("up", () => {
    player.use(sprite("heroUp", { width: 40, height: 64 }));
    player.move(0, -SPEED);
  });
  const metal = add([
    sprite("metal"),
    pos(1750, 90),
    area(),
    body({ isStatic: true }),
    "metal",
  ]);

  player.onCollideUpdate("pedestrian", () => {
    SPEED = 200;
  });

  player.onCollideEnd("pedestrian", () => {
    SPEED = 480;
  });

  player.onCollide("metal", () => {
    go("start");
  });

  onKeyDown("left", () => {
    player.move(-SPEED, 0);
  });

  onKeyDown("right", () => {
    player.move(SPEED, 0);
  });

  onKeyDown("up", () => {
    player.move(0, -SPEED);
  });

  onKeyDown("down", () => {
    player.move(0, SPEED);
  });
});

scene("maze", () => {
  add([sprite("parquet", { width: width("100vw"), height: height("100vh") })]);
  addLevel(
    [
      "                           ",
      "    yyyyyyyyyyyyyyyyyyyyyyy",
      "    y     y   H     y y y y",
      "    y yyyyyyy yyyyy y y y y",
      "    y       H y y   H     y",
      "    yyyyyyyyy y yyyyyyyyyHy",
      "    y           y         y",
      "    yHyyyyyyyyyyy yyyyyyyyy",
      "    y y   y   y     y   y D",
      "    y yyyyyyy y yyy  yyyy y",
      "    y y        Hy   y     y",
      "    D yyyyyyyyy yyy y yyyyy",
      "    y y   y   y y   y   y y",
      "    y yyy y yyy yyy yyy y y",
      "    y           y   H     y",
      "    yyyyyyyyyyyyyyyyyyyyyyy",
    ],

    {
      tileWidth: 64,
      tileHeight: 64,
      tiles: {
        y: () => [
          sprite("brickWall", { width: 64, height: 64 }),
          area(),
          body({ isStatic: true }),
          anchor("center"),
        ],
        D: () => [
          sprite("door", { width: 64, height: 64 }),
          area(),
          body({ isStatic: true }),
          anchor("center"),
          "door",
        ],
        H: () => [
          sprite("box", { width: 64, height: 64 }),
          area(),
          body({ isStatic: false }),
          anchor("center"),
          "box",
        ],
      },
    }
  );
  // Playerconst levelWidth = levels[0].length * 64; // Largeur du niveau en pixels
  // Hauteur du niveau en pixels

  const player = add([
    sprite("heroDown", { width: 48, height: 50 }),
    pos(1580, 480),
    area(),
    body(),
    "player",
  ]);

  loadSprite("heroUp", "/sprites/heroUp.png");
  loadSprite("heroRight", "/sprites/heroRight.png");
  loadSprite("heroLeft", "/sprites/heroLeft.png");
  loadSprite("heroDown", "/sprites/heroDown.png");

  onKeyDown("right", () => {
    player.use(sprite("heroRight", { width: 40, height: 62 }));
    player.move(SPEED, 0);
  });

  onKeyDown("left", () => {
    player.use(sprite("heroLeft", { width: 40, height: 62 }));
    player.move(-SPEED, 0);
  });

  onKeyDown("down", () => {
    player.use(sprite("heroDown", { width: 40, height: 62 }));
    player.move(0, SPEED);
  });

  onKeyDown("up", () => {
    player.use(sprite("heroUp", { width: 40, height: 62 }));
    player.move(0, -SPEED);
  });
  go("car");
});

scene("start", () => {
  onUpdate(() => setCursor("default"));

  function addButton(txt, p, f) {
    const btn = add([
      rect(240, 80, { radius: 8 }),
      pos(p),
      area(),
      scale(1),
      anchor("center"),
      outline(4),
    ]);
    btn.add([text(txt), anchor("center"), color(0, 0, 0)]);

    btn.onHoverUpdate(() => {
      const t = time() * 10;
      btn.scale = vec2(1.2);
      setCursor("pointer");
    });
    btn.onHoverEnd(() => {
      btn.scale = vec2(1);
      btn.color = rgb();
    });

    return btn;
  }

  const startButton = addButton("Start", vec2(width() / 2, height() / 2));

  startButton.onClick(() => go("flat"));
});

// Load assets
loadSprite("carrelage", "/sprites/carrelage.png");
loadSprite("carpet", "/sprites/carpet.png");

// DEBUT DE LA SCENE ELEVATOR1
scene("elevator1", () => {
  addLevel(
    [
      "xx1xx2xxx3xxxxxx",
      "x______________x",
      "W______________x",
      "W______________x",
      "x______________x",
      "xExxx4xxx5xxxxxx",
    ],
    {
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
        E: () => [
          sprite("metal", { width: 64, height: 64 }),
          area(),
          body({ isStatic: true }),
          anchor("center"),
          "metal",
        ],
        1: () => [
          sprite("metal", { width: 64, height: 64 }),
          area(),
          body({ isStatic: true }),
          anchor("center"),
          "neighboor1",
        ],
        2: () => [
          sprite("metal", { width: 64, height: 64 }),
          area(),
          body({ isStatic: true }),
          anchor("center"),
          "neighboor2",
        ],
        3: () => [
          sprite("metal", { width: 64, height: 64 }),
          area(),
          body({ isStatic: true }),
          anchor("center"),
          "neighboor3",
        ],
        4: () => [
          sprite("metal", { width: 64, height: 64 }),
          area(),
          body({ isStatic: true }),
          anchor("center"),
          "neighboor4",
        ],
        5: () => [
          sprite("metal", { width: 64, height: 64 }),
          area(),
          body({ isStatic: true }),
          anchor("center"),
          "neighboor5",
        ],
        W: () => [
          sprite("window", { width: 64, height: 64 }),
          area(),
          rotate(90),
          body({ isStatic: true }),
          anchor("center"),
        ],
      },
    }
  );

  const plantDeco1 = add([
    sprite("plantDeco", { width: 64, height: 64 }),
    pos(670, 280),
    area(),
    body({ isActive: true }),
    "plantDeco",
  ]);

  const plantDeco2 = add([
    sprite("plantDeco", { width: 64, height: 64 }),
    pos(930, 280),
    area(),
    body({ isActive: true }),
    "plantDeco",
  ]);

  const plantDeco3 = add([
    sprite("plantDeco", { width: 64, height: 64 }),
    pos(930, 500),
    area(),
    body({ isActive: true }),
    "plantDeco",
  ]);

  const plantDeco4 = add([
    sprite("plantDeco", { width: 64, height: 64 }),
    pos(600, 500),
    area(),
    body({ isActive: true }),
    "plantDeco",
  ]);

  const carpet = add([
    sprite("carpet", { width: 126, height: 126 }),
    pos(800, 350),
    area(),
    "carpet",
  ]);

  const elevator = add([
    sprite("metal", { width: 260, height: 160 }),
    pos(1450, 280),
    area(),
    body({ isActive: true }),
    rotate(90),
    "metal",
  ]);

  const player = add([
    sprite("heroDown", { width: 38, height: 64 }),
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

  function addDialog(position) {
    const h = 220;
    const pad = 16;
    const textOffset = 80;
    const bg = add([
      pos(width() / 4, height() - h),
      rect(width(), h),
      color(0, 0, 0),
      z(100),
    ]);
    const txt = add([
      text("", {
        width: width() / 2 - 2 * pad,
      }),
      pos(width() / 2.5 + pad, height() - h + pad),
      z(100),
    ]);
    bg.hidden = true;
    txt.hidden = true;

    onUpdate(() => {
      const camCenter = camPos();
      if (position === "top") {
        bg.pos = vec2(camCenter.x - width() / 2, camCenter.y - height() / 2);
        txt.pos = vec2(
          camCenter.x - txt.width / 2,
          camCenter.y - height() / 2 + pad + textOffset
        );
      } else {
        bg.pos = vec2(
          camCenter.x - width() / 2,
          camCenter.y + height() / 2 - h
        );
        txt.pos = vec2(
          camCenter.x - txt.width / 2,
          camCenter.y + height() / 2 - h + pad + textOffset
        );
      }
    });
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
      dialogTop.dismiss();
      dialogBottom.dismiss();
      dialog.dismiss();
    });
    onKeyDown(dir, () => {
      player.move(dirs[dir].scale(SPEED));
    });
  }

  const dialogTop = addDialog("top");
  const dialogBottom = addDialog("bottom");

  player.onCollide("metal", () => {
    dialog.say(
      "Oh non !! L'ascenseur est en panne !! Comment vais-je faire ??"
    );
  });
  player.onCollide("neighboor1", () => {
    dialogTop.say(
      "Ça sent la raclette ici. Xavier et Marie doivent se régaler mais ils ne pourront pas m'aider"
    );
  });
  player.onCollide("neighboor2", () => {
    dialogTop.say(
      "J'entends Arthur hurler. Son garçon doit avoir fait une bêtise."
    );
  });
  player.onCollide("neighboor3", () => {
    dialogTop.say(
      "C'est chez Cyrille ici. J'aimerais beaucoup aller boire un verre avec lui un de ces quatres"
    );
  });
  player.onCollide("neighboor4", () => {
    dialogBottom.say(
      "SORTEZ D'ICI !! Leo va commencer à nous raconter des blagues et nous serons forcément en retard"
    );
  });
  player.onCollide("neighboor5", () => {
    dialogBottom.say(
      "Du Metal à fond.. Heuresement qu'Ileano déménage bientôt."
    );
  });

  player.onCollide("metal", () => {
    go("maze", 0);
  });
});
// FIN DE LA SCENE metal1

go("start");
