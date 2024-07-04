import kaboom from "kaboom";

kaboom({ background: [0, 0, 0] });

loadSprite("metal", "/sprites/metal.png", {
  sliceX: 2,
  sliceY: 2,
});

const levels = [
  "===============",
  "=          =  =",
  "=             =",
  "=             =",
  "=   =         =",
  "=             =",
  "=             =",
  "=             =",
  "=             =",
  "===============",
];
const tileWidth = 64;
const tileHeight = 64;
const levelWidth = levels[0].length * tileWidth;
const levelHeight = levels.length * tileHeight;
const posX = (width() - levelWidth) / 2;
const posY = (height() - levelHeight) / 2;

const level = addLevel(levels, {
  tileWidth: 64,
  tileHeight: 64,
  pos: vec2(posX, posY),

  tiles: {
    "=": () => [
      sprite("metal"),
      area(),
      body({ isStatic: true }),
      anchor("center"),
    ],
  },
});
