import { Gine, KEYCODES, Scene } from 'gine'
import { filter, tap } from 'rxjs/operators'

import { Camera } from '../camera'
import { Core } from '../entities/core'
import { Enemy } from '../entities/enemy'
import { Tower } from '../entities/tower'
import { Entity } from '../entity'
import { Game } from '../game'
import { GameMap } from '../map'
import { Spawner } from '../spawner'

export class MainScene extends Scene {
	readonly bg = Gine.store.get('background')
	readonly placeholder = Gine.store.get('placeholder')
	readonly coin = Gine.store.get('coin')
	map: GameMap = new GameMap(32, 32)
	camera: Camera = new Camera()
	core: Core = new Core(Gine.store.get('core')!)
	game: Game = new Game()

	constructor() {
		super()
		console.log(this.map)
	}

	init() {
		const pos = this.map.getCenter()
		this.camera.setPosition(pos)
		const half = this.map.width / 2
		this.core.pos = {
			x: half * Gine.CONFIG.tileSize,
			y: half * Gine.CONFIG.tileSize,
		}
		Entity.entities.push(this.core)
		new Spawner(this.core.pos, 1, 60)
		Gine.mouse.mouse$
			.pipe(
				filter((m) => m.type === 'mousedown'),
				tap((m) => {
					if (Game.MONEY >= Game.towerPrice) {
						Game.MONEY -= Game.towerPrice
						const adjusted = this.camera.adjustPosition()
						const x =
							Math.floor((m.x + adjusted.x) / Gine.CONFIG.tileSize) *
								Gine.CONFIG.tileSize +
							Gine.CONFIG.tileSize
						const y =
							Math.floor((m.y + adjusted.y) / Gine.CONFIG.tileSize) *
								Gine.CONFIG.tileSize +
							Gine.CONFIG.tileSize
						if (
							Entity.getInRange(x, y, 16).filter(Tower.IsTower).length === 0
						) {
							Entity.entities.push(new Tower(this.placeholder, x, y))
						}
					} else {
					}
				})
			)
			.subscribe()
	}

	tick() {
		//     LEFT_ARROW: number;
		//     UP_ARROW: number;
		//     RIGHT_ARROW: number;
		//     DOWN_ARROW: number;
		if (Gine.keyboard) {
			let x: number = 0
			let y: number = 0
			if (Gine.keyboard.isPressed(KEYCODES.LEFT_ARROW)) {
				x -= 1
			}
			if (Gine.keyboard.isPressed(KEYCODES.RIGHT_ARROW)) {
				x += 1
			}
			if (Gine.keyboard.isPressed(KEYCODES.UP_ARROW)) {
				y -= 1
			}
			if (Gine.keyboard.isPressed(KEYCODES.DOWN_ARROW)) {
				y += 1
			}
			this.camera.move(x, y)
		}

		Entity.entities.forEach((e) => e.update())

		Entity.getInRange(this.core.pos.x, this.core.pos.y, 12)
			.filter(Enemy.IsEnemy)
			.map((e) => {
				e.die()
				this.core.damage()
			})

		if (Game.levelCompleted === true) {
			Game.levelCompleted = false
			Game.LEVEL++
			new Spawner(this.core.pos, Game.LEVEL, 60)
		}
	}

	frame() {
		this.map.draw(this.camera.adjustPosition())
		Entity.entities.forEach((e) => {
			e.draw(this.camera.adjustPosition())
		})
		const moneyWidth = Gine.handle.handle.measureText('' + Game.MONEY).width
		Gine.handle.draw(this.coin, Gine.CONFIG.width - 16, 8)
		Gine.handle.setColor(242, 242, 73)
		Gine.handle.text(Game.MONEY, Gine.CONFIG.width - moneyWidth - 20, 20)
		Gine.handle.setColor(255, 255, 255)
		if (this.core.health <= 0) {
			Gine.handle.text(
				'You have lost!',
				Gine.CONFIG.width / 2,
				Gine.CONFIG.height / 2
			)
		}
	}
}
