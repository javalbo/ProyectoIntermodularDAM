const GAME_AREA_WIDTH = 1920;
const GAME_AREA_HEIGHT = 1080;
const SQUARE_SIZE = 100;
const SQUARE_COLOR = "#cc0000";
const SQUARE_SPEED_X = 10;
const SQUARE_SPEED_Y = 10;
const ASTEROID_MIN_SPEED = 3;
const ASTEROID_MAX_SPEED = 10;
const BACKGROUND_SPEED = 0.1;
const OBSTACLE_SPEED = 2;
const OBSTACLE_COLOR = "#187440";
const ASTEROID_COLOR = "#000000";
const OBSTACLE_MIN_HEIGHT = 40;
const OBSTACLE_MAX_HEIGHT = GAME_AREA_HEIGHT - 100;
const OBSTACLE_WIDTH = 20;
const ASTEROID_MAX_SIZE = 200;
const ASTEROID_MIN_SIZE = 10;
const OBSTACLE_MIN_GAP = 100;
const OBSTACLE_MAX_GAP = GAME_AREA_HEIGHT - 50;
const PROBABILITY_OBSTACLE = 0.7;
let PROBABILITY_ASTEROID = 0.6;
let FRAME_ASTEROID = 20;
const CHRONO_MSG = "Time goes by   ";
const LIFES_MSG = "STATUS: The ship ";
const NOT_DAMAGED_MSG = "is not damaged.";
const DAMAGED_MSG = "is DAMAGED.";
const HARDLY_DAMAGED_MSG = "is SERIOUSLY DAMAGED.";
const HAS_BEEN_DISTROYED_MSG = "has been distroyed.";
const CHRONO_DEATH_MSG = "You died at   ";
const RIGHTARROW_KEYCODE = 39;
const LEFTARROW_KEYCODE = 37;
const UPARROW_KEYCODE = 38;
const DOWNARROW_KEYCODE = 40;
const TAG_HERO = 0;
const TAG_OBSTACLE = 1;
const TAG_ASTEROID = 2;
const TAG_BACKGROUND = 3;
const FPS = 60;
const GAME_SPEED = 1000;
let ASTEROID_TYPE = 0;

class SquaredForm {
    constructor(x, y, width, height, color, tag, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.tag = tag;
        if (this.tag == TAG_HERO){
            this.squareImage = new Image();
            this.squareImage.src = 'imgs/nave.png';
            this.vidas = 3;
        }
        else if(this.tag == TAG_ASTEROID){
            this.type = type;
            this.squareImage = new Image();
            if (type == 0) this.squareImage.src = 'imgs/asteroid1.png';
            else if(type == 1) this.squareImage.src = 'imgs/asteroid2.png';
            else this.squareImage.src = 'imgs/asteroid3.png';
        }
        else if (this.tag == TAG_BACKGROUND) {
            this.squareImage = new Image();
            this.squareImage.src = 'imgs/background.png';
        }
        else this.color = color;
    }

    setSpeedX(speedX) {
        this.speedX = speedX;
    }

    setSpeedY(speedY) {
        this.speedY = speedY;
    }

    render(context) {
        if (this.tag == TAG_HERO || this.tag == TAG_ASTEROID || this.tag == TAG_BACKGROUND) context.drawImage(this.squareImage, this.x, this.y, this.width, this.height)
        else{
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    setIntoArea(endX, endY) {
        this.x = Math.min(Math.max(0, this.x), (endX - this.width));
        this.y = Math.min(Math.max(0, this.y), (endY - this.height));
    }

    crashWith(obj) {
        // detect collision with the bounding box algorithm
        let myleft = this.x;
        let myright = this.x + this.width;
        let mytop = this.y;
        let mybottom = this.y + this.height;
        let otherleft = obj.x;
        let otherright = obj.x + obj.width;
        let othertop = obj.y;
        let otherbottom = obj.y + obj.height;
        let crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

class GameArea {
    constructor(canvas, hero, obstacles, backgrounds) {
        this.canvas = canvas;
        this.hero = hero;
        this.obstacles = obstacles;
        this.backgrounds = backgrounds;
        this.context = null;
        this.interval = null;
        this.frameBackgrounds = undefined;
        this.frameAsteroids = 0;

        this.Image = new Image();
        this.Image.src = 'imgs/background.png';
    }

    initialise() {
        this.canvas.width = GAME_AREA_WIDTH;
        this.canvas.height = GAME_AREA_HEIGHT;
        this.context = this.canvas.getContext("2d");
        let theDiv = document.getElementById("gameplay");
        theDiv.appendChild(this.canvas);
        this.interval = setInterval(updateGame, GAME_SPEED/FPS);
        this.frameBackgrounds = 0;

        let BACKGROUND = new SquaredForm(0, 0, GAME_AREA_WIDTH, GAME_AREA_HEIGHT, ASTEROID_COLOR, TAG_BACKGROUND, 0);
        BACKGROUND.setSpeedX(-BACKGROUND_SPEED);
        gameArea.addBackground(BACKGROUND);
    }

    render() {
        
        this.context.drawImage(this.Image, 0, 0, this.canvas.width, this.canvas.height);
        for (const background of this.backgrounds) {
            background.render(this.context);
        }        
        this.hero.render(this.context);
        for (const obstacle of this.obstacles) {
            obstacle.render(this.context);
        }
        if (!continueTime){
            this.endImage = new Image();
            this.endImage.src = 'imgs/END.png';
            this.context.drawImage(this.endImage, 0, 0, this.canvas.width, this.canvas.height);
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    addObstacle(obstacle) {
        this.obstacles.push(obstacle);
    }

    addBackground(background) {
        this.backgrounds.push(background);
    }

    removeObstacle(i) {
        this.obstacles.splice(i, 1);
    }

    removeBackground(i) {
        this.backgrounds.splice(i, 1);
    }
}

let theSquare = new SquaredForm(0, GAME_AREA_HEIGHT / 2, SQUARE_SIZE, SQUARE_SIZE,
    SQUARE_COLOR, TAG_HERO);
let rightArrowPressed = false,
    leftArrowPressed = false,
    upArrowPressed = false,
    downArrowPressed = false;
let seconds, timeout, theChrono, theLife;
let continueGame = true;
let continueTime = true;
let gameArea = new GameArea(document.createElement("canvas"), theSquare, [], []);

window.onload = startGame;

function handlerOne(event) {
    switch (event.keyCode) {
        case RIGHTARROW_KEYCODE:
            if (!rightArrowPressed) {
                rightArrowPressed = true;
                theSquare.setSpeedX(SQUARE_SPEED_X);
            }
            break;
        case LEFTARROW_KEYCODE:
            if (!leftArrowPressed) {
                leftArrowPressed = true;
                theSquare.setSpeedX(-SQUARE_SPEED_X);
            }
            break;
        case UPARROW_KEYCODE:
            if (!upArrowPressed) {
                upArrowPressed = true;
                theSquare.setSpeedY(-SQUARE_SPEED_Y);
            }
            break;
        case DOWNARROW_KEYCODE:
            if (!downArrowPressed) {
                downArrowPressed = true;
                theSquare.setSpeedY(SQUARE_SPEED_Y);
            }
            break;
        default:
            break;
    }
}

function handlerTwo(event) {
    switch (event.keyCode) {
        case RIGHTARROW_KEYCODE:
            rightArrowPressed = false;
            theSquare.setSpeedX(0);
            break;
        case LEFTARROW_KEYCODE:
            leftArrowPressed = false;
            theSquare.setSpeedX(0);
            break;
        case UPARROW_KEYCODE:
            upArrowPressed = false;
            theSquare.setSpeedY(0);
            break;
        case DOWNARROW_KEYCODE:
            downArrowPressed = false;
            theSquare.setSpeedY(0);
            break;
        default:
            break;
    }
}

function startGame() {
    gameArea.initialise();
    gameArea.render();

    window.document.addEventListener("keydown", handlerOne);
    window.document.addEventListener("keyup", handlerTwo);

    seconds = 0;
    timeout = window.setTimeout(updateChrono, 1000);
    theChrono = document.getElementById("chrono");
    theLife = document.getElementById("life");
}

function updateGame() {
    // Check collision for ending game
    let collision = false;
    let asteroid_size;
    for (let i = 0; i < gameArea.obstacles.length; i++) {        
        if (theSquare.crashWith(gameArea.obstacles[i])) {
            if (gameArea.obstacles[i].width > 30){
                collision = true;
                asteroid_size = gameArea.obstacles[i].width;
                if (asteroid_size < SQUARE_SIZE - 20) gameArea.removeObstacle(i);
                break;
            }            
        }
    }
        if (collision) subLife(asteroid_size);
        // Increase count of frames
        gameArea.frameAsteroids += 1;
        gameArea.frameBackgrounds += 1;
        // Let's see if new obstacles must be created
        if (gameArea.frameBackgrounds >= 18000) gameArea.frameBackgrounds = 1;
        if (gameArea.frameBackgrounds == 1) {
            let BACKGROUND = new SquaredForm(gameArea.canvas.width, 0, GAME_AREA_WIDTH, GAME_AREA_HEIGHT, ASTEROID_COLOR, TAG_BACKGROUND, 0);
            BACKGROUND.setSpeedX(-BACKGROUND_SPEED);
            gameArea.addBackground(BACKGROUND);
        }
        if (gameArea.frameAsteroids >= FRAME_ASTEROID) gameArea.frameAsteroids = 1;
        if (gameArea.frameAsteroids == 1) {
            let chance = Math.random();
            if (chance < PROBABILITY_ASTEROID) {
                if (ASTEROID_TYPE == 0) ASTEROID_TYPE = 1;
                else if (ASTEROID_TYPE == 1) ASTEROID_TYPE = 2;
                else ASTEROID_TYPE = 0;
                let size = Math.floor(Math.random() * (ASTEROID_MAX_SIZE - ASTEROID_MIN_SIZE + 1) + ASTEROID_MIN_SIZE);
                let ASTEROID_Y = Math.floor(Math.random() * (GAME_AREA_HEIGHT + 1));
                let ASTEROID = new SquaredForm(gameArea.canvas.width, ASTEROID_Y, size, size, ASTEROID_COLOR, TAG_ASTEROID, ASTEROID_TYPE);
                let ASTEROID_SPEED = Math.floor(Math.random() * (ASTEROID_MAX_SPEED - ASTEROID_MIN_SPEED + 1) + ASTEROID_MIN_SPEED);
                ASTEROID.setSpeedX(-ASTEROID_SPEED);
                gameArea.addObstacle(ASTEROID);
            }
        }
        // Move backgrounds and delete the ones that goes outside the canvas
        for (let i = gameArea.backgrounds.length - 1; i >= 0; i--) {
            gameArea.backgrounds[i].move();
            if (gameArea.backgrounds[i].x == GAME_AREA_WIDTH*2) {
                gameArea.removeBackground(i);
            }
        }
        // Move obstacles and delete the ones that goes outside the canvas
        for (let i = gameArea.obstacles.length - 1; i >= 0; i--) {
            gameArea.obstacles[i].move();
            if (gameArea.obstacles[i].x + ASTEROID_MAX_SIZE <= 0) {
                gameArea.removeObstacle(i);
            }
        }

        // Move our hero
        theSquare.move();
        // Our hero can't go outside the canvas
        theSquare.setIntoArea(gameArea.canvas.width, gameArea.canvas.height);
        gameArea.clear();
        gameArea.render();
}

function updateChrono() {
    if (continueTime) {
        seconds++;
        let minutes = Math.floor(seconds / 60);
        let secondsToShow = seconds % 60;
        theChrono.innerHTML = CHRONO_MSG + " " + String(minutes).padStart(2, "0") + ":" + String(secondsToShow).padStart(2, "0");
        timeout = window.setTimeout(updateChrono, 1000);
    }
    else {
        let minutes = Math.floor(seconds / 60);
        let secondsToShow = seconds % 60;
        theChrono.innerHTML = CHRONO_DEATH_MSG + " " + String(minutes).padStart(2, "0") + ":" + String(secondsToShow).padStart(2, "0");
    }
}

function subTime() {
    if ((seconds - 15) < 0) seconds = 0;
    else seconds = seconds - 15;
    let minutes = Math.floor(seconds / 60);
        let secondsToShow = seconds % 60;
        theChrono.innerHTML = CHRONO_MSG + " " + String(minutes).padStart(2, "0") + ":" + String(secondsToShow).padStart(2, "0");
}

function subLife(asteroid_size){
    if (gameArea.hero.vidas - 1 <= 0){
        gameArea.hero.vidas = 0;
        endGame();
    } 
    else {
        gameArea.hero.vidas--;        
        if (leftArrowPressed) {
            gameArea.hero.vidas = 0;
            endGame();
        }
        if (asteroid_size >= SQUARE_SIZE - 20) gameArea.hero.x = gameArea.hero.x + asteroid_size + SQUARE_SIZE + 1;
    }
    if (gameArea.hero.vidas == 3) theLife.innerHTML = LIFES_MSG + NOT_DAMAGED_MSG;
    else if (gameArea.hero.vidas == 2) theLife.innerHTML = LIFES_MSG + DAMAGED_MSG;
    else if (gameArea.hero.vidas == 1) theLife.innerHTML = LIFES_MSG + HARDLY_DAMAGED_MSG;
    else theLife.innerHTML = LIFES_MSG + HAS_BEEN_DISTROYED_MSG;
}

function endGame() {
    continueTime = false;
    PROBABILITY_ASTEROID = 1;
    FRAME_ASTEROID = 1;
    
    window.document.removeEventListener("keydown", handlerOne);
    window.document.removeEventListener("keyup", handlerTwo);
    gameArea.hero.speedX = 0;
    gameArea.hero.speedY = 0;
}
