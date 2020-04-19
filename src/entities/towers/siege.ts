import { Tower } from '../tower'

export class SiegeTower extends Tower {
	name: string = 'Siege'
	range: number = 120
	damage: number = 5
	attackSpeed: number = 80
	maxTargets: number = 1
	areaOfEffect: boolean = true
	areaOfEffectArea: number = 24
	static cost: number = 20
}
