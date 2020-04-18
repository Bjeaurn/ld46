import { Gine, ImageAsset } from 'gine'

import { Entity } from '../entity'
import { Position } from '../map'
import { Enemy } from './enemy'

export class Tower extends Entity {
	type: 'tower' = 'tower'
	damage: number = 1
	attackSpeed: number = 40
	attackDelay: number = 0
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
		super.draw(cameraPos)
	}

	drawRange(cameraPos: Position) {
		Gine.handle.handle.beginPath()
		Gine.handle.handle.ellipse(
			this.pos.x - this.img.width / 2 - cameraPos.x,
			this.pos.y - this.img.height / 2 - cameraPos.y,
			this.range,
			this.range,
			Math.PI / 4,
			0,
			2 * Math.PI
		)
		Gine.handle.handle.stroke()
	}

	fireOnTarget(target: Enemy) {
		if (this.attackDelay > 0) {
			this.attackDelay -= 1
		} else {
			target.hit(this.damage)
			this.attackDelay = this.attackSpeed
		}
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
