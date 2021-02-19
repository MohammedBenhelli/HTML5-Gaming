class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
    }

    fireTop(x, y) {
        this.range(x,y)
        this.setVelocityY(-300);
    }

    fireRight(x, y) {
        this.range(x,y)
        this.setVelocityX(300);
    }

    fireBottom(x, y) {
        this.range(x,y)
        this.setVelocityY(300);
    }

    fireLeft(x, y) {
        this.range(x,y)
        this.setVelocityX(-300);
    }

    range(x, y) {
        this.setDepth(1);
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.scene.time.addEvent({
            delay: 700,
            callback: () => {
                this.setActive(false);
                this.setVisible(false);
            },
            repeat: 0
        })
    }

    stop() {
        this.setActive(false);
        this.setVisible(false);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }
}

export default class Bullets extends Phaser.Physics.Arcade.Group {
    constructor(scene, sprite) {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 1,
            key: sprite,
            active: false,
            visible: false,
            classType: Bullet
        });
    }

    stop() {
        const bullet = this.getFirstDead(false);
        if (bullet) bullet.stop();
    }

    fireTop(x, y) {
        const bullet = this.getFirstDead(false);
        if (bullet) bullet.fireTop(x, y);
    }

    fireRight(x, y) {
        const bullet = this.getFirstDead(false);
        if (bullet) bullet.fireRight(x, y);
    }

    fireBottom(x, y) {
        const bullet = this.getFirstDead(false);
        if (bullet) bullet.fireBottom(x, y);
    }

    fireLeft(x, y) {
        const bullet = this.getFirstDead(false);
        if (bullet) bullet.fireLeft(x, y);
    }
}
