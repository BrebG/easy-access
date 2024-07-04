import kaboom from "kaboom";

kaboom();

loadSprite("pedestrian", "sprites/bean.png");
loadSprite("player", "sprites/hero.png");
loadSprite("grass", "sprites/grass.png");

let SPEED = 480;

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

export default mazeScene = () => {
	scene("maze", () => {
		add([sprite("grass", { width: width("100vw"), height: height("100vh") })]);

		loop(1, () => {
			createPedestrian(rand(0, width()), rand(0, height()));
		});

		const player = add([sprite("player"), pos(80, 40), area(), "player"]);

		player.onCollideUpdate("pedestrian", () => {
			SPEED = 200;
		});

		player.onCollideEnd("pedestrian", () => {
			SPEED = 480;
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
};

mazeScene();
