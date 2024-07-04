import kaboom from "kaboom";

// Initialize Kaboom
kaboom();

// Constants
const SPEED = 320;

// Load assets
loadSprite("hero", "/sprites/hero.png");
loadSprite("light_switch", "https://kaboomjs.com/sprites/coin.png");
loadSprite("bg", "/sprites/parquet.png");
add([
	sprite("bg", { width: width("100vw"), height: height("100vh") }), // Redimensionner le sprite pour qu'il couvre tout l'écran
]);
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

	"===============",
];

const tileWidth = 64;
const tileHeight = 64;
const levelWidth = levels[0].length * tileWidth;
const levelHeight = levels.length * tileHeight;
const posX = (width() - levelWidth) / 2;
const posY = (height() - levelHeight) / 2;

const level = addLevel(levels, {
	tileWidth: tileWidth,
	tileHeight: tileHeight,
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

// Game state
let isLightOn = true;
let canToggleLight = false;
let canTakeElevator = false;
let blackScreen = null;

function addDialog() {
	const h = 160;
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
	sprite("hero", { width: 64, height: 100 }),
	pos(500, 350),
	area(),
	body(),
	"player",
]);

// Light switch
const lightSwitch = add([
	sprite("light_switch"),
	pos(400, 220),
	area(),
	"light_switch",
]);

// Dialog
const dialog = addDialog();

// Player movement
for (const dir in dirs) {
	onKeyPress(dir, () => {
		dialog.dismiss();
	});
	onKeyDown(dir, () => {
		player.move(dirs[dir].scale(SPEED));
	});
}

// Player collisions
player.onCollide("elevatorOOS", () => {
	dialog.say("The elevator is out of service, I should go find an other one.");
});

player.onCollide("elevator", () => {
	dialog.say("Would you like to use the elevator ? Press 'E' to accept");
	canTakeElevator = true;
	onKeyPress("e", () => {
		if (canTakeElevator) {
			go("next_level", levelIdx + 1);
		}
	});
});

player.onCollideEnd("elevator", () => {
	canTakeElevator = false;
});

player.onCollide("light_switch", () => {
	dialog.say("You found a light switch ! Press 'E' to activate");
	canToggleLight = true;
});

player.onCollideEnd("light_switch", () => {
	canToggleLight = false;
});

player.onCollide("bus", () => {
	dialog.say(
		"Sorry Miss, the access ramp is out of service. The next bus should be here in 20 minutes.",
	);
});

// Toggle light
onKeyPress("e", () => {
	if (canToggleLight) {
		if (isLightOn) {
			isLightOn = false;
			blackScreen = add([
				rect(width(), height()),
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
