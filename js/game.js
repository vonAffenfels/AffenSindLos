class Game {

    init(gameName) {
        this.gameName = gameName;

        this.images = [
            {name: 'background', path: 'assets/background.svg'},
            {name: 'blanket', path: 'assets/blanket.svg'}
        ];

        this.spriteSheets = [
            {name: 'flowers', path: 'assets/sprite_flowers_hearts_128x112.svg', width: 128, height: 112, count: 11},
            {name: 'vibrator', path: 'assets/sprite_vibrator_586x138.svg', width: 586, height: 138, count: 4},
            {name: 'feet', path: 'assets/sprite_feet_161x85.svg', width: 161, height: 85, count: 3},
            {name: 'bells', path: 'assets/sprite_bells_97x65.svg', width: 97, height: 65, count: 2},
            {name: 'birds', path: 'assets/sprite_birds_83x63.svg', width: 83, height: 63, count: 2},
            {name: 'trump', path: 'assets/sprite_trump_200x265.svg', width: 200, height: 265, count: 3},
            {name: 'yun', path: 'assets/sprite_yun_200x265.svg', width: 200, height: 265, count: 3},
            {name: 'putin', path: 'assets/sprite_putin_200x265.svg', width: 200, height: 265, count: 3}
        ];

        this.height = 667;
        this.width = 375;

        this.game = new Phaser.Game(this.width, this.height, Phaser.CANVAS, this.gameName, {
            preload: this.preload,
            create: this.create,
            update: this.update
        });
    }

    preload() {
        for (let i = 0; i < this.images.length; i++) {
            let image = this.images[i];
            this.game.load.image(image.name, image.path);
        }

        for (let i = 0; i < this.spriteSheets.length; i++) {
            let spriteSheet = this.spriteSheets[i];
            this.game.load.spritesheet(spriteSheet.name, spriteSheet.path, spriteSheet.width, spriteSheet.height, count);
        }
    }

    create() {
        this.background = this.game.make.sprite(0, 0, 'background');
        this.blanket = this.game.make.sprite(0, 0, 'blanket');
        this.blanket.scale.set(0.7);
        this.vibrator = this.game.make.sprite(0, 0, 'vibrator', 0);
        this.vibrator.scale.set(0.6);
        this.vibrator.anchor.setTo(0.5, 0.5);

        this.bmd = this.game.add.bitmapData(this.width, this.height);
        this.bmd.addToWorld();
        this.bmd.smoothed = false;

        this.bmd.draw(background, 0, 0);
        this.bmd.draw(blanket, 0, this.height * 0.71);
        this.bmd.draw(vibrator, this.width * 0.5, this.height * 0.92);

        this.trump = this.game.add.sprite(width * 0.2, this.height * 0.595, 'trump');
        this.trump.scale.set(0.6);
        this.trump.anchor.setTo(0.5, 0.5);
        this.trump.animations.add('animate').play(1, true);

        this.yun = this.game.add.sprite(this.width * 0.5, this.height * 0.595, 'yun');
        this.yun.scale.set(0.6);
        this.yun.anchor.setTo(0.5, 0.5);
        this.yun.animations.add('animate').play(1, true);

        this.putin = this.game.add.sprite(this.width * 0.8, this.height * 0.595, 'putin');
        this.putin.scale.set(0.6);
        this.putin.anchor.setTo(0.5, 0.5);
        this.putin.animations.add('animate').play(1, true);

        this.feet = this.game.add.sprite(this.width * 0.2, this.height * 0.805, 'feet', 0);
        this.feet.scale.set(0.6);
        this.feet.anchor.setTo(0.5, 0.5);
        this.feet_anim = feet.animations.add('animate');

        this.feet_anim.play(1, true);

        this.feet2 = this.game.add.sprite(this.width * 0.5, this.height * 0.805, 'feet', 1);
        this.feet2.scale.set(0.6);
        this.feet2.anchor.setTo(0.5, 0.5);
        this.feet2_anim = feet2.animations.add('animate');

        this.feet2_anim.play(1, true);

        this.feet3 = this.game.add.sprite(this.width * 0.8, this.height * 0.805, 'feet', 1);
        this.feet3.scale.set(0.6);
        this.feet3.anchor.setTo(0.5, 0.5);
        this.feet3_anim = feet3.animations.add('animate');

        this.feet3_anim.play(1, true);
    }

    update() {

    }
}