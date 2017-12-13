/**
 * @type {PIXI}
 */
window.PIXI = require('phaser/build/custom/pixi');
/**
 * @type {World}
 */
window.p2 = require('phaser/build/custom/p2');
/**
 * @type {Phaser}
 */
window.Phaser = require('phaser/build/custom/phaser-split');

module.exports = class CanvasGame {

    constructor(id) {
        this.debugging = false; //window.location.hostname === "localhost";

        this.height = window.innerHeight;
        this.width = window.innerWidth;

        if (this.height < this.width) {
            let width = this.width;
            this.width = this.height;
            this.height = width;
        }

        this.scaleFactorWidth = this.width / 320;
        this.scaleFactorHeight = this.height / 568;
        this.scaleFactorHeight = this.scaleFactorWidth;

        this.highscore = 0;
        this.api = null;
        this.textSize = 16 * this.scaleFactorWidth;
        this.score = 0;
        this.won = false;
        this.lost = false;

        this.game = new Phaser.Game(this.width, this.height, Phaser.CANVAS, id);
        this.game.state.add('game', {
            preload: this._preload.bind(this),
            create: this._create.bind(this),
            update: this._update.bind(this)
        });
        this.game.state.add('debug', {
            preload: this._preload.bind(this),
            create: this._create.bind(this)
        });
        this.game.state.add('menu', {
            preload: this._preload.bind(this),
            create: this._createMenu.bind(this)
        });
        this.game.state.add('onlyportrait', {
            preload: this._preload.bind(this),
            create: this._createWarning.bind(this)
        });
        if (this.debugging) {
            this.game.state.start("debug");
        } else {
            this.game.state.start("menu");
        }

        this.user = null;
    }

    setHighscore(highscore) {
        this.highscore = highscore;
    }

    setApi(api) {
        this.api = api;
    }

    setUser(user) {
        this.user = user;
    }

    saveHighscore() {
        this.api.saveHighscore(this.highscore);
    }

    _createWarning() {
        this.game.stage.backgroundColor = "#ffffff";
        this.menuBackground = this.game.add.sprite(160 * this.scaleFactorWidth, (568 / 2) * this.scaleFactorHeight, 'playportrait');
        this.menuBackground.scale.set(1, 1 * this.scaleFactorHeight);
        this.menuBackground.anchor.setTo(0.5, 0.5);
    }

    _createMenu() {
        this.game.stage.backgroundColor = "#000000";
        let font1 = "font1";
        let font1white = "font1white";

        /*
        this.beginText = this.game.add.bitmapText(10 * this.scaleFactorWidth, ((10 * this.scaleFactorWidth) + this.textSize), font1white, "", this.textSize / 2);
        this.beginText.setText(`${this.width}x${this.height} ${this.scaleFactorWidth} ${this.scaleFactorHeight}`);
        */

        this.beginText = this.game.add.bitmapText(20 * this.scaleFactorWidth, ((20 * this.scaleFactorWidth) + this.textSize), font1white, "", this.textSize * 2);
        this.beginText.setText("Los geht's!\nPunkte: " + this.score);
        this.saveHighscore();

        this.menuText = this.game.add.bitmapText(20 * this.scaleFactorWidth, this.height - ((20 * this.scaleFactorWidth) + this.textSize), font1white, "", this.textSize);
        this.menuText.setText("Beruehre den Bildschirm um zu spielen!");

        this.highscoreText = this.game.add.bitmapText(20 * this.scaleFactorWidth, ((100 * this.scaleFactorWidth) + this.textSize), font1white, "", this.textSize);
        this.highscoreText.setText("Hoechste Punktzahl: " + this.highscore);
        if (this.score > this.highscore) {
            this.highscore = this.score;
            this.highscoreText.setText("Hoechste Punktzahl: " + this.highscore + " NEUER REKORD!");
        }

        this.game.input.onDown.addOnce(() => {
            this.game.state.start("game");
        });

        if (!this.theme) {
            this.theme = this.game.add.audio('theme');
            this.theme.loopFull();
        }
    }

    _preload() {
        this.game.load.bitmapFont('font1', 'font/LiquorstoreJazz.png', 'font/LiquorstoreJazz.fnt');
        this.game.load.bitmapFont('font1white', 'font/LiquorstoreJazzWhite.png', 'font/LiquorstoreJazzWhite.fnt');

        this.game.load.spritesheet("elephant", "img/elephant.png", 219, 132, 2, 2, 0);
        this.game.load.spritesheet("gorilla", "img/gorilla.png", 141, 135, 2, 2, 0);
        this.game.load.spritesheet("giraffe", "img/giraffe.png", 146, 203, 2, 2, 0);
        this.game.load.spritesheet("lion", "img/lion.png", 207, 112, 2, 2, 0);
        this.game.load.spritesheet("monkey", "img/monkey.png", 154, 133, 2, 2, 0);

        this.game.load.image("button-break", "img/button-break.png");
        this.game.load.image("button-retry", "img/button-retry.png");
        this.game.load.image("button-start", "img/button-start.png");
        this.game.load.image("car", "img/car.png");
        this.game.load.image("footer", "img/footer.png");
        this.game.load.image("goal", "img/goal.png");
        this.game.load.image("playportrait", "img/playportrait.png");
        this.game.load.image("road", "img/road.png");

        this.game.load.audio('punch', [
            'sounds/punch.mp3',
            'sounds/punch.aiff'
        ]);
        this.game.load.audio('theme', [
            'sounds/serengeti_background_music.mp3',
            'sounds/serengeti_background_music.aiff'
        ]);
        this.game.load.audio('break', [
            'sounds/serengeti_brake.mp3',
            'sounds/serengeti_brake.aiff'
        ]);
        this.game.load.audio('motor', [
            'sounds/serengeti_motor.mp3',
            'sounds/serengeti_motor.aiff'
        ]);

        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.forceOrientation(false, true);
        this.game.scale.enterIncorrectOrientation.add(() => {
            this.game.state.start("onlyportrait");
        });
        this.game.scale.leaveIncorrectOrientation.add(() => {
            this.game.state.start("menu");
        });
    }

    _create() {
        if (this.speedInterval) {
            clearInterval(this.speedInterval);
        }
        this.score = 0;
        this.speed = 2;
        this.won = false;
        this.lost = false;
        this.level = 1;
        this.strikes = 5;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = "#ffffff";

        // background
        this.background = this.game.add.tileSprite(0, 0, this.width, this.height, 'road');
        this.background.scale.set(this.scaleFactorWidth, this.scaleFactorHeight);

        // footer
        this.footer = this.game.add.image(0, this.height, 'footer');
        this.footer.anchor.x = 0;
        this.footer.anchor.y = 1;
        this.footer.scale.set(this.scaleFactorWidth, this.scaleFactorHeight);

        // break
        this.breakBtn = this.game.add.image(this.game.world.centerX, this.height, 'button-break');
        this.breakBtn.anchor.x = .5;
        this.breakBtn.anchor.y = 1;
        this.breakBtn.scale.set(.5 * this.scaleFactorWidth, .5 * this.scaleFactorHeight);
        this.breakBtn.inputEnabled = true;
        this.breakBtnInterval = null;
        this.speedInterval = null;
        this.breakBtn.events.onInputDown.add(() => {
            this.break.volume = 0.2;
            this.break.play();
            clearInterval(this.speedInterval);
            this.breakBtnInterval = setInterval(() => {
                this.speed -= this.speed / 2;
                if (this.speed < 0) {
                    this.speed = 0;
                }
            }, 100);
        }, this);
        this.breakBtn.events.onInputUp.add(() => {
            clearInterval(this.breakBtnInterval);
            this.speedInterval = setInterval(() => {
                this.recalculateSpeed();
            }, 100);
        }, this);
        this.speedInterval = setInterval(() => {
            this.recalculateSpeed();
        }, 100);

        // car
        this.car = this.game.add.sprite(this.game.world.centerX, this.height - (130 * this.scaleFactorHeight), 'car');
        this.car.scale.setTo(0.4 * this.scaleFactorWidth, 0.4 * this.scaleFactorHeight);
        this.car.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this.car, Phaser.Physics.ARCADE);
        this.car.body.collideWorldBounds = true;
        this.car.body.bounce.set(2);
        this.car.body.immovable = true;

        this.animalTimer = this.game.time.create(false);
        this.runningAnimalTimer = null;
        this.animalTimer.loop(50000, () => {
            this.level++;
            this.updateTimer();
        });
        this.updateTimer();

        // balls
        this.animals = this.game.add.group(this.game, this.game.world, "animals");
        this.animals.physicsBodyType = Phaser.Physics.ARCADE;

        //this.spawnDebug();

        // scoretext
        this.scoretext = this.game.add.bitmapText(20 * this.scaleFactorWidth, (20 * this.scaleFactorWidth) + this.textSize, 'font1', 'Punkte: ' + this.score, this.textSize);
        this.punch = this.game.add.audio('punch');
        this.break = this.game.add.audio('break');

        if (!this.motor) {
            this.motor = this.game.add.audio('motor');
            this.motor.loopFull(0.5);
        }

        this.background.sendToBack();
    }

    recalculateSpeed() {
        this.speed += 0.2;
        if (this.speed > 10) {
            this.speed = 10;
        }
    }

    updateTimer() {
        this.animalTimer.remove(this.runningAnimalTimer);
        let interval = 1000 - (100 * this.level);
        interval = interval - (100 * this.speed);

        if (interval < 250) {
            interval = 250;
        }

        this.runningAnimalTimer = this.animalTimer.loop(interval, this.spawnAnimal, this);
        this.animalTimer.start();
    }

    updateScore() {
        let debug = `
            animals: ${this.animals.countLiving()}
            speed: ${this.speed}
            strikes: ${this.strikes}
        `
        this.scoretext.setText("Punkte: " + this.score);
    }

    _update() {

        this.score += this.speed;
        this.score = parseInt(this.score);

        let animals = this.animals.getAll("alive", true);
        for (let i = 0; i < animals.length; i++) {
            let animal = animals[i];
            animal.y += this.speed * this.scaleFactorHeight;
        }
        this.background.tilePosition.y += this.speed;

        this.game.physics.arcade.overlap(this.animals, this.car, this.animalHitCar, null, this);
        this.updateScore();
    }

    animalHitCar(car, animal) {
        if (animal.hit) {
            return;
        }

        this.punch.play();
        this.strikes--;

        if (this.strikes <= 0) {
            return this.loose();
        }

        animal.hit = true;

        let direction = car.x < animal.x;

        let targetAngle = 360;
        let targetX = this.width + 200;
        let targetY = animal.y - (this.game.rnd.between(0, 100) * this.scaleFactorWidth * this.speed);

        if (!direction) {
            targetAngle = -360;
            targetX = -200;
        }

        this.game.add.tween(animal).to({angle: targetAngle}, this.game.rnd.between(500, 1000), Phaser.Easing.Default, true, 0, 0, false);
        this.game.add.tween(animal).to({
            x: targetX,
            y: targetY
        }, this.game.rnd.between(500, 1000), Phaser.Easing.Default, true, 0, 0, false);
    }

    spawnDebug() {
        let animal;

        animal = this.animals.create(100, 0, 'monkey');
        animal.animations.add('walk');
        animal.animations.play('walk', 7, true);
        animal = this.animals.create(100, 150, 'lion');

        animal.animations.add('walk');
        animal.animations.play('walk', 5, true);
        animal = this.animals.create(100, 300, 'giraffe');

        animal.animations.add('walk');
        animal.animations.play('walk', 3, true);
        animal = this.animals.create(100, 550, 'elephant');

        animal.animations.add('walk');
        animal.animations.play('walk', 2, true);
        animal = this.animals.create(100, 700, 'gorilla');

        animal.animations.add('walk');
        animal.animations.play('walk', 3, true);
    }

    spawnAnimal(type) {
        type = type === undefined ? this.game.rnd.between(0, 4) : type;
        let animal;
        let scale;
        let direction = this.game.rnd.between(0, 1);
        let posX = direction === 0 ? -200 : this.width + 200;
        let posY = this.game.rnd.between(-200 * this.speed, this.speed < 1 ? this.height - (400 * this.scaleFactorHeight) : 100);
        let animationspeed = 5;

        switch (type) {
            case 4:
                animal = this.animals.create(posX, posY, 'monkey');
                scale = 0.3;
                animationspeed = 7;
                break;
            case 3:
                animal = this.animals.create(posX, posY, 'lion');
                scale = 0.4;
                animationspeed = 5;
                break;
            case 2:
                animal = this.animals.create(posX, posY, 'giraffe');
                scale = 0.5;
                animationspeed = 3;
                break;
            case 1:
                animal = this.animals.create(posX, posY, 'elephant');
                scale = 0.6;
                animationspeed = 2;
                break;
            case 0:
                animal = this.animals.create(posX, posY, 'gorilla');
                scale = 0.4;
                animationspeed = 3;
                break;
        }

        if (!animal) {
            return;
        }

        this.game.physics.enable(animal, Phaser.Physics.ARCADE);
        animal.anchor.x = 0.5;
        animal.anchor.y = 0.5;
        animal.scale.set(scale * this.scaleFactorWidth, scale * this.scaleFactorWidth);
        animal.body.velocity.x = this.game.rnd.between((1 - scale) * 300, (1 - scale) * 300);
        animal.checkWorldBounds = true;
        animal.animations.add('walk');
        animal.animations.play('walk', 5, true);

        if (direction === 1) {
            animal.body.velocity.x *= -1;
        } else {
            animal.scale.x *= -1;
        }

        animal.events.onOutOfBounds.add((animal) => {
            if (!animal.isJustSpawned) {
                animal.isJustSpawned = true;
                return;
            }
            animal.kill();
        }, this);
    }

    win() {
        if (this.debugging) {
            return;
        }
        this.won = true;
        this.game.state.start("menu");
    }

    loose() {
        if (this.debugging) {
            return;
        }
        this.lost = true;
        this.animals.destroy(true);
        this.car.destroy(true);
        this.game.state.start("menu");
    }
}