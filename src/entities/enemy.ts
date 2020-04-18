import { Gine, ImageAsset } from 'gine'

import { Entity } from '../entity'
import { Game } from '../game'
import { Position } from '../map'

export interface EnemyOptions {
	maxHealth: number
	moveSpeed: number
	worth: number
}

export class Enemy extends Entity {
	maxHealth: number
	health: number
	target: Position
	moveSpeed: number
	worth: number
	type: 'enemy' = 'enemy'
	constructor(
		img: ImageAsset,
		target: Position,
		direction: number,
		x: number,
		y: number,
		private delay: number = 0,
		private options: EnemyOptions = {
			maxHealth: 3,
			moveSpeed: 0.2,
			worth: 1,
		}
	) {
		super(img)
		this.target = target
		this.pos.x = x
		this.pos.y = y
		this.direction = direction
		this.maxHealth = this.options.maxHealth
		this.health = this.maxHealth
		this.moveSpeed = options.moveSpeed
		this.worth = options.worth
	}

	hit(damage: number) {
		this.health -= damage
		if (this.health <= 0) {
			this.die()
		}
	}

	update() {
		if (this.delay > 0) {
			this.delay--
		} else {
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
	}

	draw(cameraPos: Position) {
		super.draw(cameraPos)
		Gine.handle.handle.strokeRect(
			this.pos.x - this.img.width - cameraPos.x,
			this.pos.y - this.img.height - cameraPos.y - 4,
			this.img.width,
			6
		)
		const healthPercentage = this.health / this.maxHealth
		const width = healthPercentage * this.img.width
		Gine.handle.handle.fillStyle = 'green'
		if (healthPercentage < 0.5) {
			Gine.handle.handle.fillStyle = 'yellow'
		}
		if (healthPercentage < 0.2) {
			Gine.handle.handle.fillStyle = 'red'
		}
		Gine.handle.handle.fillRect(
			this.pos.x - this.img.width - cameraPos.x,
			this.pos.y - this.img.height - cameraPos.y - 4,
			width,
			6
		)
		Gine.handle.handle.fillStyle = 'black'
	}

	die() {
		Game.ENEMYKILLED(this.worth)
		Entity.delete(this)
	}

	static IsEnemy(e: Entity): boolean {
		return e && !!e.type && e.type === 'enemy'
	}
}
