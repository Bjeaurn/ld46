import { Tower } from '../tower'

export class NukeTower extends Tower {
	name: string = 'Nuke'
	range: number = 600
	damage: number = 100
	attackSpeed: number = 200
	static cost: number = 20
}
