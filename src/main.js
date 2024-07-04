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
loadSprite("pedestrian", "sprites/man.png");
loadSprite("parkPath", "sprites/path.jpg");
loadSprite("panneau", "sprites/panneau.png");
loadSprite("parquet", "sprites/parquet.png");
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
		pos(width("100vw") - 1700, height("100vh") - 580),
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
		pos(width("100vw") - 500, height("100vh") - 480),
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
		pos(0, 420),
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
		pos(0, 480),
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

	add([
		sprite("parkPath", { width: 300, height: 200 }),
		pos(width("100vw") - 0, height("100vh") - 140),
		rotate(45),
		area(),
		"parkPath",
	]);

	player.onCollide("parkPath", () => {
		go("park");
	});

	player.onCollide("car", () => {
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

	loop(0.5, () => {
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
	add([
		sprite("panneau", { width: 86, height: 64 }),
		pos(width() - 100, 700),
		area(),
		body({ isStatic: true }),
		"panneau",
	]);

	player.onCollideUpdate("pedestrian", () => {
		SPEED = 200;
	});

	player.onCollideEnd("pedestrian", () => {
		SPEED = 250;
	});

	player.onCollide("panneau", () => {
		go("office");
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

		"xxxxxxxx",
		"________",
		"________",
		"________",
		"________",
		"xxx_xxxx",
		"________",
		"________",
		"________",
		"________",
		"________",
		"________",
		"________",
		"________",
		"xxx|xxxx",

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
		pos(140, 790),
		area(),
		body(),
		z(5),
		"player",
	]);

	loadSprite("boss", "/sprites/boss.png");

	const boss = add([
		sprite("boss", { width: 38, height: 64 }),
		pos(204, 50),
		area(),
		body(),
		z(3),
		"boss",
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
		z(4),
		"table",
	]);

	loadSprite("officeArmchair", "/sprites/officeArmchair.png");

	const officeArmchair = add([
		sprite("officeArmchair", { width: 64, height: 64 }),
		pos(190, 30),
		area(),
		z(2),
		"officeArmchair",
	]);

	loadSprite("carpet", "/sprites/carpet.png");

	const carpet = add([
		sprite("carpet", { width: 148, height: 112 }),
		pos(150, 90),
		area(),
		z(1),
		"carpet",
	]);

	function addDialog() {
		const h = 1000;
		const pad = 16;
		const bg = add([
			pos(0, height() - h),
			rect(450, 160),
			color(0, 0, 0),
			z(100),
		]);
		const txt = add([
			text("", {
				width: 450,
				height: 160,
			}),
			pos(0 + pad, height() - h + pad),
			z(100),
		]);
		bg.hidden = true;
		txt.hidden = true;

		let i = 0;
		let texts = [];

		onKeyPress("space", () => {
			if (dialog.active() && i < texts.length - 1) {
				i += 1;
				txt.text = texts[i];
			}
		});

		return {
			setTexts(textArray) {
				texts = textArray;
				i = 0;
			},
			say() {
				if (i < texts.length) {
					txt.text = texts[i];
					bg.hidden = false;
					txt.hidden = false;
				}
			},
			dismiss() {
				if (!this.active()) {
					return;
				}
				txt.text = "";
				bg.hidden = true;
				txt.hidden = true;
				i = 0; // Reset i when dismissed
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

	// Set the array of texts
	dialog.setTexts([
		"Hello Miss Lagertha. I am glad to see that you made it in time.",
		"We have a lot to discuss about the upcoming battle.",
		"Our scouts have reported enemy movement in the nearby forest.",
		"We must prepare our defenses and plan our strategy carefully.",
	]);

	// Trigger the dialog and display the first text
	player.onCollideUpdate("carpet", () => {
		dialog.say();
	});

	// Dismiss the dialog when the player leaves the carpet
	player.onCollideEnd("carpet", () => {
		dialog.dismiss();
	});
})


scene("maze", () => {
	add([sprite("parquet", { width: 1400, height: 900 })]);
	addLevel(
		[
			"yyyyyyyyyyyyyyyyyyyyyyy",
			"y     y   H     y y y y",
			"y yyyyyyy yyyyy y y y y",
			"y       H y y   H     y",
			"yyyyyyyyy y yyyyyyyyyHy",
			"y           y         y",
			"yHyyyyyyyyyyy yyyyyyyyy",
			"y y   y   y     y   y y",
			"y yyyyyyy y yyy  yyyy y",
			"y y        Hy   y     y",
			"D yyyyyyyyy yyy y yyyyy",
			"y y   y   y y   y   y y",
			"y yyy y yyy yyy yyy y y",
			"y           y   H     y",
			"yyyyyyyyyyyyyyyyyyyyyyy",
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

	const player = add([
		sprite("heroDown", { width: 48, height: 50 }),
		pos(1300, 480),
		area(),
		body(),
		"player",
	]);

	player.onUpdate(() => {
		camPos(player.pos);
	});

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
	player.onCollide("door", () => {
		go("car");
	})
});

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
				// _: () => [
				// 	sprite("carrelage", { width: 64, height: 64 }),
				// 	area(),
				// 	anchor("center"),
				// ],
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
	loadSprite("carpet", "/sprites/carpet.png");

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

go("start");
