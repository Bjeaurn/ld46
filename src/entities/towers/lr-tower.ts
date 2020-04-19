import { Tower } from '../tower'

export class LongRangeTower extends Tower {
	name: string = 'Long Range'
	attackSpeed: number = 10
	damage: number = 0.1
	range: number = 300
	maxTargets: number = 1
	static cost: number = 25
}
