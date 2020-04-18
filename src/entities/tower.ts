import { ImageAsset } from 'gine'

import { Entity } from '../entity'
import { Enemy } from './enemy'

export class Tower extends Entity {
	type: 'tower' = 'tower'
	damage: number = 1
	attackSpeed: number = 1
	attackDelay: number = 0
	range: number = 80
	target?: Enemy
	constructor(img: ImageAsset) {
		super(img)
		console.log(this)
	}

	update() {
		if (this.target) {
			this.fireOnTarget(this.target)
		} else {
			this.lookForTarget()
		}
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
