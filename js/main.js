var GameStarted = false;
//Strecke
var myBackground;
//Enemy
var myAnimal = [];
//Character
var car;
var carPosX = window.innerWidth / 2;
var carX;
var carPosY = window.innerHeight - 150;
var carY;
var newAnimals = true;
//Animals
var animalSprite = [
    'ape',
    'bock',
    'kingkong'
];
var animalSpeedY = 5;
var animalSpeed = [
    3,
    3,
    3
];
var animalDMG = [
    100,
    300,
    500
];
var animalDirection = [
    'left',
    'right'
];
var speed;
var animalx;
//Controller
var clickField;
var breakButton;
var breakDMG;
//Score
var myScore;
var GameOverText;
var GameEnd = false;
var animalHit = 0;




function show_SoundMessage() {
    var soundfile = "audio/serengeti_brake.mp3";
    var sound_id = "soundbox";
    var sound_message = "<";
    sound_message += 'source src="' + soundfile + '" autostart="false" loop="false" hidden="true"';
    sound_message += ">";
    document.getElementById(sound_id).innerHTML = sound_message;
}
function loadHighscore(){
    getHighscore(function (highscore) {
        document.getElementById('hs').innerHTML = "Highscore: " + highscore;
    });
}
function startGame() {

    show_SoundMessage();
    document.getElementById('restart').style = 'display:none';
    //Strecke
    myBackground = new road(window.innerWidth, window.innerHeight, 0, -60, "./img/road/road-1.png");
    //Auto
    carX = carPosX;
    carY = carPosY;
    car = new char(window.innerWidth / 10, window.innerHeight / 8, carX, carY, "./img/char/car.png");
    //Button
    clickField = new track(window.innerWidth, 75, "black", 0, window.innerHeight - 75);
    breakButton = new controller(72, 72, "./img/button-pause.png", window.innerWidth / 2, window.innerHeight - 75);
    myScore = new score("30px", "LiquorstoreJazz", "white", 20, window.innerHeight - 30, "text");
    GameOverText = new gameover("25px", "LiquorstoreJazz", "black", 20, 30, "text");
    GameEnd = false;
    if (document.getElementsByTagName('canvas')[0]) {
        document.getElementsByTagName('canvas')[0].setAttribute("style", "display")
    }
    myGameArea.start();

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

function restart() {
    document.getElementsByTagName('canvas')[0].setAttribute("style", "display:none");

    document.getElementById('restart').style = '';
    document.getElementById('gameover').style = '';
    myScore.scorePoints = 0;
}

var myGameArea = {

    canvas: document.createElement("canvas"),

    start: function () {

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        //listener für mouse und touch
        window.addEventListener('mousedown', function () {
            stopMove();
        });
        window.addEventListener('mouseup', function () {
            clearMove();
        });
        window.addEventListener('touchstart', function () {
            stopMove();
        });
        window.addEventListener('touchend', function () {
            clearMove();
        })
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
};

function track(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    this.newPos = function () {
        this.x += this.speedX;
        if (this.y >= 800) {
            this.y = -145;
        }
        this.y += this.speedY;
    }
}

function road(width, height, x, y, imgSrc) {
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = imgSrc;
    this.speedY = 5;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x, (this.y - this.height), this.width, this.height);
    };
    this.newPos = function () {
        this.y += this.speedY;
        if (this.y === this.height || this.y >= this.height) {
            this.y = 0;
        }
    }
}

function char(width, height, x, y, imgSrc) {
    this.width = width;
    this.height = height;
    this.direction = "right";
    this.image = new Image();
    this.image.src = imgSrc;
    this.speedX = 0.90;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    this.newPos = function () {
        this.x += this.speedX;
        if (this.x >= carPosX + 30 + 30) {
            this.speedX = -0.90;
            this.direction = "left";
        }
        if (this.x <= carPosX - 30) {
            this.speedX = 0.90;
            this.direction = "right";
        }
    }
}

function animal(width, height, x, y, imgSrc, speed, DMG) {
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = imgSrc;
    this.speedY = animalSpeedY;
    this.speedX = speed;
    this.points = DMG;
    this.status = true;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    this.newPos = function () {
        this.y += this.speedY;
        this.x += this.speedX;
        if (car.y <= (this.y + 49) && car.y >= (this.y - 91)) {
            if (car.x <= (this.x + 50) && car.x >= (this.x - 50)) {
                //punkte runterzählen
                if (this.status == true) {
                    animalHit += 1;
                    this.status = false;
                }
                if (animalHit == 5){
                    restart();
                }
            }
        }
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
}

function updateGameArea() {
    //canvas clear
    myGameArea.clear();
    //load new Positions
    myBackground.newPos();
    myBackground.update();
    car.newPos();
    //Set new Objects
    car.update();
    //neue Tiere setzen
    if (newAnimals == true) {
        myGameArea.frameNo += 1;
        if (myGameArea.frameNo == 1 || everyinterval(20)) {
            var pos = (Math.floor((Math.random() * 3) + 1) - 1);
            var direction = (Math.floor((Math.random() * 2) + 1) - 1);
            if (direction == 0) {
                animalx = window.innerWidth + 75;
                speed = animalSpeed[pos] * (-1);
            }
            if (direction == 1) {
                animalx = -75;
                speed = animalSpeed[pos];
            }

            myAnimal.push(new animal(window.innerWidth / 10, window.innerHeight/12, animalx, 0, "./img/animal/" + animalDirection[direction] + "_" + animalSprite[pos] + ".png", speed, animalDMG[pos]));
        }
    }
    for (var i = 0; i < myAnimal.length; i++) {
        if (myAnimal[i].status) {
            myAnimal[i].newPos();
            myAnimal[i].update();
        }
    }
    clickField.update();
    breakButton.update();
    if (newAnimals == true) {
        if (everyinterval(60)) {
            myScore.scorePoints += 1;
        }
    }

    myScore.text = "SCORE: " + myScore.scorePoints;
    myScore.update();
    if (animalHit === 5) {
        myGameArea.clear();
        //GameOver.update();
        //clickField.update();
        //GameOver Text + Click to Retry

        GameEnd = true;

        var highscore = myScore.scorePoints;
        saveHighscore(highscore);
        document.getElementById('hs').innerHTML = "Ihr Aktueller Highscore ist: " + highscore;
        //Highscore-Liste

        //Retry Button

        myGameArea.stop();
        restart();

    }
}

function clearMove() {
    if (car.direction === "right") {
        car.speedX = 0.90;
    }
    if (car.direction === "left") {
        car.speedX = -0.90;
    }
    myBackground.speedY = 5;
    for (var i = 0; i < myAnimal.length; i++) {
        myAnimal[i].speedY = 5;
    }
    animalSpeedY = 5;
    newAnimals = true;
}

function stopMove() {
    var breaksound = document.getElementById('soundbox');
    myBackground.speedY = 2;
    if (car.direction== 'left'){
        car.speedX = -1;
    }
    if (car.direction== 'right'){
        car.speedX = 1;
    }
    if (GameEnd === false) {
        breaksound.play();
    }
    for (var i = 0; i < myAnimal.length; i++) {
        myAnimal[i].speedY = 2;
    }
    animalSpeedY = 2;
    breakDMG = true;
}

function controller(height, width, imgSrc, x, y) {
    this.height = height;
    this.width = width;
    this.image = new Image();
    this.image.src = imgSrc;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

}

function score(size, font, color, x, y, type) {
    this.type = type;
    this.size = size;
    this.font = font;
    this.x = x;
    this.y = y;
    if(GameEnd === true) {
      this.scorePoints = 0;
    }
    else {
        this.scorePoints = 0;
    }

    this.update = function () {
        ctx = myGameArea.context;
        ctx.font = this.size + " " + this.font;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
    }
}

function gameover(size, font, color, x, y, type) {
    this.type = type;
    this.size = size;
    this.font = font;
    this.x = x;
    this.y = y;
    this.text = ""
    this.update = function () {
        ctx = myGameArea.context;
        ctx.font = this.size + " " + this.font;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
    }
}