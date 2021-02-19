export default class Skeleton {
    constructor(scene, x, y) {
        this.scene = scene;
        this.speed = 50;
        const anims = scene.anims;
        anims.create({
            key: "skeleton-walk",
            frames: anims.generateFrameNumbers("skeleton", { start: 1, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
        this.sprite = scene.physics.add.sprite(x, y, "skeleton", 0).setSize(15, 15);
    }

    freeze() {
        this.sprite.body.moves = false;
    }

    follow(player)
    {
        if (this?.sprite?.body !== undefined){
            this.sprite.anims.play("skeleton-walk", true);
            if (player.sprite.x < this.sprite.x) {
                this.sprite.body.setVelocityX(this.speed * -1);
            } else {
                this.sprite.body.setVelocityX(this.speed);
            }
            if (player.sprite.y < this.sprite.y) {
                this.sprite.body.setVelocityY(this.speed * -1);
            } else {
                this.sprite.body.setVelocityY(this.speed);
            }
        }

    }

    update(scene) {
        const sprite = this.sprite;
        const speed = 130;
        sprite.body.setVelocity(0);
    }

    destroy() {
        this.sprite.destroy();
    }
}
