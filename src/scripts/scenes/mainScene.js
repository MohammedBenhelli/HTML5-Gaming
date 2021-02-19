import Dungeon from "@mikewesthad/dungeon";
import {TILES} from "../Tiles";
import Player from "../objects/Player";
import Bullets from "../objects/Weapon";
import Skeleton from "../objects/Skeleton";
import Boss from "../objects/Boss";
import Slime from "../objects/Slime";
import Boss2 from "../objects/Boss2";
import Boss3 from "../objects/Boss3";


export default class MainScene extends Phaser.Scene {
    constructor() {
        super({key: 'MainScene'});
        this.level = 0;
        this.enemies = [];
        this.score = 0;
        this.boss = null;
        this.boss2 = null;
        this.boss3 = null;
    }

    preload() {
        this.load.image('tiles', 'assets/DungeonTileset.png');
        this.load.image('knife', 'assets/knife.png');
        this.load.spritesheet('knight', 'assets/knight.png', {
            frameWidth: 16,
            frameHeight: 21,
        });
        this.load.spritesheet('skeleton', 'assets/skeleton.png', {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.spritesheet('boss', 'assets/boss.png', {
            frameWidth: 30,
            frameHeight: 35,
        });
        this.load.spritesheet('boss2', 'assets/boss2.png', {
            frameWidth: 31,
            frameHeight: 30,
        });
        this.load.spritesheet('boss3', 'assets/boss3.png', {
            frameWidth: 30,
            frameHeight: 29,
        });
        this.load.spritesheet('slime', 'assets/slime.png', {
            frameWidth: 16,
            frameHeight: 20,
        });
    }


    create() {
        this.scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#fff'});
        this.scoreText.setDepth(1);
        this.bullets = new Bullets(this, 'knife');
        this.level++;
        this.hasPlayerReachedStairs = false;
        this.dungeon = new Dungeon({
            width: 50,
            height: 50,
            doorPadding: 2,
            rooms: {
                width: {min: 10, max: 25, onlyOdd: true},
                height: {min: 8, max: 25, onlyOdd: true}
            }
        });

        this.dungeon.drawToConsole();
        const map = this.make.tilemap({
            tileWidth: 16,
            tileHeight: 16,
            width: this.dungeon.width,
            height: this.dungeon.height
        });
        const tileset = map.addTilesetImage("tiles", null, 16, 16, 0, 0);
        this.groundLayer = map.createBlankDynamicLayer("Ground", tileset);
        console.log(tileset);
        this.groundLayer.fill(10);
        this.dungeon.rooms.map(room => {
            const {x, y, width, height, left, right, top, bottom} = room;
            this.groundLayer.weightedRandomize(x + 1, y + 1, width - 2, height - 2, TILES.GROUND);

            this.groundLayer.putTileAt(TILES.WALL, left, top);
            this.groundLayer.putTileAt(TILES.WALL, right, top);
            this.groundLayer.putTileAt(TILES.WALL, right, bottom);
            this.groundLayer.putTileAt(TILES.WALL, left, bottom);

            this.groundLayer.fill(TILES.WALL, left + 1, top, width - 2, 1);
            this.groundLayer.fill(TILES.WALL, left + 1, bottom, width - 2, 1);
            this.groundLayer.fill(TILES.WALL, left, top + 1, 1, height - 2);
            this.groundLayer.fill(TILES.WALL, right, top + 1, 1, height - 2);

            const doors = room.getDoorLocations();
            doors.map(door => {
                if (door.y === 0)
                    this.groundLayer.putTilesAt(TILES.DOOR, x + door.x - 1, y + door.y);
                else if (door.y === room.height - 1)
                    this.groundLayer.putTilesAt(TILES.DOOR, x + door.x - 1, y + door.y);
                else if (door.x === 0)
                    this.groundLayer.putTilesAt(TILES.DOOR, x + door.x, y + door.y - 1);
                else if (door.x === room.width - 1)
                    this.groundLayer.putTilesAt(TILES.DOOR, x + door.x, y + door.y - 1);
            });

            for (let i = 0; i < Phaser.Math.Between(2, 5); i++) {
                const skeleton = new Skeleton(this, Phaser.Math.Between((x) * 16, (x + width) * 16), Phaser.Math.Between(y * 16, (y + height) * 16));
                this.enemies.push(skeleton);
            }
        });
        this.groundLayer.setCollision([33]);
        this.player = new Player(this, map.widthInPixels / 2, map.heightInPixels / 2);
        this.physics.add.collider(this.player.sprite, this.groundLayer);
        const camera = this.cameras.main;
        camera.startFollow(this.player.sprite);

        this.enemies.map((enemy, index) => {
            this.physics.add.collider(enemy.sprite, this.player.sprite, () => this.gameOver())
            this.physics.add.collider(this.bullets, enemy.sprite, () => {
                this.score += 100;
                this.enemies.splice(index, 1);
                enemy.destroy();
                this.bullets.stop();
            });
            this.physics.add.collider(enemy.sprite, this.groundLayer);
        });

        this.input.keyboard.on('keydown_W', e => this.bullets.fireTop(this.player.sprite.x, this.player.sprite.y));
        this.input.keyboard.on('keydown_A', e => this.bullets.fireLeft(this.player.sprite.x, this.player.sprite.y));
        this.input.keyboard.on('keydown_S', e => this.bullets.fireBottom(this.player.sprite.x, this.player.sprite.y));
        this.input.keyboard.on('keydown_D', e => this.bullets.fireRight(this.player.sprite.x, this.player.sprite.y));
    }

    update(time, delta) {
        this.scoreText.setX(this.player.sprite.x + 120);
        this.scoreText.setY(this.player.sprite.y + 100);
        this.scoreText.setText('Score: ' + this.score);
        if (this.score > 900 && this.boss === null) this.spawnBoss();
        if (this.score > 15000 && this.boss2 === null) this.spawnBoss2();
        if (this.score > 100000 && this.boss3 === null) this.spawnBoss3();
        if (this.hasPlayerReachedStairs) return;
        this.player.update(this);
        this.enemies.map(enemy => enemy.follow(this.player));
        if (this.boss !== null) this.boss.follow(this.player);
        if (this.boss2 !== null) this.boss2.follow(this.player);
        if (this.boss3 !== null) this.boss3.follow(this.player);
    }

    spawnBoss() {
        if (this.boss === null) {
            const map = this.make.tilemap({
                tileWidth: 16,
                tileHeight: 16,
                width: this.dungeon.width,
                height: this.dungeon.height
            });
            this.boss = new Boss(this, map.widthInPixels / 2, map.heightInPixels / 2);
            this.physics.add.collider(this.boss.sprite, this.groundLayer);
            this.physics.add.collider(this.boss.sprite, this.player.sprite, () => this.gameOver());
            this.physics.add.collider(this.bullets, this.boss.sprite, () => {
                this.boss.life -= 100;
                if (this.boss.life <= 0) {
                    this.score += 10000;
                    this.boss.destroy();
                    this.secondWave()
                }
            });
        }
    }

    spawnBoss2() {
        const map = this.make.tilemap({
            tileWidth: 16,
            tileHeight: 16,
            width: this.dungeon.width,
            height: this.dungeon.height
        });
        this.boss2 = new Boss2(this, map.widthInPixels / 2, map.heightInPixels / 2);
        this.physics.add.collider(this.boss2.sprite, this.groundLayer);
        this.physics.add.collider(this.boss2.sprite, this.player.sprite, () => this.gameOver());
        this.physics.add.collider(this.bullets, this.boss2.sprite, () => {
            this.boss2.life -= 100;
            if (this.boss2.life <= 0) {
                this.score += 100000;
                this.boss2.destroy();
                this.secondWave()
            }
        });
    }

    spawnBoss3() {
        const map = this.make.tilemap({
            tileWidth: 16,
            tileHeight: 16,
            width: this.dungeon.width,
            height: this.dungeon.height
        });
        this.boss3 = new Boss3(this, map.widthInPixels / 2, map.heightInPixels / 2);
        this.physics.add.collider(this.boss3.sprite, this.groundLayer);
        this.physics.add.collider(this.boss3.sprite, this.player.sprite, () => this.gameOver());
        this.physics.add.collider(this.bullets, this.boss3.sprite, () => {
            this.boss3.life -= 100;
            if (this.boss3.life <= 0) {
                this.score += 1000000;
                this.boss3.destroy();
                this.secondWave()
            }
        });
    }

    secondWave() {
        this.dungeon.rooms.map(room => {
            const {x, y, width, height} = room;

            for (let i = 0; i < Phaser.Math.Between(3, 5); i++) {
                const slime = new Slime(this, Phaser.Math.Between((x) * 16, (x + width) * 16), Phaser.Math.Between(y * 16, (y + height) * 16));
                this.physics.add.collider(slime.sprite, this.player.sprite, () => this.gameOver());
                this.physics.add.collider(slime.sprite, this.groundLayer);
                this.physics.add.collider(this.bullets, slime.sprite, () => {
                    slime.life -= 100;
                    if (slime.life <= 0) {
                        this.score += 1000;
                        slime.destroy();
                        this.bullets.stop();
                    }
                });
                this.enemies.push(slime);
            }
        });
    }

    gameOver() {
        this.player.destroy();
        let dieText = this.add.text(this.player.sprite.x, this.player.sprite.y, `Score: ${this.score}`, {
            font: "48px Arial",
            fill: "#ff0044",
            align: "left"
        });
        dieText.fixedToCamera = false;
        dieText.setText("GAME OVER");
    }
}
