import { Gine, KEYCODES, Scene } from 'gine'

import { Camera } from '../camera'
import { Core } from '../entities/core'
import { Enemy } from '../entities/enemy'
import { Tower } from '../entities/tower'
import { Entity } from '../entity'
import { GameMap } from '../map'

export class MainScene extends Scene {
	readonly bg = Gine.store.get('background')
	readonly placeholder = Gine.store.get('placeholder')
	readonly spider = Gine.store.get('spider')
	map: GameMap = new GameMap(32, 32)
	camera: Camera = new Camera()
	core: Core = new Core(this.placeholder)

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
		const spider = new Enemy(this.spider, this.core.pos)
		spider.direction = 180
		spider.pos = {
			x: half * Gine.CONFIG.tileSize,
			y: 0,
		}
		Entity.entities.push(spider)

		const tower = new Tower(this.placeholder)
		tower.pos = { x: 440, y: 440 }
		Entity.entities.push(tower)
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
	}

	frame() {
		this.map.draw(this.camera.adjustPosition())
		Entity.entities.forEach((e) => {
			e.draw(this.camera.adjustPosition())
		})
		if (this.core.health <= 0) {
			Gine.handle.text(
				'You have lost!',
				Gine.CONFIG.width / 2,
				Gine.CONFIG.height / 2
			)
		}
	}
}
