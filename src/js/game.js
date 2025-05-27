let mariposa;
let cursors;

export default class Game extends Phaser.Scene {
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

        this.physics.world.setBounds(0, 0, 3840, 800);

        // Cámara que sigue a la mariposa
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(mariposa);

        // Controles del teclado
        cursors = this.input.keyboard.createCursorKeys();


        const debugGraphics = this.add.graphics().setAlpha(0.75);
        layer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });
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

