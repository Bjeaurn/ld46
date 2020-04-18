export class Game {
	static MONEY: number = 50
	static towerPrice: number = 10
	static LEVEL: number = 1
	static enemies: number = 0
	static levelCompleted: boolean = false

	static ENEMYKILLED(worth: number) {
		Game.MONEY += worth
		Game.enemies--
		if (this.enemies == 0) {
			Game.levelCompleted = true
		}
	}
}
