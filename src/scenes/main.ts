import { Gine, KEYCODES, Scene } from 'gine'
import { filter, tap } from 'rxjs/operators'

import { Camera } from '../camera'
import { Core } from '../entities/core'
import { Enemy } from '../entities/enemy'
import { drawRange, showTowerData, Tower } from '../entities/tower'
import { Entity } from '../entity'
import { Game } from '../game'
import { GameMap } from '../map'
import { Spawner } from '../spawner'
import { UI } from '../ui'

export class MainScene extends Scene {
	readonly bg = Gine.store.get('background')
	readonly placeholder = Gine.store.get('placeholder')
	readonly tower1 = Gine.store.get('tower-1')
	readonly coin = Gine.store.get('coin')
	map: GameMap = new GameMap(32, 32)
	camera: Camera = new Camera()
	core: Core = new Core(Gine.store.get('core')!)
	game: Game = new Game()
	selectedTower?: Tower = undefined
	ui: UI = new UI()

	constructor() {
		super()
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
		const level = LEVELS[0]
		new Spawner(
			this.core.pos,
			level.amount,
			{
				maxHealth: level.maxHealth,
				worth: level.worth,
				moveSpeed: level.moveSpeed,
			},
			120
		)

		Gine.mouse.mouse$
			.pipe(
				filter((m) => m.type === 'mousedown'),
				tap((m) => {
					const xy = Tower.convertMouseToXY(m, this.camera)
					const existing = Entity.getInRange(xy.x, xy.y, 16).filter(
						Tower.IsTower
					)
					if (existing.length === 1) {
						this.selectedTower = existing[0] as Tower
					} else if (this.ui.selectedTower) {
						if (Game.MONEY >= (this.ui.selectedTower as any).cost) {
							Game.MONEY -= (this.ui.selectedTower as any).cost
							const t = new this.ui.selectedTower(this.tower1, xy.x, xy.y)
							Entity.entities.push(t)
							this.ui.selectedTower = undefined
						}
					}
				})
			)
			.subscribe()

		Gine.mouse.mouse$
			.pipe(
				tap((e) => {
					if (this.ui.selectedTower) {
						const xy = Tower.convertMouseToXY(e, this.camera)
						const adjusted = this.camera.adjustPosition()
						Gine.handle.draw(
							this.tower1,
							xy.x - adjusted.x - Gine.CONFIG.tileSize,
							xy.y - adjusted.y - Gine.CONFIG.tileSize
						)
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

			if (Gine.keyboard.isPressed(KEYCODES.ESCAPE)) {
				this.selectedTower = undefined
			}
			this.camera.move(x, y)

			this.ui.update()
		}

		Entity.entities.forEach((e) => e.update())

		Entity.getInRange(this.core.pos.x, this.core.pos.y, 12)
			.filter(Enemy.IsEnemy)
			.map((e) => {
				e.die(false)
				this.core.damage()
			})

		if (Game.levelCompleted === true) {
			console.log('updating level', Game.LEVEL)
			Game.levelCompleted = false
			Game.LEVEL++
			const level = LEVELS[Game.LEVEL]
			if (level) {
				new Spawner(
					this.core.pos,
					level.amount,
					{
						maxHealth: level.maxHealth,
						worth: level.worth,
						moveSpeed: level.moveSpeed,
					},
					120
				)
			} else {
				// default to randomness!
			}
		}
	}

	second() {
		Entity.entities.forEach((e: any) => {
			if (e && e.second) {
				e.second()
			}
		})
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
		Gine.handle.text(
			'Level: ' + Game.LEVEL + ' / ' + LEVELS.length,
			Gine.CONFIG.width - 60,
			40
		)
		Gine.handle.text('Enemies: ' + Game.enemies, Gine.CONFIG.width - 60, 52)

		this.ui.draw()

		if (this.selectedTower) {
			showTowerData(this.selectedTower, this.camera)
			drawRange(this.selectedTower, this.camera.adjustPosition())
		}

		if (this.core.health <= 0) {
			Gine.handle.text(
				'You have lost!',
				Gine.CONFIG.width / 2,
				Gine.CONFIG.height / 2
			)
		}
	}
}

const LEVELS: {
	maxHealth: number
	moveSpeed: number
	worth: number
	amount: number
}[] = [
	{ maxHealth: 3, moveSpeed: 0.2, worth: 1, amount: 3 },
	{ maxHealth: 3, moveSpeed: 0.3, worth: 1, amount: 5 },
	{ maxHealth: 5, moveSpeed: 0.25, worth: 2, amount: 5 },
	{ maxHealth: 5, moveSpeed: 0.4, worth: 2, amount: 5 },
	{ maxHealth: 10, moveSpeed: 0.2, worth: 3, amount: 5 },
	{ maxHealth: 10, moveSpeed: 0.3, worth: 3, amount: 5 },
	{ maxHealth: 8, moveSpeed: 0.2, worth: 3, amount: 10 },
	{ maxHealth: 10, moveSpeed: 0.3, worth: 3, amount: 10 },
	{ maxHealth: 25, moveSpeed: 0.35, worth: 5, amount: 5 },
	{ maxHealth: 100, moveSpeed: 0.15, worth: 10, amount: 1 },
]
