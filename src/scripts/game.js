import 'phaser'
import '@babel/polyfill'

import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'
import {MenuScene} from "./scenes/menuScene";

const DEFAULT_WIDTH = 1280
const DEFAULT_HEIGHT = 720

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#000000',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [
      PreloadScene,
      MenuScene,
      MainScene
  ],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { x: 0, y: 0 }
    }
  },
  pixelArt: true,
  roundPixels: true,
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config);
})
