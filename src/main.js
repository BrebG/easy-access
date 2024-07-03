import kaboom from "kaboom"

kaboom()

const SPEED = 320

loadSprite("bean", "/sprites/bean.png")

scene("game", () => {
	const player = add([
		sprite("bean"),
		pos(100, 200),
		area(),
		body(),
		"player",
	])

	const dirs = {
		"left": LEFT,
		"right": RIGHT,
		"up": UP,
		"down": DOWN,
	}

	for (const dir in dirs) {
		onKeyDown(dir, () => {
			player.move(dirs[dir].scale(SPEED))
		})
	}
})

go("game")