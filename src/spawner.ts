import { Gine } from 'gine'

import { Enemy } from './entities/enemy'
import { Entity } from './entity'
import { Game } from './game'
import { Position } from './map'

export class Spawner {
    readonly spider = Gine.store.get('spider')
    
    readonly lanePositions: Array<Position & { direction: number}>= [
        {x: 512, y: 0, direction: 180},
        {x: 1024, y: 512, direction: 270},
        {x: 512, y: 1024, direction: 0},
        {x: 0, y: 512, direction: 90}
    ]

	constructor(
		private target: Position,
        private amountOfEnemiesPerLane: number,
        private spread: number = 16,
		private lanes: [boolean, boolean, boolean, boolean] = [
			true,
			true,
			true,
			true,
		]
	) {
		this.lanes.forEach((val, idx) => {
			if (val === true) 
				for (var i = 0; i < this.amountOfEnemiesPerLane; i++) {
                    const lane = this.lanePositions[idx]
                    Entity.entities.push(new Enemy(this.spider, this.target, lane.direction, lane.x, lane.y, i * 120))
                    Game.enemies++
				}
			}
		})
	}
}
