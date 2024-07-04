import kaboom from "kaboom";

kaboom();

loadSprite("car", "sprites/voiture1.png");
loadSprite("car2", "sprites/voiture2.png");
loadSprite("player", "sprites/player.png");
loadSprite("metal", "sprites/metal.png");
loadSprite("bg", "sprites/road.jpg");

let SPEED = 480;

const carSpeed = 200;
const carDirection = vec2(1, 0);

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

export default carScene = () => {
	scene("car", () => {
		add([sprite("bg", { width: width("100vw"), height: height("100vh") })]);

		spawnFirstCar();
		spawnSecondCar();
		spawnThirdCar();
		spawnFourthCar();

		const player = add([sprite("player"), pos(80, 40), area(), "player"]);
		const metal = add([
			sprite("metal"),
			pos(1700, 800),
			area(),
			body(),
			"metal",
		]);

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
	go("car");
};
carScene();
