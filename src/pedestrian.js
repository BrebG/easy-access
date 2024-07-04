import kaboom from "kaboom";

kaboom();

loadSprite("pedestrian", "sprites/bean.png");
loadSprite("player", "sprites/player.png");

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

// player.onGround(() => {
// 	debug.log("ouch");
// });

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

// debug.inspect = true;
