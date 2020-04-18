import { Config, DEFAULT_CONFIG, Gine, IConfigArguments, Scene } from 'gine'
import { filter } from 'rxjs/operators'

import { MainScene } from './scenes/main'

const cfg: Config = new Config(
	<HTMLCanvasElement>document.querySelector('#game'),
	Object.assign(DEFAULT_CONFIG, {
		tileSize: 32,
		width: 600,
		height: 400,
		tickRate: 120,
		usesTiles: true,
		enableKeyboard: true,
		enableMouse: true,
	} as IConfigArguments)
)

const game = new Gine(cfg)

const assets: any[] = [
	{ name: 'placeholder', src: 'placeholder.png' },
	{ name: 'background', src: 'background.png' },
	{ name: 'spider', src: 'spider.png' },
]
assets.forEach((d) => {
	Gine.store.image(d.name, d.src)
})
const mainScene = new MainScene()
game.changeScene(mainScene)
game.start()

Gine.keyboard.key$.subscribe()

Gine.events
	.pipe(filter((ev) => ev === Scene.DESTROY_CURRENT_SCENE))
	.subscribe((ev) => {
		game.changeScene(mainScene)
	})

Gine.events.subscribe((ev) => console.log(ev))
