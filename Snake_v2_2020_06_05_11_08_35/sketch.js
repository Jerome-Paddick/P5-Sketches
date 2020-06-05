// implementation of snake game, the snake can only move in a cardinal direction on a pseudo grid, uses a queue system to store up to 2 valid movement commands, which are executed as soon as they can be
// snakeSize must be an integer multiple of speed

var playArea = 500;
var speed = 4;
var snakeSize = 12;
var iniTailLength = 3;

var win = false;
var start = true;

var wallSize;
var foodx;
var foody;
var s;
var up;
var down;
var left;
var right;

function setup() {

  createCanvas(playArea, playArea);
  if (playArea % snakeSize == 0){
    wallSize = snakeSize
  } else {
    wallSize = (playArea % snakeSize)/2
  }

  up = createVector(0, -1)
  down = createVector(0, +1)
  left = createVector(-1, 0)
  right = createVector(+1, 0)
  s = new Snake()
  s.createTail(iniTailLength)
  makeFood()
}

function draw() {
  
  translate(width / 2, height / 2)
  rectMode(CENTER)
  background(100, 100, 100);
  strokeWeight(2*wallSize)

  noFill()
  rect(0, 0, width, height)
  strokeWeight(1)
  stroke(255)

  stroke(200)
  fill(255,0,0)
  ellipse(foodx, foody, snakeSize-2, snakeSize-2)
  
  stroke(255)
  fill(0, 255, 0)
  rect(s.x, s.y, snakeSize, snakeSize);

  fill(100, 255, 100)
  s.tail.forEach((tail) =>
    rect(tail.x, tail.y, snakeSize, snakeSize)
  )

  if (s.alive == true) {
    s.update()
  } else if (win == true) {
    textSize(25)
    text("WIN", -40, -30)
  } else if (start == true) {
    textSize(25)
    text("START", -40, -30)
  } else {
    textSize(25)
    text("GAME OVER", -70, -30)
  }
  
}

function keyPressed() {

  if (key === 'w' || keyCode === UP_ARROW) {
    s.addToQueue(up)
  }
  if (key === 'a' || keyCode === LEFT_ARROW) {
    s.addToQueue(left)
  }
  if (key === 's' || keyCode === DOWN_ARROW) {
    s.addToQueue(down)
  }
  if (key === 'd' || keyCode === RIGHT_ARROW) {
    s.addToQueue(right)
  }
  if (key === ' ') {
    respawn()
  }
}

function mouseClicked() {
  
  respawn()
}

function makeFood(){
  
  function pickAsquare(){
    
    let cubeSpace = (playArea-2*wallSize)/snakeSize
    if (s.tail.length == cubeSpace*cubeSpace-2){
      win = true;
      s.alive = false;
      print("WIN!!!")
    }
    foodx = snakeSize*round(random(cubeSpace-1)-(cubeSpace)/2)
    foody = snakeSize*round(random(cubeSpace-1)-(cubeSpace)/2)
  }
  
  function checkSnake(){
    if (s.x == foodx && s.y == foody){
      return true
    }
    s.tail.forEach( tail => {
      if (tail.x == foodx && tail.y == foody) {
        return true
      }
    })
  }
  
  while (checkSnake != true || win==true) {
    pickAsquare();
    break
  }
  
}

function respawn() {
  
  if (s.alive == false) {
    start = false;
    s.x = 0;
    s.y = 0;
    s.queue = [];
    s.cdir = right;
    s.tail = [];
    s.createTail(iniTailLength)
    s.xspeed = 1;
    s.yspeed = 0;
    s.alive = true
    makeFood()
  }
}

function Snake() {
  
  this.x = 0;
  this.y = 0;
  this.cdir = right;
  this.ldir = createVector(0, 0);
  this.queue = [];
  this.xspeed = 1;
  this.yspeed = 0;
  this.alive = false;
  this.tail = [];
}

Snake.prototype.eat = function() {
  
  let tailEnd = this.tail.slice(-1)
  let newTailEnd = {
    x: tailEnd[0].x,
    y: tailEnd[0].y,
    cdir: createVector(0, 0),
    ndir: createVector(0, 0),
  }
  this.tail.push(newTailEnd)
}

Snake.prototype.createTail = function(num) {
  
  for (let i = 0; i < num; i++) {
    let tail = {
      x: -(i + 1) * snakeSize,
      y: 0,
      cdir: right,
      ndir: createVector(0, 0),
      sleep: false
    }
    s.tail.push(tail)
  }
}

Snake.prototype.amIeating = function(){
  
  if (this.x == foodx && this.y == foody){
    this.eat()
    makeFood()
  }
}
  
Snake.prototype.update = function() {

  this.amIdead()
  this.amIeating()

  this.x += speed * this.xspeed;
  this.y += speed * this.yspeed;

  for (let i = 0; i < this.tail.length; i++) {

    // this.tail[i].cdir = this.ldir
    this.tail[i].x += (speed * this.tail[i].cdir.x);
    this.tail[i].y += (speed * this.tail[i].cdir.y);
  }

  if (this.x % snakeSize == 0 && this.y % snakeSize == 0) {

    this.ldir = this.cdir;
    this.tail[0].ndir = this.cdir;
    if (this.queue.length > 0) {
      this.cdir = this.queue.shift();
      this.xspeed = this.cdir.x;
      this.yspeed = this.cdir.y;
    }

    for (let i = 0; i < this.tail.length; i++) {
      if (i < this.tail.length - 1) {
        this.tail[i + 1].ndir = this.tail[i].cdir;
      }
      this.tail[i].cdir = this.tail[i].ndir
    }
  }
}


Snake.prototype.amIdead = function() {

  if (this.x < (-width / 2) + wallSize ||
    this.x > (width / 2) - wallSize ||
    this.y < (-height / 2) + wallSize ||
    this.y > (height / 2) - wallSize) {
    this.alive = false
  }

  this.tail.forEach(tail => {
    if (this.x == tail.x && this.y == tail.y) {
      this.alive = false;
    }
  })
}

Snake.prototype.addToQueue = function(dir) {

  // if queue empty
  if (s.queue.length == 0) {

    // if new direction is not backwards or in same dir
    if (dir.copy().add(this.cdir).mag() != 0 &&
      dir != this.cdir) {
      s.queue.push(dir)
    }
  }

  // if 1 item in queue
  if (s.queue.length == 1) {

    // if new direction not backwards or in same dir compared to first item in queue
    if (dir != this.queue[0] && dir.copy().add(this.queue[0]).mag() != 0) {
      s.queue.push(dir)
    }
  }
}