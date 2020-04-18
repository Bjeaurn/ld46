import { Gine, ImageAsset, IMousePosition } from 'gine'

import { Camera } from '../camera'
import { Entity } from '../entity'
import { Position } from '../map'
import { Enemy } from './enemy'

export class Tower extends Entity {
	type: 'tower' = 'tower'
	damage: number = 1
	attackSpeed: number = 40
	attackDelay: number = 0
	hitDelay: number = 0
	range: number = 80
	target?: Enemy
	constructor(img: ImageAsset, x: number, y: number) {
		super(img)
		this.pos.x = x
		this.pos.y = y
		console.log(this)
	}

	update() {
		if (this.target) {
			this.fireOnTarget(this.target)
			if (this.target.health <= 0) {
				this.target = undefined
			}
		} else {
			this.lookForTarget()
		}
	}

	draw(cameraPos: Position) {
		if (this.target) {
			this.direction =
				Math.atan2(
					this.target.pos.y - this.pos.y,
					this.target.pos.x - this.pos.x
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

	fireOnTarget(target: Enemy) {
		if (this.attackDelay > 0) {
			this.attackDelay -= 1
		} else {
			target.hit(this.damage)
			this.attackDelay = this.attackSpeed
		}
	}

	calculateDistance(target: Enemy) {
		const x = target.pos.x - this.pos.x
		const y = target.pos.y - this.pos.y
		this.hitDelay = Math.abs(x + y)
	}

	lookForTarget() {
		this.target = Entity.getInCircle(this.pos.x, this.pos.y, this.range).filter(
			Enemy.IsEnemy
		)[0] as Enemy
	}

	static IsTower(e: Entity): boolean {
		return e && !!e.type && e.type === 'tower'
	}
}

export function showTowerData(tower: Tower, camera: Camera) {
	const x = tower.pos.x - camera.adjustPosition().x
	const y = tower.pos.y - camera.adjustPosition().y
	Gine.handle.handle.fillStyle = 'rgba(255, 255, 255, 0.6)'
	Gine.handle.handle.fillRect(x - 20, y - 60, 60, 80)
	Gine.handle.setColor(0, 0, 0)
	Gine.handle.text('Tower', x - 16, y - 48)
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
