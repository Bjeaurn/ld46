import { ImageAsset } from 'gine'

import { Entity } from '../entity'

export class Core extends Entity {
	health: number = 1

	constructor(img: ImageAsset) {
		super(img)
	}

	damage() {
		this.health -= 1

		if (this.health <= 0) {
			this.die()
		}
	}

	die() {
		Entity.delete(this)
	}
}
