import kaboom from "kaboom"

kaboom()

loadSprite("bean", "sprites/bean.png")

setGravity(1600)
const bean = add([
	sprite("bean"),
	pos(80, 40),
	area(),
	body(),
])

onKeyPress("space", () => {
	if (bean.isGrounded()) {
		bean.jump();
	}
})
add([
	rect(width(), 48),
	pos(0, height() - 48),
	outline(4),
	area(),
	body({ isStatic: true }),
	color(127, 200, 255),
])

loop(1, () => {
	add([
		rect(48, 64),
		area(),
		outline(4),
		pos(width(), height() - 48),
		anchor("botleft"),
		color(255, 180, 255),
		move(LEFT, 240),
		"tree",
	]);
})

bean.onCollide("tree", () => {
	addKaboom(bean.pos);
	shake();
})