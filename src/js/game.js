let mariposa;
let cursors;

class Game extends Phaser.Scene {
    constructor() {
        super('game');
    }

    preload() {
        // Cargar tileset y mapa
        this.load.image('tiles', 'public/assets/tilemaps/tiles.png');
        this.load.tilemapTiledJSON('mapa', 'public/assets/tilemaps/mapa.json');

        // Cargar sprite de mariposa
        this.load.image('mariposa', 'public/assets/images/mariposa.png');
    }

    create() {
        // Crear el mapa desde el archivo JSON
        const map = this.make.tilemap({ key: 'mapa' });

        // Asociar el nombre del tileset (de Tiled) con el archivo de imagen
        const tileset = map.addTilesetImage('assets', 'tiles');

        // Crear la capa llamada "plataforma" 
        const layer = map.createLayer('Plataforma', tileset, 0, 0);

        // Activar colisión en los tiles con la propiedad "colision: true"
        layer.setCollisionByProperty({ colision: true });

        // Buscar el objeto "Jugador" desde la capa de objetos
        const spawnPoint = map.findObject('objetos', obj => obj.name === 'Jugador');

        // Crear sprite de la mariposa
        mariposa = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'mariposa');
        mariposa.setCollideWorldBounds(true);

        // Hacer que la mariposa colisione con la capa
        this.physics.add.collider(mariposa, layer);

        // Cámara que sigue a la mariposa
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(mariposa);

        // Controles del teclado
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Movimiento básico
        mariposa.body.setVelocity(0);
        const speed = 100;

        if (cursors.left.isDown) {
            mariposa.body.setVelocityX(-speed);
        } else if (cursors.right.isDown) {
            mariposa.body.setVelocityX(speed);
        }

        if (cursors.up.isDown) {
            mariposa.body.setVelocityY(-speed);
        } else if (cursors.down.isDown) {
            mariposa.body.setVelocityY(speed);
        }
    }
}

// Configuración del juego
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: Game
};

// Iniciar el juego
const game = new Phaser.Game(config);
