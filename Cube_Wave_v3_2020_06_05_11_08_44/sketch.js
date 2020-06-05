// Some Funky Cubes 
// Drag mouse to move camera
// Scroll to zoom
// change variables for more effects

var xRange = 5;
var zRange = 5;
var rainbow = false;
var testStrip = true;
var speed = -0.03;
var boxMinHeight = 50;
var boxMaxHeight = 700;
var boxWidth = 100;
var boxDistance = 150;
var rads = 2;
var pos = 2500;
var thetaPrecessSpeed = 0;
var phiPrecessSpeed = 0;
var cubeCol = 'black'

var magEdge;
var mouseDown;
var diffMouseX;
var theta;
var phi;
var prevTheta;
var grid = [];
var up = +1;
var winHeight;

function setup() {
  
  if (windowWidth > windowHeight){
    winHeight = windowHeight
  } else { winHeight = windowWidth }
  createCanvas(windowWidth, winHeight, WEBGL);
  
  fill(cubeCol);
  stroke(255);
  strokeWeight(10)
  
  // initialise x/z rotation
  theta = 0.9;
  phi = 0.7;
  prevTheta = 0.7;
  
  magEdge = createVector(xRange, 0, zRange).mag()
  createGrid()
  
}

function draw() {
  
  if (rainbow == true) {
    background('purple')
  } else {
    background(255,165,255);
  }

  diffMouseX = 0;
  grid.forEach(cube => {
    drawCube(cube)
  })
  
  if (mouseDown == true) {
    diffMouseX = pmouseX - mouseX;
    diffMouseY = pmouseY - mouseY;
    theta += 3*diffMouseY/1000;
    phi += 3*diffMouseX/1000
  }
  
  // Spherical coords = (r, ϕ, θ)
  // Spherical To Cartesian Coordinates
  // x = sinϕcosθ
  // y = sinϕsinθ
  // z = cosϕ
  
  theta += thetaPrecessSpeed;
  phi += phiPrecessSpeed;
  xpos = pos*sin(theta)*sin(phi);
  zpos = pos*sin(theta)*cos(phi);
  ypos = pos*cos(theta);
  
  if (
    (theta % (2*PI) < 0 && prevTheta % (2*PI) > 0) || 
    (theta % (2*PI) > 0 && prevTheta % (2*PI) < 0)  ||
    (theta % (2*PI) > PI && prevTheta % (2*PI) < PI) ||    
    (theta % (2*PI) < PI && prevTheta % (2*PI) > PI) ||
    (theta % (2*PI) > -PI && prevTheta % (2*PI) < -PI) ||    
    (theta % (2*PI) < -PI && prevTheta % (2*PI) > -PI) 
     ) {
    up = -up
  }
  
  camera(-xpos, -ypos, -zpos, 0, 0, 0, 0, up, 0);
  
  prevTheta = theta;

}

function mousePressed() {
  mouseDown = true;
}

function mouseReleased() {
  mouseDown = false;
}

function drawCube(cube) {
  
  if (testStrip == true && cube.v.x == 2) {
    fill('red')
  } else {
    fill(cubeCol)
  }
  
  if (rainbow == true) {
    fill(cube.col)
    strokeWeight(0)
  }
  
  let loc = cube.v.copy()
  loc.mult(boxDistance)
  push()
  translate(loc)
  box(boxWidth, sinValue(cube.angle), boxWidth)
  cube.angle += speed;
  pop()
  
}

function sinValue(angle) {
  return map(sin(angle), -1, 1, boxMinHeight, boxMaxHeight)
}

function createGrid() {
  for (var i = -xRange; i <= xRange; i++) {
    for (var j = -zRange; j <= zRange; j++) {
      v = createVector(i, 0, j)
      obj = {
        v: v,
        angle: rads * PI * (v.mag()) / magEdge,
        col: color(random(255), random(255), random(255)),      
      }
      grid.push(obj)
    }
  }
}

function mouseWheel(event) {
  pos += event.delta;
  //uncomment to block page scrolling
  //return false;
}