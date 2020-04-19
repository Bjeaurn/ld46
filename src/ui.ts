import { Gine, KEYCODES } from 'gine'

import { Tower } from './entities/tower'
import { LongRangeTower } from './entities/towers/lr-tower'
import { MultiTower } from './entities/towers/multitower'
import { NukeTower } from './entities/towers/nuke'

export class UI {
	readonly tower = Gine.store.get('tower-1')
	selectedTower?: new (...args: any[]) => Tower
	availableTowers: any[] = [Tower, NukeTower, LongRangeTower, MultiTower]

	draw() {
		const h = Gine.CONFIG.height - 40
		Gine.handle.handle.strokeRect(0, h, this.availableTowers.length * 40, 40)
		this.availableTowers.forEach((t, idx) => {
			if (this.selectedTower === t) {
				Gine.handle.setColor(255, 255, 57)
				Gine.handle.handle.strokeStyle = 'rgb(255, 255, 57)'
			}
			Gine.handle.handle.strokeRect(40 * idx, h, 40, 40)
			Gine.handle.draw(this.tower, idx * 40 + 4, h + 4)
			Gine.handle.text(t.cost, idx * 40 + 2, h + 32)
			Gine.handle.setColor(255, 255, 255)
			Gine.handle.handle.strokeStyle = 'rgb(255, 255, 255)'
		})
	}

	update() {
		if (Gine.keyboard.isPressed(KEYCODES[1])) {
			this.selectedTower = this.availableTowers[0]
		} else if (Gine.keyboard.isPressed(KEYCODES[2])) {
			this.selectedTower = this.availableTowers[1]
		} else if (Gine.keyboard.isPressed(KEYCODES[3])) {
			this.selectedTower = this.availableTowers[2]
		} else if (Gine.keyboard.isPressed(KEYCODES[4])) {
			this.selectedTower = this.availableTowers[3]
		} else if (Gine.keyboard.isPressed(KEYCODES.ESCAPE)) {
			this.selectedTower = undefined
		}
	}
}
