// click to change modes

var walls = true;
var numLines = 30;
var penetrate = true;
var colSize = 15;
var moveSpeed = 3;

var colColor;
var boundaries = [];
var minDist;
var minCol;
var collisions = [];
var collision;
var rOrig;


function setup() {
  createCanvas(800, 800);
  colColor = color(255, 0, 0)
  background(220);
  rOrig = createVector(0, 0);

  if (walls == true) {
    makeWalls()
  }

  for (let i = 1; i <= numLines; i++) {
    let boundary = new Boundary()
    boundaries.push(boundary)
  }
}


function draw() {
  background(75);
  translate(width / 2, height / 2);
  minCol = undefined;
  stroke(255);
  strokeWeight(3);
  var collisions = [];
  detectKeys()

  let rDir = createVector(mouseX - width / 2, mouseY - height / 2);
  let rDirUnit = rDir.sub(rOrig).div(rDir.mag()) // unit vector

  let ray = {
    origin: rOrig,
    dir: rDirUnit
  }

  boundaries.forEach(boundary => {
    boundary.draw();
    collision = intersect(ray, boundary);
    if (penetrate == true && collision != false) {
      stroke(colColor)
      strokeWeight(colSize)
      point(rOrig.copy().add(collision))
    } else if (penetrate == false && collision != false){
        if (minCol == undefined ){
        minCol = collision;
      } else if (collision.mag()<minCol.mag()){
        minCol = collision
      }
      collisions.push(collision)
    }
  })
  

  if (penetrate == false && minCol != undefined){
    collisions.forEach(col =>{
    })
      stroke('blue')
      strokeWeight(colSize)
      point(rOrig.copy().add(minCol))
  }
  

  if (collision != undefined) {
    stroke(0, 255, 0)
  } else {
    stroke(255, 255, 255)
  }

  strokeWeight(3)
  rDirExt = rDir.copy().mult(10)
  line(rOrig.x, rOrig.y, rOrig.x + rDirExt.x, rOrig.y + rDirExt.y)

}


function detectKeys() {
  if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
    rOrig.y -= moveSpeed;
  }
  if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
    rOrig.y += 5;
  }
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
    rOrig.x -= 5;
  }
  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
    rOrig.x += 5;
  }
  if (keyIsDown(32) || keyIsDown(RIGHT_ARROW)) {
    rOrig.x = 0;
    rOrig.y = 0;
  }

}

function intersect(ray, wall) {
  // Finding a line intersection is essentially; solving the pair of simultaneous equations which draw said lines
  // One way to solve simultaneous equations is by converting the equations to a matrix and using either the Inverse method or Cramers rule
  // I have chosen cramers rule, it feels more readable in raw js, despite it being slower than gaussian elimination
  // https://www.youtube.com/watch?v=jBsC34PxzoM
  
  let a1x = ray.origin.x
  let a1y = ray.origin.y
  let a2x = ray.dir.x
  let a2y = ray.dir.y
  let b1x = wall.start.x
  let b1y = wall.start.y
  let b2x = wall.dir.x
  let b2y = wall.dir.y


  // my js implementation of cramers rule

  B = [a1x - b1x, a1y - b1y]

  A = [
    [b2x, -a2x],
    [b2y, -a2y]
  ]

  detA = det2x2(A)

  if (detA == 0) {
    // line is parallel
    return false;
  }

  cramerMu = [
    [B[0], -a2x],
    [B[1], -a2y]
  ]
  detMu = det2x2(cramerMu)
  Mu = detMu / detA

  cramerTheta = [
    [b2x, B[0]],
    [b2y, B[1]]
  ]
  detTheta = det2x2(cramerTheta)
  Theta = detTheta / detA

  if (Mu > 1 || Mu < 0) {
    // if line intersect is beyond end of line segment
    return false;
  }

  if (Theta < 0) {
    // if line intersect is in negative direction from ray
    return false;
  }
  
  return ray.dir.copy().mult(Theta)
  return p5.Vector.add(ray.origin, ray.dir.copy().mult(Theta))
}

function det2x2(mat) {
  var top = mat[0]
  var bot = mat[1]
  let a = top[0],
    b = top[1],
    c = bot[0],
    d = bot[1]
  return ((a * d) - (b * c))
}

function makeWalls() {
  boundaries.push(new Boundary(
    createVector(-width / 2, height / 2),
    createVector(width, 0)))
  boundaries.push(new Boundary(
    createVector(-width / 2, -height / 2),
    createVector(width, 0)))
  boundaries.push(new Boundary(
    createVector(-width / 2, -height / 2),
    createVector(0, height)))
  boundaries.push(new Boundary(
    createVector(width / 2, -height / 2),
    createVector(0, height)))
}

function mouseClicked() {
  if (penetrate == false) {
    penetrate = true;
  } else {
    penetrate = false
  }
}

function Boundary(start, dir) {
  if (start != undefined && dir != undefined) {
    this.start = start
    this.dir = dir
  } else {
    let mulx, muly;
    if (random() > 0.5) {
      mulx = 1
    } else {
      mulx = -1
    }
    if (random() > 0.5) {
      muly = 1
    } else {
      muly = -1
    }
    this.start = createVector(mulx * random(50, 350), muly * random(25, 200))
    if (random() > 0.5) {
      mulx = 1
    } else {
      mulx = -1
    }
    if (random() > 0.5) {
      muly = 1
    } else {
      muly = -1
    }
    this.dir = createVector(mulx * random(50, 100), muly * random(50, 100))
  }
}

Boundary.prototype.draw = function() {
  stroke(255, 255, 255);
  strokeWeight(3);
  line(this.start.x, this.start.y, this.start.x + this.dir.x, this.start.y + this.dir.y);
}