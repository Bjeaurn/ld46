import { Gine } from 'gine'

import { Position } from './map'

export class Camera {
	moveSpeed: number = 1
	// Offset Camera by half width/height, position is actual center point.
	position: Position = { x: 0, y: 0 }

	setPosition(pos: Position): void {
		this.position = pos
	}

	adjustPosition(): Position {
		const half = Gine.CONFIG.width / 2
		return {
			x: this.position.x - half,
			y: this.position.y - half / 2,
		}
	}

	move(x: number, y: number) {
		this.position.x += x * this.moveSpeed
		this.position.y += y * this.moveSpeed
	}

	getBounds(): [Position, Position] {
		const half = Gine.CONFIG.width / 2
		return [
			{
				x: this.position.x - half - Gine.CONFIG.tileSize,
				y: this.position.y - half - Gine.CONFIG.tileSize,
			},
			{
				x: this.position.x + half + Gine.CONFIG.tileSize,
				y: this.position.y + half + Gine.CONFIG.tileSize,
			},
		]
	}

	debugDraw() {
		Gine.handle.handle.strokeRect(
			this.position.x - Gine.CONFIG.width / 2,
			this.position.y - Gine.CONFIG.height / 2,
			Gine.CONFIG.width,
			Gine.CONFIG.height
		)
	}
}
