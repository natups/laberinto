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

        // Agrando el rango de pantalla al mapa creado en tiled
        this.physics.world.setBounds(0, 0, 3840, 800);

        // Cámara que sigue a la mariposa
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels); // la camara no se sale de los limites del mapa
        this.cameras.main.startFollow(mariposa);
        this.cameras.main.setZoom(3); // acercar la cámara

        
        //efecto de luz
        /*
        Rectángulo negro que cubre TODA la vista.
        ScrollFactor 0  → no se mueve con el mapa.
        Depth 1000      → siempre encima (solo efecto visual).
        this.darkness = this.add.graphics()
        .setScrollFactor(0)
        .setDepth(1000);

        this.darkness.fillStyle(0x000000, 0.90);   // 0.90 = opacidad 90 %
        this.darkness.fillRect(
        0, 0,
        this.cameras.main.width,
        this.cameras.main.height
        );

        // Lienzo auxiliar donde dibujaremos el círculo de luz (NO se añade a la escena).
        this.lightMaskGfx = this.make.graphics({ x: 0, y: 0, add: false });

        // Creamos una máscara geométrica invertida basada en ese lienzo todo fuera del círculo quedará oscuro.
        const lightMask = this.lightMaskGfx.createGeometryMask();
        lightMask.invertAlpha = true;

        // Aplicamos la máscara al rectángulo negro.
        this.darkness.setMask(lightMask);

        // Guardamos ref. a la mariposa para usarla en update()
        this.player = mariposa;*/

        // Controles del teclado
        cursors = this.input.keyboard.createCursorKeys();   

        /* const debugGraphics = this.add.graphics().setAlpha(0.75);
        layer.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
        });*/
    }

    update() {
        // Movimiento básico
        mariposa.body.setVelocity(0);
        const speed = 150;

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

        /*
        // Actualizar círculo de luz
        this.lightMaskGfx.clear();

        const cam   = this.cameras.main;
        const zoom  = cam.zoom;

        Posición del jugador relativa a la pantalla,
        ajustada por el zoom.
        const cx = (this.player.x - cam.scrollX) * zoom;
        const cy = (this.player.y - cam.scrollY) * zoom;

        Dibujamos varios círculos concéntricos para un borde suave.
        Ajustá `baseRadius` y la cantidad de pasos a gusto.
        const baseRadius = 60 * zoom;
        for (let i = 0; i < 6; i++) {
            const radius = baseRadius + i * 15 * zoom;   // más grande hacia afuera
            const alpha  = 0.25 - i * 0.04;              // menos opacidad hacia afuera
            this.lightMaskGfx.fillStyle(0xffffff, alpha);
            this.lightMaskGfx.fillCircle(cx, cy, radius);
        }*/
    }
}
