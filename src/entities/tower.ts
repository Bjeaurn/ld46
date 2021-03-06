import { Gine, ImageAsset, IMousePosition } from 'gine'

import { Camera } from '../camera'
import { Entity } from '../entity'
import { Position } from '../map'
import { Enemy } from './enemy'

export class Tower extends Entity {
	type: 'tower' = 'tower'
	name: string = 'Single Shot'
	damage: number = 1
	attackSpeed: number = 40
	attackDelay: number = 0
	hitDelay: number = 0
	range: number = 80
	areaOfEffect: boolean = false
	areaOfEffectArea: number = 0
	maxTargets: number = 1
	static cost: number = 10
	targets: Enemy[] = []
	constructor(img: ImageAsset, x: number, y: number) {
		super(img)
		this.pos.x = x
		this.pos.y = y
	}

	update() {
		if (!!this.targets && this.targets.length > 0) {
			if (this.attackDelay > 0) {
				this.attackDelay -= 1
			} else {
				if (this.areaOfEffect === true) {
					this.targets.forEach((t, idx) => {
						const ts = Entity.getInCircle(
							t.pos.x,
							t.pos.y,
							this.areaOfEffectArea
						).filter(Enemy.IsEnemy)
						console.log(ts)
						ts.forEach((target, index) => {
							target.hit(this.damage)
						})
						if (t && t.health <= 0) {
							this.targets!.splice(idx, 1)
						}
					})
				} else {
					this.targets.forEach((target, idx) => {
						target.hit(this.damage)
						if (target !== undefined && target.health <= 0) {
							this.targets!.splice(idx, 1)
						}
					})
				}
				this.attackDelay = this.attackSpeed
			}
		}
		console.log(this.targets.length, this.maxTargets)
		if (this.targets.length < this.maxTargets) {
			this.lookForTarget()
		}
	}

	draw(cameraPos: Position) {
		if (
			this.targets &&
			this.targets.length > 0 &&
			this.targets[0] !== undefined
		) {
			this.direction =
				Math.atan2(
					this.targets[0].pos.y - this.pos.y,
					this.targets[0].pos.x - this.pos.x
				) *
					(180 / Math.PI) +
				90
		}
		super.draw(cameraPos)
	}

	static convertMouseToXY(
		m: IMousePosition,
		camera: Camera
	): { x: number; y: number } {
		const adjusted = camera.adjustPosition()
		const x =
			Math.floor((m.x + adjusted.x) / Gine.CONFIG.tileSize) *
				Gine.CONFIG.tileSize +
			Gine.CONFIG.tileSize
		const y =
			Math.floor((m.y + adjusted.y) / Gine.CONFIG.tileSize) *
				Gine.CONFIG.tileSize +
			Gine.CONFIG.tileSize
		return { x, y }
	}

	calculateDistance(target: Enemy) {
		const x = target.pos.x - this.pos.x
		const y = target.pos.y - this.pos.y
		this.hitDelay = Math.abs(x + y)
	}

	lookForTarget() {
		const targets = Entity.getInCircle(this.pos.x, this.pos.y, this.range)
			.filter(Enemy.IsEnemy)
			.filter((target) => {
				const idx = this.targets.findIndex((t) => t.id === target.id)
				return idx === -1
			})
		if (targets.length > 0) {
			const toAdd = this.maxTargets - this.targets.length
			const add = targets.splice(0, toAdd)
			this.targets.push(...add)
		}
	}

	static IsTower(e: Entity): e is Tower {
		return e && !!e.type && e.type === 'tower'
	}
}

export function showTowerData(tower: Tower, camera: Camera) {
	const x = tower.pos.x - camera.adjustPosition().x
	const y = tower.pos.y - camera.adjustPosition().y
	Gine.handle.handle.fillStyle = 'rgba(255, 255, 255, 0.6)'
	Gine.handle.handle.fillRect(x - 20, y - 60, 60, 80)
	Gine.handle.setColor(0, 0, 0)
	Gine.handle.text(tower.name, x - 16, y - 48)
	Gine.handle.text('Damage: ' + tower.damage, x - 16, y - 28)
	Gine.handle.text('Range: ' + tower.range, x - 16, y - 16)
	Gine.handle.text('Speed: ' + tower.attackSpeed, x - 16, y - 4)
}

export function drawRange(tower: Tower, cameraPos: Position) {
	Gine.handle.handle.beginPath()
	Gine.handle.handle.ellipse(
		tower.pos.x - tower.img.width / 2 - cameraPos.x,
		tower.pos.y - tower.img.height / 2 - cameraPos.y,
		tower.range,
		tower.range,
		Math.PI / 4,
		0,
		2 * Math.PI
	)
	Gine.handle.handle.stroke()
}
