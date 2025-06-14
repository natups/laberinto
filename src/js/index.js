import laberinto1 from './laberinto1.js';
import laberinto2 from './laberinto2.js';
import laberinto3 from './laberinto3.js';
import victoria from './victoria.js';


var config = {
  type: Phaser.AUTO,
  width: 1080,
  height: 720,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  // Listado de todas las escenas del juego, en orden
  // La primera escena es con la cual empieza el juego
  scene: [laberinto1, laberinto2, laberinto3, victoria],
};

var game = new Phaser.Game(config);
