var height = window.innerHeight * window.devicePixelRatio;
var width = window.innerWidth * window.devicePixelRatio;
var scaleFactorWidth = width / 320;
var scaleFactorHeight = height / 568;

//Canvas
var game = new Phaser.Game(width, height, Phaser.CANVAS, 'gameDiv');
//Background + Speed of Background
var road;
var backgroundv;
//Car
var bremsen = false;
var hitmax = 0;
var animals = [];
var animalNames = ['elephant','giraffe', 'gorilla','lion','monkey'];
var text = "";
var animalyspeed = 250;
//SCORE+Button
var infoBox;
var breakButton;
var infoTXT;
var walk;
var frameCounter = 0;
var mainState = {
    preload: function () {
        game.load.image('road', "assets/road/roads320.png");
        game.load.image('car', "assets/car/car.png");
        game.load.image('break', "assets/bottom/break.png");
        game.load.image('footer', "assets/bottom/footer.png");

        //Animal
        game.load.spritesheet('elephant', 'assets/animals/sprite_elephant_left_222x204.png', 222, 204, 2);
        game.load.spritesheet('giraffe', 'assets/animals/sprite_giraffe_left_222x204.png', 222, 204, 2);
        game.load.spritesheet('gorilla', 'assets/animals/sprite_gorilla_left_222x204.png', 222, 204, 2);
        game.load.spritesheet('lion', 'assets/animals/sprite_lion_left_222x204.png', 222, 204, 2);
        game.load.spritesheet('monkey', 'assets/animals/sprite_monkey_left_222x204.png', 222, 204, 2);

        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    },
    render: function () {
        if(game.debug) {
            game.debug.body(car);
            for (var i = 0; i < animals.length; i++) {
                game.debug.body(animals[i]);

            }
        }
    },
    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = "#ffffff";
        //Road
        road = game.add.tileSprite(0, 0, width, height, 'road');
        //Car
        car = game.add.tileSprite(((320 / 2)-16) * scaleFactorWidth, (500-100) * scaleFactorHeight, 128, 253, 'car');

        game.physics.enable(car, Phaser.Physics.ARCADE);
        car.body.immovable = true;
        //infoBox
        infoBox = game.add.tileSprite((320 / 2) * scaleFactorWidth, (568) * scaleFactorHeight, 1133, 65, 'footer');
        infoBox.anchor.x = 0.5;
        infoBox.anchor.y = 1;
        //breakButton
        breakButton = game.add.tileSprite((320 / 2) * scaleFactorWidth, (568) * scaleFactorHeight, 125, 125, 'break');
        breakButton.inputEnabled = true;
        breakButton.anchor.x = 0.5;
        breakButton.anchor.y = 1;
        breakButton.inputEnabled = true;
        breakButton.events.onInputDown.add(listener, this);
        breakButton.events.onInputUp.add(listenerUp,this)
        //animals
        car.scale.setTo(scaleFactorWidth / 3, scaleFactorHeight / 3);
        infoBox.scale.setTo(scaleFactorWidth, scaleFactorHeight);
        breakButton.scale.setTo(scaleFactorWidth / 2, scaleFactorHeight / 2);
        road.scale.setTo(scaleFactorWidth, scaleFactorHeight);
        backgroundv = 1;

    },
    update: function () {
        if (hitmax === 5) {
            game.destroy()
        }

        road.tilePosition.y += backgroundv;
        for (var i = 0; i < animals.length; i++){
            game.physics.arcade.overlap(car, animals[i], function (car, animal) {
                if(animal.hit) {
                    animal.angle += 2;
                    animal.dmg = true;
                    if (animal.dmg === true && animal.dmgused === false ) {
                        console.log('huhu');
                        hitmax += 1;
                        animal.dmgused = true;
                    }
                    console.log(animal.dmgused);
                    return;
                }
                animal.hit = true;

                if (animal.dmg === true && animal.dmgused === false ) {
                    console.log('huhu');
                    hitmax += 1;
                    animal.dmgused = true;
                }
                console.log(hitmax);
            });

        }
        if(frameCounter % 50 === 0 && bremsen === false) {
            spawnAnimal();
        }
        frameCounter++;
    }

}
function spawnAnimal() {
    var direction = Math.random() < 0.5? 'left' : 'right';
    var tiername = animalNames[Math.floor(Math.random() * animalNames.length)];

    var tier = game.add.tileSprite((direction === 'left' ? 320 : (-50)) * scaleFactorWidth, 50 + (Math.random()*100), 222, 204, tiername, 1);
    tier.anchor.x=0.5;
    tier.anchor.y=0.5;
    tier.dmgused = false;
    tier.scale.set(scaleFactorWidth/3);
    tier.animations.add('walk');
    tier.animations.play('walk', 5, true);
    game.physics.enable(tier, Phaser.Physics.ARCADE);
    switch(tiername) {
        case 'elephant':
            tier.body.setSize(230, 140, 60, 125);
            break;
        case 'giraffe':
            tier.body.setSize(100, 250, 125, 25);
            break;
        case 'gorilla':
            tier.body.setSize(190, 140, 70, 125);
            break;
        case 'lion':
            tier.body.setSize(190, 140, 70, 125);
            break;
        case 'monkey':
            tier.body.setSize(190, 140, 70, 125);
            break;
    }
    var speed = 2 + (Math.random() * 2) * 100;
    tier.body.velocity.x = (direction === 'left'? -speed : speed);
    tier.body.velocity.y = animalyspeed;
    //tier.body.onCollide = new Phaser.Signal();
    //tier.body.onCollide.add(true, this);

    tier.animations.currentAnim.setFrame(Math.floor(Math.random() * 2), true);
    console.log(tier);
    animals.push(tier);

}
function listener () {
    backgroundv = 0;
    bremsen = true;
    for (var i = 0; i < animals.length; i++) {
        var animal = animals[i];
        animal.body.velocity.y = 0;
        animalyspeed = 0
    }
}
function listenerUp(){
    bremsen = false;
    backgroundv = 1;
    for (var i = 0; i < animals.length; i++) {
        var animal = animals[i];
        animal.body.velocity.y = 250;
        animalyspeed = 250;
    }
}
game.state.add('mainState', mainState);
game.state.start('mainState');