export default class Game extends Phaser.Scene {
    constructor() {
        super('laberinto1');
    }

    init() {
        this.totalItems = 0;  // No hay datos que llegar, iniciamos en 0
    }


    preload() {
        // mapa y assets
        this.load.image('tilemap1', 'public/assets/tilemaps/tilemap1.png');
        this.load.tilemapTiledJSON('mapa1', 'public/assets/tilemaps/mapa1.json');

        // Cargar sprite de mariposa
        this.load.image('mariposa', 'public/assets/images/mariposa.png');
        // flor asset
        this.load.image('Flor', 'public/assets/images/flor.png');
        // portal asset
        this.load.image('portal', 'public/assets/images/portal.png');
    }

    create() {
        // Crear el mapa desde el archivo JSON
        const map = this.make.tilemap({ key: 'mapa1' });

        // Asociar el nombre del tileset (de Tiled) con el archivo de imagen
        const tileset = map.addTilesetImage('tilemap1', 'tilemap1');

        // Crear la capa llamada "plataforma" 
        const layer = map.createLayer('plataforma', tileset, 0, 0);

        // Activar colisión en los tiles con la propiedad "colision: true"
        layer.setCollisionByProperty({ colision: true });

        // Buscar el objeto "Jugador" desde la capa de objetos
        const spawnPoint = map.findObject('objetos', obj => obj.name === 'Jugador');

        // Crear sprite de la mariposa
        this.mariposa = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'mariposa');
        this.mariposa.setCollideWorldBounds(true);

        // Hacer que la mariposa colisione con la capa
        this.physics.add.collider(this.mariposa, layer);

        // Agrando el rango de pantalla al mapa creado en tiled
        this.physics.world.setBounds(0, 0, 3840, 800);

        // Cámara que sigue a la mariposa
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels); // la camara no se sale de los limites del mapa
        this.cameras.main.startFollow(this.mariposa);

        this.Flores = this.physics.add.group();
        const objetosFlores = map.getObjectLayer('objetos').objects.filter(obj => obj.name === 'Flor');

        objetosFlores.forEach(obj => {
            this.Flores.create(obj.x, obj.y - obj.height, 'Flor'); // Ajuste Y correcto según Tiled
        });

        // recoleccion de items !!
        this.itemsRecolectados = 0;

        this.physics.add.overlap(this.mariposa, this.Flores, (mariposa, flor) => {
        flor.destroy();
        this.itemsRecolectados++;
        this.itemText.setText(`Items ${this.itemsRecolectados}/5`);
        }, null, this);


        // texto por si no llega a recolectar todos los items
        this.mensajeTexto = this.add.text(30, 80, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            fill: '#FFD700'
        });

        const portalObj = map.findObject('objetos', obj => obj.name === 'Portal');
        this.portal = this.physics.add.sprite(portalObj.x, portalObj.y - portalObj.height, 'portal');
        this.portal.setImmovable(true);
        this.portal.body.setAllowGravity(false); 

        this.physics.add.overlap(this.mariposa, this.portal, () => {
        if (this.itemsRecolectados >= 5) {
            this.scene.start('laberinto2', {
                totalItems: this.itemsRecolectados
            });
        } else {
            this.mensajeTexto.setText('¡Recolecta las 5 flores!');
            this.time.delayedCall(2000, () => {
                this.mensajeTexto.setText('');
            });
        }
        }, null, this);

        // Creo el texto de los ítems
        this.itemText = this.add.text(30, 30, 'Items 0/5', {
            fontFamily: '"Press Start 2P"',
            fontSize: '36px',
            fill: '#FFFFFF'
        });

        // Crear una segunda cámara solo para la UI (HUD del juego)
        this.uiCamera = this.cameras.add(0, 0, this.game.config.width, this.game.config.height);
        this.uiCamera.ignore([layer, this.mariposa]); // Ignora el mundo del juego
        this.cameras.main.ignore([this.itemText]); // Ignora el texto en la cámara con zoom
        this.uiCamera.ignore(this.Flores.getChildren()); // Ignora todas las flores
        this.uiCamera.ignore([layer, this.mariposa]); // cámara del HUD ignora el mundo
        this.cameras.main.ignore([this.itemText, this.mensajeTexto]); // cámara principal ignora el texto

        // Controles del teclado
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        const speed = 300;
        this.mariposa.body.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.mariposa.body.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.mariposa.body.setVelocityX(speed);
        }

        if (this.cursors.up.isDown) {
            this.mariposa.body.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.mariposa.body.setVelocityY(speed);
        }
    }
}
