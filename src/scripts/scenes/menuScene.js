export class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MenuScene'
        })
    }
    init() {
    }
    create() {
        this.keys = this.input.keyboard.createCursorKeys();
        let playButton = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2, 'Click here or press key up to play').setDepth(1);
        playButton.setInteractive();
        playButton.on("pointerdown", () => {
            console.log('ici')
            this.scene.start('MainScene');
        });
        this.input.on('gameobjectdown', () => this.scene.start('MainScene'))
    }

    update(time, delta) {
        if (this.keys.up.isDown)
            this.scene.start('MainScene');
    }
}
