import kaboom from "kaboom";

kaboom();

loadSprite("car", "sprites/bean.png");
loadSprite("player", "sprites/player.png");

let SPEED = 480;

const carSpeed = 200;
const carDirection = vec2(1, 0);

function spawnFirstCar() {
	add([
		sprite("car"),
		pos(0, 250),
		area(),
		body(),
		move(carDirection, carSpeed),
		"car",
	]);
	wait(rand(1, 4), spawnFirstCar);
}
spawnFirstCar();
function spawnSecondCar() {
	add([
		sprite("car"),
		pos(1920, 400),
		area(),
		body(),
		move(vec2(-1, 0), carSpeed),
		"car",
	]);
	wait(rand(1, 4), spawnSecondCar);
}
spawnSecondCar();
function spawnThirdCar() {
	add([
		sprite("car"),
		pos(0, 550),
		area(),
		body(),
		move(carDirection, carSpeed),
		"car",
	]);
	wait(rand(1, 4), spawnThirdCar);
}
spawnThirdCar();
function spawnFourthCar() {
	add([
		sprite("car"),
		pos(0, 700),
		area(),
		body(),
		move(carDirection, carSpeed),
		"car",
	]);
	wait(rand(1, 4), spawnFourthCar);
}
spawnFourthCar();

const player = add([sprite("player"), pos(80, 40), area(), "player"]);

player.onCollide("car", () => {
	burp();
	addKaboom(player.pos);
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
