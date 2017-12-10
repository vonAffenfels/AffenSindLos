var height = window.innerHeight;
var width = window.innerWidth;
var scaleFactorWidth = width / 320;
var scaleFactorHeight = height / 568;
//Menu
var headerImage;
var gameMode = 0; // 0 Menu, 1 Game, 2Game End
var startButton;
var restartButton;
var aHSTXT = '';
var aHS = 0;
var altHSTXT = '';
var altHS = 0;
//Canvas
var game = new Phaser.Game(width, height, Phaser.CANVAS, 'gameDiv');
//Background + Speed of Background
var road;
var backgroundv;
var backgroundSound;
var score = 0;
//Car
var bremsen = false;
var breakSound;
var engineSound;
var engineSoundActive = false;
//Sound
var animalHit;
var hitmax = 0;
var animals = [];
var animalNames = ['elephant', 'giraffe', 'gorilla', 'lion', 'monkey'];
var text = "";
var animalyspeed = 250;
//SCORE+Button
var infoBox;
var breakButton;
var leftButton;
var rightButton;
var carSpeedX = 0;
var walk;
var frameCounter = 0;
var mainState = {
    preload: function () {
        //Startmenu
        game.load.image('startButton', 'assets/menu/button-start.png');
        game.load.image('retryButton', 'assets/menu/button-retry.png');
        //Images
        game.load.image('Header', 'assets/menu/goal.png');
        game.load.image('road', 'assets/road/road.png');
        game.load.image('car', 'assets/car/car.png');
        game.load.image('break', 'assets/bottom/break.png');
        game.load.image('left', 'assets/bottom/left.png');
        game.load.image('right', 'assets/bottom/right.png');
        game.load.image('footer', 'assets/bottom/footer.png');
        //AudiFiles
        game.load.audio('backgroundSong', 'assets/audio/serengeti_background_music.mp3');
        game.load.audio('engine', 'assets/audio/serengeti_motor.mp3');
        game.load.audio('break', 'assets/audio/serengeti_brake.mp3');
        game.load.audio('die', 'assets/audio/punch.mp3');
        //Animal
        game.load.spritesheet('elephant', 'assets/animals/sprite_elephant_left_222x204.png', 222, 204, 2);
        game.load.spritesheet('giraffe', 'assets/animals/sprite_giraffe_left_222x204.png', 222, 204, 2);
        game.load.spritesheet('gorilla', 'assets/animals/sprite_gorilla_left_222x204.png', 222, 204, 2);
        game.load.spritesheet('lion', 'assets/animals/sprite_lion_left_222x204.png', 222, 204, 2);
        game.load.spritesheet('monkey', 'assets/animals/sprite_monkey_left_222x204.png', 222, 204, 2);

        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    },
    render: function () {
       /* if (game.debug) {
            game.debug.body(car);
            game.debug.body(breakButton);
            for (var i = 0; i < animals.length; i++) {
                game.debug.body(animals[i]);

            }
        }*/
    },
    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Text Highscore
        aHS = loadHighscore();
        if(aHS === undefined){
            aHS = 0;
        }
        headerImage = game.add.tileSprite(-50 /(scaleFactorWidth),0, 490, 200, 'Header');
        altHS = aHS;
        aHSTXT = game.add.text(50*(scaleFactorWidth),250*(scaleFactorHeight), 'Ihr Aktueller Highscore ist: \n' +aHS);
        altHSTXT = game.add.text(40*(scaleFactorWidth),300*(scaleFactorHeight), 'Ihr Aktueller Highscore ist: \n' +aHS);
        text = game.add.text(0, 0, "Score: ");

        text.font = 'liquorstore-jazz';
        text.fontWeight = 'bold';
        text.fontSize = 25;
        text.fill = '#ff0000';
        text.anchor.set(0);
        text.align = 'center';

        aHSTXT.font = 'liquorstore-jazz';
        aHSTXT.fontWeight = 'bold';
        aHSTXT.fontSize = 20;
        aHSTXT.fill = '#ff0000';
        aHSTXT.anchor.set(0);
        aHSTXT.align = 'center';

        altHSTXT.font = 'liquorstore-jazz';
        altHSTXT.fontWeight = 'bold';
        altHSTXT.fontSize = 20;
        altHSTXT.fill = '#ff0000';
        altHSTXT.anchor.set(0);
        altHSTXT.align = 'center';
        //Road
        road = game.add.tileSprite(0, 0, (width), (height), 'road');
        //Menu
            //start

        startButton = game.add.tileSprite(((width / 2) - 85) * scaleFactorWidth, (height / 2) * scaleFactorHeight, 158, 145, 'startButton');
        startButton.inputEnabled = true;
        startButton.events.onInputDown.add(startGamelistener, this);
        startButton.events.onInputUp.add(startGamelistenerUp, this);
            //restart
        restartButton = game.add.tileSprite(((width / 2) - 65) * scaleFactorWidth, ((height / 2) +100) * scaleFactorHeight, 143, 145, 'retryButton');
        restartButton.events.onInputDown.add(restartGamelistener, this);
        restartButton.events.onInputUp.add(restartGamelistenerUp, this);
        restartButton.visible = false;


        backgroundSound = game.add.audio('backgroundSong');

        backgroundSound.loop = true;
        backgroundSound.play();
        breakSound = game.add.audio('break');
        engineSound = game.add.audio('engine');
        engineSound.loop = true;

        animalHit = game.add.audio('die');
        //Car
        car = game.add.tileSprite(((320 / 2) - 16) * scaleFactorWidth, (500 - 100) * scaleFactorHeight, 128, 253, 'car');
        game.physics.enable(car, Phaser.Physics.ARCADE);
        car.body.immovable = true;
        //infoBox
        infoBox = game.add.tileSprite((320 / 2) * scaleFactorWidth, (568) * scaleFactorHeight, 1133, 65, 'footer');
        infoBox.anchor.x = 0.5;
        infoBox.anchor.y = 1;
        //breakButton
        breakButton = game.add.tileSprite((320 / 2) * scaleFactorWidth, (568) * scaleFactorHeight, 125, 125, 'break');
        leftButton = game.add.tileSprite((320 -285) * scaleFactorWidth, (568 + 2) * scaleFactorHeight, 64, 64, 'left');
        rightButton = game.add.tileSprite((320 -35) * scaleFactorWidth, (568 + 2) * scaleFactorHeight, 64, 64, 'right');

        //Button Functions
        breakButton.inputEnabled = true;
        breakButton.anchor.x = 0.5;
        breakButton.anchor.y = 1;

        leftButton.inputEnabled = true;
        leftButton.anchor.x = 0.5;
        leftButton.anchor.y = 1;

        rightButton.inputEnabled = true;
        rightButton.anchor.x = 0.5;
        rightButton.anchor.y = 1;

        //ButtnListner
        breakButton.events.onInputDown.add(listener, this);
        breakButton.events.onInputUp.add(listenerUp, this);
        //left
        leftButton.events.onInputDown.add(leftMoveDown, this);
        leftButton.events.onInputUp.add(leftMoveUp, this);
        //right
        rightButton.events.onInputDown.add(rightMoveDown, this);
        rightButton.events.onInputUp.add(rightMoveUp, this);



        //animals
        car.scale.setTo(scaleFactorWidth / 3, scaleFactorHeight / 3);
        infoBox.scale.setTo(scaleFactorWidth, scaleFactorHeight);
        breakButton.scale.setTo(scaleFactorWidth / 2, scaleFactorHeight / 2);
        road.scale.setTo(scaleFactorWidth, scaleFactorHeight);
        backgroundv = 1;
        game.stage.backgroundColor = "#ffffff";
    },
    update: function () {
        if (gameMode === 0) {
            road.visible = false;
            car.visible = false;
            breakButton.visible = false;
            infoBox.visible = false;
            text.visible = false;
            altHSTXT.visible = false;
        }
        if(gameMode === 2){
            if (engineSoundActive===true){
                engineSoundActive = false;
                engineSound.stop();
            }
            headerImage.visible = true;
            startButton.visible = false;
            road.visible = false;
            car.visible = false;
            breakButton.visible = false;
            infoBox.visible = false;
            text.visible = false;
            altHSTXT.visible = true;
            aHSTXT.visible = true;
            animals.visible = false;
            restartButton.visible = true;
            //HS Texte
            aHSTXT.setText('Ihr erreichter Highscore ist:\n'+score);
            altHSTXT.setText('Ihr vorheriger Heighscore ist:\n'+altHS);
            //Save Highscore
            saveHighscore(score);
        }
        if (gameMode === 1) {
            if (engineSoundActive===false){
                engineSoundActive = true;
                engineSound.play();
            }
            headerImage.visible = false;
            console.log(altHS);
            startButton.inputEnabled = false;
            startButton.visible = false;
            restartButton.visible = false;
            restartButton.inputEnabled = false;
            altHSTXT.visible = false;
            aHSTXT.visible = false;
            if (hitmax === 5) {
                restartButton.inputEnabled = true;
                gameMode = 2;
                //game.destroy()
            }

            road.tilePosition.y += backgroundv;
            for (var i = 0; i < animals.length; i++) {
                game.physics.arcade.overlap(car, animals[i], function (car, animal) {
                    if (animal.hit) {
                        animal.angle += 2;
                        animal.dmg = true;
                        if (animal.dmg === true && animal.dmgused === false) {
                            hitmax += 1;
                            animalHit.play();
                            animal.dmgused = true;
                        }
                        return;
                    }
                    if (gameMode===2){
                        animal.visible = false;
                    }
                    animal.hit = true;
                    animal.events.onOutOfBounds.add(kill, this);

                    if (animal.dmg === true && animal.dmgused === false) {
                        hitmax += 1;
                        animal.dmgused = true;
                    }
                });

            }
            if (frameCounter % 50 === 0 && bremsen === false) {
                spawnAnimal();
            }
            if (frameCounter % 100 === 0 && bremsen === false) {
                score += 1;
                text.setText('Score: ' + score);
            }

            frameCounter++;
            car.position.x += carSpeedX
        }
    }

};

//For COMMIT
function spawnAnimal() {
    var direction = Math.random() < 0.5 ? 'left' : 'right';
    //direction = 'right';
    var tiername = animalNames[Math.floor(Math.random() * animalNames.length)];
    //tiername = 'elephant';
    var tier = game.add.tileSprite((direction === 'left' ? 320 : (-50)) * scaleFactorWidth, 50 + (Math.random() * 100), 222, 204, tiername, 1);
    tier.anchor.x = 0.5;
    tier.anchor.y = 0.5;
    tier.dmgused = false;
    tier.scale.set(scaleFactorWidth / 3);
    tier.animations.add('walk');
    tier.animations.play('walk', 5, true);
    game.physics.enable(tier, Phaser.Physics.ARCADE);
    //car.scale.setTo(scaleFactorWidth / 3, scaleFactorHeight / 3);
    if(direction === 'right'){
        tier.scale.x *= -1;
    }
    switch (tiername) {
        case 'elephant':
            if(direction === 'left'){
                tier.body.setSize(150, 100, 250 / scaleFactorWidth, 300 / scaleFactorHeight);
            }
            if(direction === 'right'){
                tier.body.setSize(150, 100, (-400 / scaleFactorWidth), (300 / scaleFactorHeight));
            }
            break;
        case 'giraffe':
            if(direction === 'left'){
                tier.body.setSize(150, 200, 250 / scaleFactorWidth, 190 / scaleFactorHeight);
            }
            if(direction === 'right'){
                tier.body.setSize(150, 200, (-400 / scaleFactorWidth), (190 / scaleFactorHeight));
            }
            break;
        case 'gorilla':
            if(direction === 'left'){
                tier.body.setSize(150, 100, 250 / scaleFactorWidth, 300 / scaleFactorHeight);
            }
            if(direction === 'right'){
                tier.body.setSize(150, 100, (-402 / scaleFactorWidth), 300 / scaleFactorHeight);
            }
            break;
        case 'lion':
            if(direction === 'left'){
                tier.body.setSize(150, 100, 215 / scaleFactorWidth, 300 / scaleFactorHeight);
            }
            if(direction === 'right'){
                tier.body.setSize(150, 100, -435 / scaleFactorWidth, 300 / scaleFactorHeight);
            }
            break;
        case 'monkey':
            if(direction === 'left'){
                tier.body.setSize(150, 100, 250 / scaleFactorWidth, 300 / scaleFactorHeight);
            }
            if(direction === 'right'){
                tier.body.setSize(150, 100, -420 / scaleFactorWidth, 300 / scaleFactorHeight);
            }
            break;
    }
    var speed = 2 + (Math.random() * 2) * 100;

    tier.body.velocity.x = (direction === 'left' ? -speed : speed);
    tier.body.velocity.y = animalyspeed;
    tier.animations.currentAnim.setFrame(Math.floor(Math.random() * 2), true);
    animals.push(tier);

}

function listener() {
    backgroundv = 0;
    bremsen = true;
    breakSound = game.add.audio('break');
    breakSound.play();
    for (var i = 0; i < animals.length; i++) {
        var animal = animals[i];
        animal.body.velocity.y = 0;
        animalyspeed = 0
    }
}

function listenerUp() {
    bremsen = false;
    backgroundv = 1;
    for (var i = 0; i < animals.length; i++) {
        var animal = animals[i];
        animal.body.velocity.y = 250;
        animalyspeed = 250;
    }
}

function startGamelistener() {
    gameMode = 1;
    road.visible = true;
    car.visible = true;
    breakButton.visible = true;
    infoBox.visible = true;
    text.visible = true;
}

function startGamelistenerUp() {
    road.visible = true;
    car.visible = true;
    breakButton.visible = true;
    infoBox.visible = true;
    text.visible = true;
}
function restartGamelistener() {

    gameMode = 1;

    road.visible = true;
    car.visible = true;
    breakButton.visible = true;
    infoBox.visible = true;
    text.visible = true;
    score = 0;
    hitmax = 0;
    text.setText('Score: ' + score);
    animals = [];
}

function restartGamelistenerUp() {

}
function leftMoveDown() {
    carSpeedX = -1;
}
function leftMoveUp() {
    carSpeedX = 0;
}
function rightMoveDown() {
    carSpeedX = 1;
}
function rightMoveUp() {
    carSpeedX = 0;
}
//Load Highscore
function loadHighscore () {
    getHighscore(function (highscore) {
            aHS = highscore;
    });
}

function getHighscore(callback) {

    if (!(window.parent) || window.parent === window) {
        console.log("App missing");
    }

    var handler = function (event) {
        if (event.data.method === "setHighscore") {
            callback(event.data.payload.score);
            window.removeEventListener("message", handler);
        }

    };

    window.addEventListener("message", handler);

    window.parent.postMessage({
        method: "getHighscore",
        payload: {
            name: 'AffenSindLos'
        }
    }, "*");
}

function saveHighscore(highscore) {
    if (!highscore || isNaN(highscore)) {
        return;
    }

    window.parent.postMessage({
        method: "saveHighscore",
        payload: {
            score: parseInt(highscore),
            name: 'AffenSindLos'
        }
    }, "*");
}
function kill(animal){
    animal.kill();
}
game.state.add('mainState', mainState);
game.state.start('mainState');