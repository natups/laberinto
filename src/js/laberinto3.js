export default class Game extends Phaser.Scene {
    constructor() {
        super('laberinto3');
    }

    init(data) {
        this.totalItems = data.totalItems || 0;
    }

    preload() {
        this.load.image('tilemap1', 'public/assets/tilemaps/tilemap1.png');
        this.load.tilemapTiledJSON('mapa3', 'public/assets/tilemaps/mapa3.json');
        this.load.image('mariposa', 'public/assets/images/mariposa.png');
        this.load.image('Flor', 'public/assets/images/flor.png');
        this.load.image('portal', 'public/assets/images/portal.png');
        this.load.image('mosca', 'public/assets/images/mosca.png');
    }

    create() {
        const map = this.make.tilemap({ key: 'mapa3' });
        const tileset = map.addTilesetImage('tilemap1', 'tilemap1');
        const layer = map.createLayer('plataforma', tileset, 0, 0);
        layer.setCollisionByProperty({ colision: true });

        const spawnPoint = map.findObject('objetos', obj => obj.name === 'Jugador');
        this.mariposa = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'mariposa');
        this.mariposa.setCollideWorldBounds(true);
        this.physics.add.collider(this.mariposa, layer);

        this.physics.world.setBounds(0, 0, 3840, 800);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.mariposa);
        this.cameras.main.setZoom(3);

        this.Flores = this.physics.add.group();
        const objetosFlores = map.getObjectLayer('objetos').objects.filter(obj => obj.name === 'Flor');
        objetosFlores.forEach(obj => {
            this.Flores.create(obj.x, obj.y - obj.height, 'Flor');
        });

        this.itemsRecolectados = 0;

        this.physics.add.overlap(this.mariposa, this.Flores, (mariposa, flor) => {
            flor.destroy();
            this.itemsRecolectados++;
            this.itemText.setText(`Items ${this.itemsRecolectados}/5`);
        }, null, this);

        this.mensajeTexto = this.add.text(30, 80, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            fill: '#FFD700'
        });

        // Enemigos
        this.enemigos = this.physics.add.group();
        this.physics.add.collider(this.enemigos, layer);

        // Crear enemigos
        map.getObjectLayer('objetos').objects.forEach(obj => {
            if (obj.name === 'Enemigo') {
                const enemigo = this.enemigos.create(obj.x, obj.y - obj.height, 'mosca');
                enemigo.setCollideWorldBounds(true);
                enemigo.body.setAllowGravity(false);
                enemigo.setVelocityY(100); // velocidad inicial hacia abajo
                enemigo.body.setBounce(1, 1); // rebote al colisionar
                enemigo.setScale(1.5);
            }
        });

        // Colisión entre enemigos y paredes, con rebote invertido manual
        this.physics.add.collider(this.enemigos, layer, (enemigo, tile) => {
            enemigo.body.velocity.y *= -1;
        });

        // Colisión con jugador
        this.physics.add.overlap(this.mariposa, this.enemigos, () => {
            const spawnPoint = map.findObject('objetos', obj => obj.name === 'Jugador');
            this.mariposa.setPosition(spawnPoint.x, spawnPoint.y);
        }, null, this);

        const portalObj = map.findObject('objetos', obj => obj.name === 'Portal');
        this.portal = this.physics.add.sprite(portalObj.x, portalObj.y - portalObj.height, 'portal');
        this.portal.setImmovable(true);
        this.portal.body.setAllowGravity(false);

        this.physics.add.overlap(this.mariposa, this.portal, () => {
            if (this.itemsRecolectados >= 5) {
                this.scene.start('victoria', {
                totalItems: this.totalItems + this.itemsRecolectados
                });
            } else {
                this.mensajeTexto.setText('¡Recolecta las 5 flores!');
                this.time.delayedCall(2000, () => {
                    this.mensajeTexto.setText('');
                });
            }
        }, null, this);

        this.itemText = this.add.text(30, 30, 'Items 0/5', {
            fontFamily: '"Press Start 2P"',
            fontSize: '36px',
            fill: '#FFFFFF'
        });

        this.uiCamera = this.cameras.add(0, 0, this.game.config.width, this.game.config.height);
        this.uiCamera.ignore([layer, this.mariposa]);
        this.cameras.main.ignore([this.itemText]);
        this.uiCamera.ignore(this.Flores.getChildren());
        this.cameras.main.ignore([this.itemText, this.mensajeTexto]);

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