// rock paper scissors simulator
// we drop x rocks, y papers, and z scissors on the screen and see who wins
// the game is not interactive, it just runs by itself but starting parameters can be changed
// the objects are randomly dropped on the screen
// the game is over when only one type of object is left on the screen
// if rock touches scissors, the scissors turn into rocks
// if scissors touch paper, the paper turns into scissors
// if paper touches rock, the rock turns into paper

// the object class
// contains the object's parameters and methods
class ObjectRPS {
    // the object's constructor
    // takes in the object's type
    constructor(type) {
        // the object's type
        this.type = type;
        // the object's image
        this.image = game.images[game.types.indexOf(this.type)];
        // the object's position
        this.x = random(0, width);
        this.y = random(0, height);
    }

    // the object's move method
    // moves the object, it moves towards types that it beats and away from types that beat it
    move(objects) {
        let dx = 0;
        let dy = 0;
        let closestObjects = [];
        for (let i = 0; i < objects.length; i++) {
            // get distance between objects
            let d = dist(this.x, this.y, objects[i].x, objects[i].y);
            // add object to closestObjects array if it's one of the 5 closest
            if (closestObjects.length < 5 || d < closestObjects[closestObjects.length - 1].d) {
                closestObjects.push({ object: objects[i], d: d });
                closestObjects.sort((a, b) => a.d - b.d);
                if (closestObjects.length > 5) {
                    closestObjects.pop();
                }
            }
        }
        for (let i = 0; i < closestObjects.length; i++) {
            let object = closestObjects[i].object;
            let d = closestObjects[i].d;
            //get the objects relative position to itself
            let tdx = object.x - this.x;
            let tdy = object.y - this.y;
            if (object.type == game.rules[this.type]) {
                // move towards objects that it beats
                dx += tdx;
                dy += tdy;
            }
            else if (this.type == game.rules[object.type]) {
                // move away from objects that beat it
                dx -= tdx;
                dy -= tdy;
            }
            else {
                // move away from objects that are the same type
                dx -= tdx;
                dy -= tdy;
            }
        }
        // normalize the vector
        let mag = sqrt(dx * dx + dy * dy);
        dx /= mag;
        dy /= mag;

        // move the object
        this.x += dx * game.speed;
        this.y += dy * game.speed;
        // don't let the object go off the screen
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x > width) {
            this.x = width;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y > height) {
            this.y = height;
        }
    }
    // the object's display method
    // displays the object
    display() {
        // draw the image at the object's position
        image(this.image, this.x, this.y, 50, 50);
    }
}
// preload the images
let rock;
let paper;
let scissors;
let rockPosVec;
let paperPosVec;
let scissorPosVec;
let speedPosVec;
let startButtonPosVec;
function preload() {
    rock = loadImage("images/rock.png");
    paper = loadImage("images/paper.png");
    scissors = loadImage("images/scissors.png");
}
// the game object
// contains the game's parameters and methods
let game = {
    started: false,
    // the number of rocks, papers, and scissors
    // that will be dropped on the screen
    numRocks: 20,
    numPapers: 20,
    numScissors: 20,
    speed: 1,
    // the array of objects
    objects: [],
    // the array of images
    images: [],
    // the array of object types
    types: ["rock", "paper", "scissors"],
    // rules for the game
    rules: {
        rock: "scissors",
        paper: "rock",
        scissors: "paper"
    },

    // add a mousePressed() function to handle speed changes
    mousePressed() {
        // check if the mouse is over the speed text
        if (mouseX > 10 && mouseX < 100 && mouseY > 70 && mouseY < 90) {
            // check if enough time has passed since the last speed change
            if (frameCount - lastSpeedChange > 10) {
                // change the speed based on the mouse button
                if (mouseButton == LEFT) {
                    this.speed++;
                    if (this.speed > 3) {
                        this.speed = 1;
                    }
                } else if (mouseButton == RIGHT) {
                    this.speed--;
                    if (this.speed < 1) {
                        this.speed = 3;
                    }
                }
                // update the last speed change time
                lastSpeedChange = frameCount;
            }
        }
    },

    // the game's run method
    // this method is called in the draw function
    // it runs the game
    run: function () {
        frameRate(60);
        // run the game
        // if there is more than one "type" of object on the screen
        // move the objects and display them

        // get all types of objects in game and count how many of each type there are
        let types = [];
        let counts = [];
        for (let i = 0; i < this.objects.length; i++) {
            if (!types.includes(this.objects[i].type)) {
                types.push(this.objects[i].type);
                counts.push(0);
            }
            counts[types.indexOf(this.objects[i].type)]++;
        }




        // if there is more than one type of object on the screen
        // move the objects and display them
        if (types.length > 1) {
            // move the objects
            for (let i = 0; i < this.objects.length; i++) {
                this.objects[i].move(this.objects);
            }
            // display the objects
            for (let i = 0; i < this.objects.length; i++) {
                this.objects[i].display();
            }
            // check for collisions
            for (let i = 0; i < this.objects.length; i++) {
                for (let j = 0; j < this.objects.length; j++) {
                    // if the objects are different
                    // and they are touching
                    // and the first object beats the second object
                    // change the second object's type to the first object's type
                    if (i != j && this.objects[i].type == game.rules[this.objects[j].type] && dist(this.objects[i].x, this.objects[i].y, this.objects[j].x, this.objects[j].y) < 25) {
                        this.objects[j].type = this.objects[i].type;
                        this.objects[j].image = this.images[this.types.indexOf(this.objects[j].type)];
                    }
                }
            }
            // display how many of each type of object there are on the screen
            fill(255);
            textSize(16);
            textAlign(LEFT);
            text("Rocks: " + counts[0], 10, 20);
            text("Papers: " + counts[1], 10, 40);
            text("Scissors: " + counts[2], 10, 60);
            let speed;
            if (this.speed == 1) {
                speed = "Slow";
            }
            else if (this.speed == 2) {
                speed = "Medium";
            }
            else {
                speed = "Fast";
            }
            text("Speed: " + speed, 10, 80);

        }

        // if there is only one type of object on the screen
        // the game is over
        else {
            // display the winner
            fill(255);
            textSize(32);
            text(types[0] + " wins!", 200, 200);
            // display the instructions
            text("Press any key to restart", 200, 250);
            // if the user presses a key
            // restart the game
            if (keyIsPressed) {
                this.restart();
            }
        }
    },
    // the games start method
    // this method displays the start screen and allows the user to change the game's parameters
    start: function () {
        frameRate(5);
        textAlign(CENTER, CENTER);
        // display the start screen
        // display the title
        fill(255);
        let titleSize = windowWidth / 15;
        textSize(titleSize);
        text("Rock Paper Scissors", windowWidth / 2, windowHeight / 5);
        // display the instructions
        fill(255);
        let instrSize = windowWidth / 40;
        textSize(instrSize);
        text("Left click to add rocks, papers, and scissors to the screen. Right click to remove them", windowWidth / 2, windowHeight / 3);
        text("The game will end when there is only one type of object on the screen.", windowWidth / 2, windowHeight / 2.5);
        // display the parameters
        fill(255);
        let paramSize = windowWidth / 32;
        // set max size to 32
        if (paramSize > 32) {
            paramSize = 32;
        }
        textSize(paramSize);
        // save positions of the text for rocks, papers, and scissors
        rockPosVec = createVector(windowWidth / 2, windowHeight / 2);
        paperPosVec = createVector(windowWidth / 2, windowHeight / 1.9);
        scissorPosVec = createVector(windowWidth / 2, windowHeight / 1.8);
        text("Number of rocks: " + this.numRocks, rockPosVec.x, rockPosVec.y);
        text("Number of papers: " + this.numPapers, paperPosVec.x, paperPosVec.y);
        text("Number of scissors: " + this.numScissors, scissorPosVec.x, scissorPosVec.y);

        // speed of game
        let speed;
        if (this.speed == 1) { speed = "slow" } else if (this.speed == 2) { speed = "medium" } else { speed = "fast" };
        speedPosVec = createVector(windowWidth / 2, windowHeight / 1.6);
        text("Speed of game: " + speed + " (Click to change)", speedPosVec.x, speedPosVec.y);
        // display the buttons
        fill(255);
        let buttonSize = windowWidth / 40;
        textSize(buttonSize);
        startButtonPosVec = createVector(windowWidth / 2, windowHeight / 1.3);
        text("Click to start the game.", startButtonPosVec.x, startButtonPosVec.y);
    },

    restart: function () {
        this.started = false;
        this.numRocks = 20;
        this.numPapers = 20;
        this.numScissors = 20;
        this.speed = 1;
        this.objects = [];
    }

}






// initiate the p5.js canvas
function setup() {
    // create the canvas full screen
    createCanvas(windowWidth, windowHeight);
    background(0);

    // create game 
    // create the images
    game.images.push(rock);
    game.images.push(paper);
    game.images.push(scissors);
    // set image mode to center
    imageMode(CENTER);

    frameRate(60);

}


// call the game's run method
// to start the game
function draw() {
    background(0);
    if (!game.started) {
        game.start();
    }
    else {
        game.run();
    }
}

function mousePressed() {
    if (game.started) {
        console.log("mouse pressed");
        // check if user clicked on speed
        if (mouseX > 10 && mouseX < 100 && mouseY > 70 && mouseY < 90) {
            // change the speed
            if (mouseButton == LEFT) {
                game.speed++;
                if (game.speed > 3) {
                    game.speed = 1;
                }
            }
            else if (mouseButton == RIGHT) {
                game.speed--;
                if (game.speed < 1) {
                    game.speed = 3;
                }
            }
        }
    }
    else {
        let w = windowWidth / 2;
        // check for rock button click
        if (mouseX > rockPosVec.x - w/2 && mouseX < rockPosVec.x + w/2 && mouseY > rockPosVec.y - 12.5 && mouseY < rockPosVec.y + 12.5) {
            if (mouseButton == LEFT) {
                game.numRocks++;
            }
            else {
                game.numRocks--;
                if (game.numRocks < 0) {
                    game.numRocks = 0;
                }
            }
        }
        // check for paper button click
        if (mouseX > paperPosVec.x - w/2 && mouseX < paperPosVec.x + w/2 && mouseY > paperPosVec.y - 12.5 && mouseY < paperPosVec.y + 12.5) {
            if (mouseButton == LEFT) {
                game.numPapers++;
            }
            else {
                game.numPapers--;
                if (game.numPapers < 0) {
                    game.numPapers = 0;
                }
            }
        }
        // check for scissors button click
        if (mouseX > scissorPosVec.x - w/2 && mouseX < scissorPosVec.x + w/2 && mouseY > scissorPosVec.y - 12.5 && mouseY < scissorPosVec.y + 12.5) {
            if (mouseButton == LEFT) {
                game.numScissors++;
            }
            else {
                game.numScissors--;
                if (game.numScissors < 0) {
                    game.numScissors = 0;
                }
            }
        }
        // check for speed button click
        if (mouseX > speedPosVec.x - w/2 && mouseX < speedPosVec.x + w/2 && mouseY > speedPosVec.y - 12.5 && mouseY < speedPosVec.y + 12.5) {
            if (mouseButton == LEFT) {
                game.speed++;
                if (game.speed > 3) {
                    game.speed = 1;
                }
            }
            else {
                game.speed--;
                if (game.speed < 1) {
                    game.speed = 3;
                }
            }
        }
        // check for start button click
        if (mouseX > startButtonPosVec.x - w/2 && mouseX < startButtonPosVec.x + w/2 && mouseY > startButtonPosVec.y - 12.5 && mouseY < startButtonPosVec.y + 12.5) {
            game.started = true;
            // clear the objects array
            game.objects = [];

            // create the rocks
            for (let i = 0; i < game.numRocks; i++) {
                game.objects.push(new ObjectRPS("rock"));
            }
            // create the papers
            for (let i = 0; i < game.numPapers; i++) {
                game.objects.push(new ObjectRPS("paper"));
            }
            // create the scissors
            for (let i = 0; i < game.numScissors; i++) {
                game.objects.push(new ObjectRPS("scissors"));
            }
        }
    }
}
