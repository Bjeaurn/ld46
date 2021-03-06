import { Gine } from 'gine'

export interface Position {
	x: number
	y: number
}

export class GameMap {
	debug: boolean = false
	readonly bg = Gine.store.get('background')
	readonly path = Gine.store.get('path')
	readonly pathlr = Gine.store.get('path-lr')
	mapArray: any[] = []
	readonly width: number
	constructor(widthX: number, widthY: number) {
		this.width = widthX
		// Assuming a square for the map.
		const tiles = widthX * widthY
		this.mapArray = Array(tiles).fill(0, 0, tiles)
		this.mapArray.map((a) => 0)
		const half = Math.floor(this.width / 2) - 1
		for (var i = 0; i < widthY; i++) {
			this.mapArray[this.getIndex(half, i)] = 1
		}
		for (var i = 0; i < widthX; i++) {
			this.mapArray[this.getIndex(i, half)] = 2
		}
	}

	getCenter(): Position {
		const halfH = Math.round(this.width / 2)
		return { x: halfH * Gine.CONFIG.tileSize, y: halfH * Gine.CONFIG.tileSize }
	}

	getIndex(x: number, y: number): number {
		return x + this.width * y
	}

	indexToXY(index: number): Position {
		return {
			x: Math.floor(index % this.width) * Gine.CONFIG.tileSize,
			y: Math.floor(index / this.width) * Gine.CONFIG.tileSize,
		}
	}

	draw(cameraPos: Position = { x: 0, y: 0 }) {
		this.mapArray.forEach((v, i) => {
			const pos = this.indexToXY(i)
			let img = this.bg
			if (v === 1) img = this.path
			if (v === 2) img = this.pathlr
			Gine.handle.draw(img, pos.x - cameraPos.x, pos.y - cameraPos.y)
			if (this.debug) {
				Gine.handle.setColor(255, 255, 255)
				Gine.handle.text(i, pos.x + 16 - cameraPos.x, pos.y + 16 - cameraPos.y)
				Gine.handle.resetColor()
			}
		})
	}
}

//https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid
