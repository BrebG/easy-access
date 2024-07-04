import kaboom from "kaboom";

kaboom();

loadSprite("car", "sprites/voiture1.png");
loadSprite("car2", "sprites/voiture2.png");
loadSprite("player", "sprites/player.png");
loadSprite("metal", "sprites/metal.png");
loadSprite("pedestrian", "sprites/bean.png");
loadSprite("grass", "sprites/grass.png");
loadSprite("road", "sprites/road.jpg");

let SPEED = 480;

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

	const player = add([sprite("player"), pos(80, 40), area(), "player"]);
	const metal = add([sprite("metal"), pos(1700, 800), area(), body(), "metal"]);

	player.onCollide("metal", () => {
		go("maze");
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

scene("maze", () => {
	add([sprite("grass", { width: width("100vw"), height: height("100vh") })]);

	loop(1, () => {
		createPedestrian(rand(0, width()), rand(0, height()));
	});

	const player = add([sprite("player"), pos(70, 800), area(), "player"]);
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

go("car");
carScene();
