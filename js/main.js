var GameStarted = false;
//Strecke
var trackL;
var trackR;
var myBackground;
//Enemy
var myAnimal = [];
//Character
var car;
var carPosX = window.innerWidth/2;
var carX;
var carPosY = window.innerHeight-250;
var carY;
var newAnimals = true;
//Animals
var animalSprite = ['ape','bock','kingkong'];
var animalSpeed = [3, 4, 5];
var animalDMG = [100, 300, 500];
var animalDirection =['left','right'];
var speed;
var animalx;
//Controller
var clickField;
var breakButton;
var breakDMG;
//Score
var myScore;

function show_SoundMessage() {
    var soundfile = "audio/serengeti_brake.mp3";
    var sound_id = "soundbox";
    var sound_message = "<";
    sound_message += 'source src="' + soundfile + '" autostart="false" loop="false" hidden="true"';
    sound_message += ">";
    document.getElementById(sound_id).innerHTML = sound_message;
}

function startGame() {

    show_SoundMessage();
    //Strecke
    myBackground = new road(window.innerWidth, window.innerHeight, 0, -60, "./img/road/road-1.png");
    //Auto
    carX = carPosX;
    carY = carPosY;
    car = new char(50, 90, carX, carY, "./img/char/car.png");
    //Button
    clickField = new track(window.innerWidth, 75, "black", 0, window.innerHeight-75);
    breakButton = new controller(72, 72, "./img/button-pause.png", window.innerWidth/2, window.innerHeight-75);
    myScore = new score("30px", "LiquorstoreJazz", "white", 20, window.innerHeight-30, "text");
    myGameArea.start();

}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
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
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
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
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    this.newPos = function() {
        this.x += this.speedX;
        if(this.y >= 800){
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
    this.update = function() {
        ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x, (this.y - this.height), this.width, this.height);
    };
    this.newPos = function() {
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
    this.update = function() {
        ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    this.newPos = function() {
        this.x += this.speedX;
        if(this.x >= carPosX+30+30){
            this.speedX = -0.90;
            this.direction = "left";
        }
        if(this.x <= carPosX-30){
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
    this.speedY = 10;
    this.speedX = speed;
    this.points = DMG;
    this.status = true;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        ctx.drawImage(this.image,this.x, this.y, this.width, this.height);
    };
    this.newPos = function() {
        this.y += this.speedY;
        this.x += this.speedX;
        if(car.y <= (this.y+49) && car.y >= (this.y-91)) {
            if(car.x <= (this.x+50) && car.x >= (this.x-50)){
                //punkte runterzählen
                if(this.status == true) {
                    myScore.scorePoints = myScore.scorePoints - this.points;
                    this.status = false
                }
            }
        }
    }
}

function everyinterval(n) {
    if((myGameArea.frameNo / n) % 1 == 0) {
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
    if(newAnimals == true) {
        myGameArea.frameNo += 1;
        if (myGameArea.frameNo == 1 || everyinterval(20)) {
            var pos = (Math.floor((Math.random() * 3) + 1) - 1);
            var direction = (Math.floor((Math.random() * 2) + 1) - 1);
            if(direction == 0){
                animalx = 430;
                speed = animalSpeed[pos] * (-1);
            }
            if(direction == 1){
                animalx = 50;
                speed = animalSpeed[pos];
            }
            myAnimal.push(new animal(50, 50, animalx, 0, "./img/animal/"+ animalDirection[direction] + "_" + animalSprite[pos] +".png", speed, animalDMG[pos]));
        }
    }
    for (var i = 0; i < myAnimal.length; i++) {
        if(myAnimal[i].status) {
            myAnimal[i].newPos();
            myAnimal[i].update();
        }
    }
    clickField.update();
    breakButton.update();
    if(newAnimals == true) {
        if (everyinterval(60)) {
            myScore.scorePoints -= 1;
        }
    }
    if(breakDMG == true){
        myScore.scorePoints -= 250;
        breakDMG = false;
    }

    myScore.text="SCORE: " + myScore.scorePoints;
    myScore.update();
    if(myScore.scorePoints <= 0){
        myGameArea.clear();
        //GameOver.update();
        clickField.update();
        var engine = document.getElementById('engine');
        engine.pause();
        myScore.text  = "Persönlicher High-Score: " + (Math.floor((myGameArea.frameNo / 1000)));
        myScore.update();
        //Highscore-Liste

        //Retry Button

        //Beenden Button

        myGameArea.stop();

    }
}

function clearMove(){
    if(car.direction === "right"){
        car.speedX = 5;
    }
    if(car.direction === "left"){
        car.speedX = -5;
    }
    myBackground.speedY = 5;
    for(var i = 0; i < myAnimal.length; i++){
        myAnimal[i].speedY = 10;
    }
    newAnimals = true;
}

function stopMove() {
    var breaksound = document.getElementById('soundbox');
    myBackground.speedY = 0;
    car.speedX = 0;
    breaksound.play();
    for(var i = 0; i < myAnimal.length; i++){
        myAnimal[i].speedY = 0;
    }
    newAnimals = false;
    breakDMG = true;

}

function controller(height, width, imgSrc, x, y) {
    this.height = height;
    this.width = width;
    this.image = new Image();
    this.image.src = imgSrc;
    this.x = x;
    this.y = y;
    this.update = function() {
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
    this.scorePoints = 3000;
    this.update = function() {
        ctx = myGameArea.context;
        ctx.font = this.size + " " + this.font;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
    }
}


