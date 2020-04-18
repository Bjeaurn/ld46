import { ImageAsset, Math2D } from 'gine'

import { Position } from './map'

let id = 0
export class Entity {
	pos: Position = { x: 0, y: 0 }
	direction: number = 0
	img: ImageAsset
	type: string = 'entity'
	private id: number = id++

	constructor(img: ImageAsset) {
		this.img = img
	}

	draw(cameraPos: Position) {
		Math2D.rotate(
			this.img,
			this.pos.x - cameraPos.x,
			this.pos.y - cameraPos.y,
			this.direction
		)
	}

	update() {}

	die() {}

	static entities: Entity[] = []

	static getInRange(x: number, y: number, range: number = 1): Entity[] {
		return Entity.entities.filter(
			(e) =>
				e.pos.x <= x + range &&
				e.pos.x >= x - range &&
				e.pos.y <= y + range &&
				e.pos.y >= y - range
		)
	}

	static getInCircle(x: number, y: number, radius: number = 1): Entity[] {
		const r2 = radius * radius
		return Entity.entities.filter(
			(e) => (e.pos.x - x) * (e.pos.x - x) + (e.pos.y - y) * (e.pos.y - y) <= r2
		)
	}

	static delete(e: Entity) {
		console.log(e)
		const idx = Entity.entities.findIndex((et) => et.id === e.id)
		if (idx > -1) {
			Entity.entities.splice(idx, 1)
		}
	}
}
