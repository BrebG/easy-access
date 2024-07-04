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
loadSprite("pedestrian", "sprites/bean.png")

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
			"x": () => [
				sprite("brickWall", { width: 64, height: 64 }),
				area(),
				body({ isStatic: true }),
				anchor("center"),
			],
			"_": () => [
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
		go("car");
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
	const metal = add([sprite("metal"), pos(width("100vw") - 200, (height("100vh") - 200)), area(), body(), "metal"]);

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

scene("office", () => {

	loadSprite("officeWall", "/sprites/officeWall.png");
	loadSprite("officeFloor", "/sprites/officeFloor.png");

	const levels = [

		"pxxxxxxpxxxxxxxxxp",
		"p______p_________p",
		"p______p_________p",
		"p______p_________p",
		"p______p_________p",
		"pxx_xxxx_________p",
		"p________________p",
		"p________________p",
		"p________________p",
		"p________________p",
		"p________________p",
		"p________________p",
		"p________________p",
		"p________________p",
		"xx|xxxxxxxxxxxxxxx",

	];

	const level = addLevel(levels, {
		tileWidth: 64,
		tileHeight: 64,
		pos: vec2(0, 0),

		tiles: {
			"x": () => [
				sprite("officeWall", { width: 64, height: 64 }),
				area(),
				body({ isStatic: true }),
				anchor("center"),
			],
			"p": () => [
				sprite("brickWall", { width: 64, height: 64 }),
				area(),
				body({ isStatic: true }),
				anchor("center"),
			],
			"_": () => [
				sprite("officeFloor", { width: 64, height: 64 }),
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

	const player = add([
		sprite("heroDown", { width: 48, height: 64 }),
		pos(100, 100),
		area(),
		body(),
		"player",
	]);


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

	player.onUpdate(() => {
		camPos(player.pos);
	});

	loadSprite("doorOpen", "/sprites/doorOpen.png");

	const doorOpen = add([
		sprite("doorOpen", { width: 64, height: 64 }),
		pos(160, 290),
		area(),
		"doorOpen",
	]);

	loadSprite("windowDouble", "/sprites/windowDouble.png");

	const windowDouble = add([
		sprite("windowDouble", { width: 140, height: 50 }),
		pos(155, -35),
		area(),
		body({ isStatic: true }),
		"windowDouble",
	]);

	loadSprite("table", "/sprites/table.png");

	const table = add([
		sprite("table", { width: 128, height: 64 }),
		pos(160, 80),
		area(),
		body({ isStatic: true }),
		"table",
	]);

	loadSprite("officeArmchair", "/sprites/officeArmchair.png");

	const officeArmchair = add([
		sprite("officeArmchair", { width: 64, height: 64 }),
		pos(160, 30),
		area(),
		body({ isStatic: true }),
		"officeArmchair",
	]);

})


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

	startButton.onClick(() => go("office"));
});

go("start");
