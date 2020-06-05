// Approximates Pi using random points drawn onto area

var r = 400
var c = 2*r
var crcl = 0
var total = 0
var pi = 0
var dotsPerFrame = 1000

function setup() {
  createCanvas(c + 5, c + 5);
  background(0)
}


function draw() {
  // put (0,0) at center
  translate(width/2, height/2);
  
  stroke(255);
  noFill()
  strokeWeight(4)
  
  ellipse(0,0,c,c)
  rectMode(CENTER)
  rect(0,0, c, c)
  
  for (var i=0; i<dotsPerFrame; i++) {
    fireRandomly()
  }

  // circle area -> pi*r^2 
  // square area -> (2r)^2 == 4r^2
  // circle / square = pi/4
  // pi ~=~ 4* (inside/outside)
  
  var ratio = (crcl / total)
  pi = (4*ratio).toFixed(9)
  
  strokeWeight(1)
  fill(70)
  stroke(255)
  rect((-r) + 85, (-r) + 25, 150, 30)
  fill(255)
  textSize(20)
  text('pi ' + pi, (-r) + 15, (-r) + 30);
  // text('circle ' + crcl, (-r) + 15, (-r) + 55)
  // text('total ' + total, (-r) + 15, (-r) + 80)
  
}

function fireRandomly(){
  var x;
  var y;
  var distanceFromCenter;
  
  x = random(-r,r)
  y = random(-r,r)

  // sqrt is an expensive calculation
  // can leave distance as (x*x + y*y) instead of sqrt(x*x + y*y)
  // and use if (distanceFromCenter < r*r)
  
  distanceFromCenter = (x*x + y*y)

  total ++;
  
  if (distanceFromCenter < r*r){
    crcl ++;
      stroke(255, 0, 0, 100)
  } else {
      stroke(0, 255, 255, 100)
  }
  strokeWeight(1)
  point(x,y)
  
}