var scale = 1;
var height = 667 * scale;
var width = 375 * scale;

var game = new Phaser.Game(width, height, Phaser.CANVAS, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {
    game.load.image('background', 'assets/background.svg');
    game.load.image('blanket', 'assets/blanket.svg');

    game.load.spritesheet('flowers', 'assets/sprite_flowers_hearts_128x112.svg', 128, 112, 11);
    game.load.spritesheet('vibrator', 'assets/sprite_vibrator_586x138.svg', 586, 138, 4);
    game.load.spritesheet('feet', 'assets/sprite_feet_161x85.svg', 161, 85, 3);
    game.load.spritesheet('bells', 'assets/sprite_bells_97x65.svg', 97, 65, 2);
    game.load.spritesheet('birds', 'assets/sprite_birds_83x63.svg', 83, 63, 2);
    game.load.spritesheet('butterfly', 'assets/sprite_butterfly_147x174.svg', 147, 174, 2);
    game.load.spritesheet('rainbow', 'assets/sprite_rainbow_675x596.svg', 675, 596, 10);
    game.load.spritesheet('rainbow_done', 'assets/sprite_rainbow_done_675x596.svg', 675, 596, 10);

    game.load.spritesheet('trump', 'assets/sprite_trump_200x265.svg', 200, 265, 3);
    game.load.spritesheet('yun', 'assets/sprite_yun_200x265.svg', 200, 265, 3);
    game.load.spritesheet('putin', 'assets/sprite_putin_200x265.svg', 200, 265, 3);

    game.load.spritesheet('merkel', 'assets/sprite_merkel_452x452.svg', 452, 452, 2);

    game.load.audio('background', 'assets/background_loop.mp3');
    game.load.audio('vibrator', 'assets/vibrator_loop.mp3');
    game.load.audio('tap', 'assets/heart_tap.mp3');
    game.load.audio('applause', 'assets/merkel_applause.mp3');

    game.load.audio('vox_1', 'assets/random_vox_01.mp3');
    game.load.audio('vox_2', 'assets/random_vox_02.mp3');
    game.load.audio('vox_3', 'assets/random_vox_03.mp3');
    game.load.audio('vox_4', 'assets/random_vox_04.mp3');
    game.load.audio('vox_5', 'assets/random_vox_05.mp3');
    game.load.audio('vox_6', 'assets/random_vox_06.mp3');
    game.load.audio('vox_7', 'assets/random_vox_07.mp3');
    game.load.audio('vox_8', 'assets/random_vox_08.mp3');

    game.load.audio('spank_1', 'assets/random_spank_01.mp3');
    game.load.audio('spank_2', 'assets/random_spank_02.mp3');
    game.load.audio('spank_3', 'assets/random_spank_03.mp3');
}

var flow = 0;
var lastLevel = -1;
var idToClick = 2;
var lastId = 0;

var randomSounds = ['vox_1', 'vox_2', 'vox_3', 'vox_4', 'vox_5', 'vox_6', 'vox_7', 'vox_8', 'spank_1', 'spank_2', 'spank_3'];
var randomfx = [];

var bmd;
var loop;

var done = false;

var flowers = [];

var flowerpos = [
    {x: 0.83, y: 0.31},
    {x: 0.69, y: 0.43},
    {x: 0.42, y: 0.43},
    {x: 0.2, y: 0.42},
    {x: 0.12, y: 0.25},
    {x: 0.13, y: 0.15}
];

function create() {
    game.input.addPointer();

    game.input.onTap.add(tap, this);

    for (var i = 0; i < randomSounds.length; i++) {
        randomfx[randomSounds[i]] = game.add.audio(randomSounds[i]);
    }

    tapfx = game.add.audio('tap');
    backgroundfx = game.add.audio('background');
    applausefx = game.add.audio('applause');
    vibratorfx = game.add.audio('vibrator');

    background = game.make.sprite(0, 0, 'background');
    background.scale.set(scale);
    blanket = game.make.sprite(0, 0, 'blanket');
    blanket.scale.set(0.7 * scale);

    bmd = game.add.bitmapData(game.width, game.height);
    bmd.addToWorld();
    bmd.smoothed = false;

    bmd.draw(background, 0, 0);
    bmd.draw(blanket, 0, height * 0.71);

    vibrator = game.add.sprite(width * 0.5, height * 0.92, 'vibrator', 0);
    vibrator.scale.set(0.6 * scale);
    vibrator.anchor.setTo(0.5, 0.5);
    vibrator.frame = idToClick;

    rainbow = game.add.sprite(width * 0.5, height * 0.445, 'rainbow');
    rainbow.scale.set(0.6 * scale);
    rainbow.anchor.setTo(0.5, 0.5);

    bells = game.add.sprite(width * 0.85, height * 0.2, 'bells');
    bells.scale.set(scale);
    bells.anchor.setTo(0.5, 0.5);

    birds = game.add.sprite(width * 0.88, height * 0.42, 'birds');
    birds.scale.set(scale * 0.8);
    birds.anchor.setTo(0.5, 0.5);

    butterfly = game.add.sprite(width * 0.25, height * 0.32, 'butterfly');
    butterfly.scale.set(scale * 0.6);
    butterfly.anchor.setTo(0.5, 0.5);

    trump = game.add.sprite(width * 0.2, height * 0.595, 'trump');
    trump.scale.set(0.6 * scale);
    trump.anchor.setTo(0.5, 0.5);

    yun = game.add.sprite(width * 0.5, height * 0.595, 'yun');
    yun.scale.set(0.6 * scale);
    yun.anchor.setTo(0.5, 0.5);

    putin = game.add.sprite(width * 0.8, height * 0.595, 'putin');
    putin.scale.set(0.6 * scale);
    putin.anchor.setTo(0.5, 0.5);

    merkel = game.add.sprite(width * 0.5, height * 0.175, 'merkel');
    merkel.scale.set(0.6 * scale);
    merkel.anchor.setTo(0.5, 0.5);

    feet = game.add.sprite(width * 0.2, height * 0.805, 'feet', 0);
    feet.scale.set(0.6 * scale);
    feet.anchor.setTo(0.5, 0.5);
    feet.animations.add('animate').play(0.5 + Math.random(), true);

    feet2 = game.add.sprite(width * 0.5, height * 0.805, 'feet', 2);
    feet2.scale.set(0.6 * scale);
    feet2.anchor.setTo(0.5, 0.5);
    feet2.animations.add('animate').play(0.5 + Math.random(), true);

    feet3 = game.add.sprite(width * 0.8, height * 0.805, 'feet', 1);
    feet3.scale.set(0.6 * scale);
    feet3.anchor.setTo(0.5, 0.5);
    feet3.animations.add('animate').play(0.5 + Math.random(), true);

    for (var i = 0; i < flowerpos.length; i++) {
        var f = game.add.sprite(width * flowerpos[i].x, height * flowerpos[i].y, 'flowers');
        f.scale.set(0.2 + Math.random() * 0.5 * scale);
        f.anchor.set(0.5, 0.5);
        f.animations.add('animate').play(2, true);
        f.animations.currentAnim.setFrame(Math.floor(Math.random() * flowerpos.length), true);
        flowers.push(f);
    }

    game.sound.setDecodedCallback([backgroundfx, tapfx, applausefx].concat(randomfx), start, this);
}

function render() {
    //game.debug.text(flow.toFixed(3), 0, height * 0.025);
}


function start() {
    backgroundfx.loopFull(0.6);
}

function update() {
    if (flow > 0.02) {
        flow -= 0.02;
    }
    setLevel(parseInt(flow));
}

function tap(pointer) {
    var point = {
        x: (pointer.clientX / screen.width).toFixed(2),
        y: (pointer.clientY / screen.height).toFixed(2)
    };

    //console.log(point);

    if (point.y > 0.7) {
        if (point.x < 0.33) {
            click(1);
        } else if (point.x > 0.33 && point.x < 0.66) {
            click(2);
        } else if (point.x > 0.66) {
            click(3);
        }
    }
}

function setLevel(level) {
    if (level === lastLevel) {
        return;
    }
    switch (level) {
        case 0:
            trump.frame = yun.frame = putin.frame = 0;
            merkel.visible = bells.visible = birds.visible = butterfly.visible = false;
            SetFlowerSpeed(false);
            break;
        case 1:
            PlayRandomSound();
            break;
        case 2:
            if (vibratorfx.isPlaying) {
                vibratorfx.stop();
            }
            SetFlowerSpeed(1, 0.3);
            break;
        case 3:
            merkel.visible = bells.visible = true;
            merkel.frame = 0;
            bells.animations.add('animate').play(2, true);
            trump.frame = 1;
            break;
        case 4:
            yun.frame = 1;
            PlayRandomSound();
            butterfly.visible = true;
            butterfly.animations.add('animate').play(2, true);
            if (applausefx.isPlaying) {
                applausefx.stop();
            }
            break;
        case 5:
            putin.frame = 1;
            bells.animations.add('animate').play(6, true);
            SetFlowerSpeed(3, 0.55);
            break;
        case 6:
            merkel.visible = true;
            if (!applausefx.isPlaying) {
                applausefx.play();
            }
            merkel.frame = 1;
            if (!vibratorfx.isPlaying) {
                vibratorfx.loopFull(0.6);
            }
            butterfly.animations.add('animate').play(5, true);
            PlayRandomSound();
            break;
        case 7:
            yun.frame = 2;
            rainbow.loadTexture('rainbow');
            done = false;
            SetFlowerSpeed(4, 0.8);
            break;
        case 8:
            birds.visible = true;
            birds.animations.add('animate').play(3, true);
            putin.frame = 2;
            PlayRandomSound();
            break;
        case 9:
            trump.frame = 2;
            if (!done) {
                done = true;
                rainbow.loadTexture('rainbow_done');
                rainbow.animations.add('animate').play(7, true);
            }
            break;
    }
    if (!done) {
        rainbow.frame = level;
    }
    lastLevel = level;
}

var sound;

function PlayRandomSound() {
    if (!sound || (sound && !sound.isPlaying)) {
        sound = randomfx[Object.keys(randomfx)[Math.floor(Math.random() * Object.keys(randomfx).length)]];
        sound.play();
    }
}

function SetFlowerSpeed(speed, chance) {
    for (var i = 0; i < flowers.length; i++) {
        if (speed === true) {
            flowers[i].visible = speed;
        } else if (speed === false) {
            flowers[i].visible = speed;
        } else {
            if (!chance || Math.random() < chance) {
                flowers[i].visible = true;
                flowers[i].animations.currentAnim.speed = speed;
            } else {
                flowers[i].visible = false;
            }
        }
    }
}

function click(id) {
    if (id === idToClick) {
        tapfx.play();
        if (flow < 9) {
            flow += 1;
        }
        idToClick = GetButton();
        vibrator.frame = idToClick;
    } else {
        if ((flow - 0.05) > 0) {
            flow -= 2;
        }
    }
}

function GetButton() {
    var id = parseInt(Math.random() * 3) + 1;
    if (lastId === id) {
        id = lastId === 2 ? 1 : 2;
    }
    lastId = id;
    return id;
}