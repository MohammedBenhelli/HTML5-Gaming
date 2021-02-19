export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.isAttacking = false;
        const anims = scene.anims;
        anims.create({
            key: "player-walk",
            frames: anims.generateFrameNumbers("knight", { start: 1, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
        this.sprite = scene.physics.add.sprite(x, y, "knight", 0).setSize(15, 15);
        // this.sprite.anims.play("player-walk");
        this.keys = scene.input.keyboard.createCursorKeys();
    }

    freeze() {
        this.sprite.body.moves = false;
    }

    update(scene) {
        if (this?.sprite?.body !== undefined) {
            const keys = this.keys;
            const sprite = this.sprite;
            const speed = 150;
            sprite.body.setVelocity(0);
            if (keys.left.isDown) {
                sprite.body.setVelocityX(-speed);
                sprite.setFlipX(true);
            } else if (keys.right.isDown) {
                sprite.body.setVelocityX(speed);
                sprite.setFlipX(false);
            }
            if (keys.up.isDown)
                sprite.body.setVelocityY(-speed);
            else if (keys.down.isDown)
                sprite.body.setVelocityY(speed);
            sprite.body.velocity.normalize().scale(speed);
            if (keys.left.isDown || keys.right.isDown || keys.down.isDown || keys.up.isDown)
                sprite.anims.play("player-walk", true);
            else
                sprite.anims.stop();
        }
    }

    destroy() {
        this.sprite.destroy();
    }
}
