import { Tower } from '../tower'

export class MultiTower extends Tower {
	name: string = 'MultiTower'
	maxTargets: number = 3
	damage: number = 1
	range: number = 100
	static cost: number = 50
}
