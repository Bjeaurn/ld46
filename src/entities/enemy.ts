import { ImageAsset } from 'gine'

import { Entity } from '../entity'
import { Position } from '../map'

export class Enemy extends Entity {
	health: number = 1
	target: Position
	moveSpeed: number = 0.5
	type: 'enemy' = 'enemy'
	constructor(img: ImageAsset, target: Position) {
		super(img)
		this.target = target
	}

	hit(damage: number) {
		this.health -= damage
		if (this.health <= 0) {
			this.die()
		}
	}

	update() {
		let vector: Position = {
			x: this.target.x - this.pos.x,
			y: this.target.y - this.pos.y,
		}
		if (vector.x > 0) vector.x = 1
		if (vector.x < 0) vector.x = -1
		if (vector.y > 0) vector.y = 1
		if (vector.y < 0) vector.y = -1

		this.pos.x += vector.x * this.moveSpeed
		this.pos.y += vector.y * this.moveSpeed
	}

	die() {
		Entity.delete(this)
	}

	static IsEnemy(e: Entity): boolean {
		return e && !!e.type && e.type === 'enemy'
	}
}
