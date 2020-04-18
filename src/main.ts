import {
  Gine,
  Config,
  GineAsset,
  Scene,
  DEFAULT_CONFIG,
  IConfigArguments,
  SpriteOptions
} from 'gine'
import { LoadingScene } from './scenes/loading'
import { MainScene } from './scenes/main'
import { filter } from 'rxjs/operators'

const cfg: Config = new Config(
  <HTMLCanvasElement>document.querySelector('#game'),
  Object.assign(DEFAULT_CONFIG, {
    width: 600,
    height: 400,
    tickRate: 120
  } as IConfigArguments)
)

const game = new Gine(cfg)

const assets: any[] = [{ name: 'logo', src: 'logo.png' }]
assets.forEach(d => {
  Gine.store.image(d.name, d.src)
})
Gine.store.sprite('player', 'braid-run-sprite.png', {
  widthPerImage: 200,
  heightPerImage: 200,
  imagesPerRow: 10,
  numberOfFrames: 27,
  ticksPerFrame: 2
} as SpriteOptions)

const loadingScene = new LoadingScene()
game.changeScene(loadingScene)
game.start()
const mainScene = new MainScene()

Gine.events
  .pipe(filter(ev => ev === Scene.DESTROY_CURRENT_SCENE))
  .subscribe(ev => {
    game.changeScene(mainScene)
  })

Gine.events.subscribe(ev => console.log(ev))
