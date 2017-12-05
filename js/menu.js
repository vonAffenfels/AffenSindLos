var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

var width = canvas.getAttribute('width');
var height = canvas.getAttribute('height');

var mouseX;
var mouseY;

var bgImage = new Image();
var logoImage = new Image();
var playImage = new Image();
var instructImage = new Image();
var settingsImage = new Image();
var creditsImage = new Image();
var shipImage = new Image();

var backgroundY = 0;
var speed = 1;

var buttonX = [192,192,192,160];
var buttonY = [100,140,250,220];
var buttonWidth = [96,260,182,160];
var buttonHeight = [40,40,40,40];

var frames = 30;
var timerId = 0;
var fadeId = 0;
var time = 0.0;

logoImage.src = "img/buttons/goal.png";
playImage.onload = function(){
    context.drawImage(playImage, buttonX[0], buttonY[0]);
}
playImage.src = "img/buttons/button-start.png";
instructImage.onload = function(){
    context.drawImage(instructImage, buttonX[1], buttonY[1]);
}

settingsImage.src = "img/buttons/button-close.png";
creditsImage.onload = function(){
    context.drawImage(creditsImage, buttonX[3], buttonY[3]);
}

timerId = setInterval("update()", 1000/frames);

canvas.addEventListener("mousemove", checkPos);
canvas.addEventListener("mouseup", checkClick);

function update() {
    clear();
    move();
    draw();
}
function clear() {
    context.clearRect(0, 0, width, height);
}
function move(){
    backgroundY -= speed;
    if(backgroundY == -1 * height){
        backgroundY = 0;
    }
    if(shipSize == shipWidth){
        shipRotate = -1;
    }
    if(shipSize == 0){
        shipRotate = 1;
    }
    shipSize += shipRotate;
}
function draw(){
    context.drawImage(bgImage, 0, backgroundY);
    context.drawImage(logoImage, 50,-10);
    context.drawImage(playImage, buttonX[0], buttonY[0]);
    context.drawImage(instructImage, buttonX[1], buttonY[1]);
    context.drawImage(settingsImage, buttonX[2], buttonY[2]);
    context.drawImage(creditsImage, buttonX[3], buttonY[3]);
    if(shipVisible == true){
        context.drawImage(shipImage, shipX[0] - (shipSize/2), shipY[0], shipSize, shipHeight);
        context.drawImage(shipImage, shipX[1] - (shipSize/2), shipY[1], shipSize, shipHeight);
    }
}
function checkPos(mouseEvent){
    if(mouseEvent.pageX || mouseEvent.pageY == 0){
        mouseX = mouseEvent.pageX - this.offsetLeft;
        mouseY = mouseEvent.pageY - this.offsetTop;
    }else if(mouseEvent.offsetX || mouseEvent.offsetY == 0){
        mouseX = mouseEvent.offsetX;
        mouseY = mouseEvent.offsetY;
    }
    for(i = 0; i < buttonX.length; i++){
        if(mouseX > buttonX[i] && mouseX < buttonX[i] + buttonWidth[i]){
            if(mouseY > buttonY[i] && mouseY < buttonY[i] + buttonHeight[i]){
                shipVisible = true;
                shipX[0] = buttonX[i] - (shipWidth/2) - 2;
                shipY[0] = buttonY[i] + 2;
                shipX[1] = buttonX[i] + buttonWidth[i] + (shipWidth/2);
                shipY[1] = buttonY[i] + 2;
            }
        }else{
            shipVisible = false;
        }
    }
}
function checkClick(mouseEvent){
    for(i = 0; i < buttonX.length; i++){
        if(mouseX > buttonX[i] && mouseX < buttonX[i] + buttonWidth[i]){
            if(mouseY > buttonY[i] && mouseY < buttonY[i] + buttonHeight[i]){
                fadeId = setInterval("fadeOut()", 1000/frames);
                clearInterval(timerId);
                canvas.removeEventListener("mousemove", checkPos);
                canvas.removeEventListener("mouseup", checkClick);
            }
        }
    }
}
function fadeOut(){
    context.fillStyle = "rgba(0,0,0, 0.2)";
    clear();
    startGame();

}