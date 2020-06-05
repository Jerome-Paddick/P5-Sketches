// RANDOM VECTOR p5.Vector.random2D()

function Vehicle(x, y, color, dotSize) {
  this.x = x;
  this.y = y;
  this.pos = createVector(random(0,800),random(0,800));
  this.target = createVector(x,y);
  this.vel = p5.Vector.random2D().mult(2)
  this.acc = createVector();
  this.rev = false
  this.r = dotSize
  this.color = color;
  this.stopped = false
}

// prototypes attach functions to objects

Vehicle.prototype.behaviors =function() {
  var seek = this.seek(this.target);
  this.applyForce(seek);
}
 
Vehicle.prototype.seek = function(target) {
  if (this.stopped == false) {
  var desired = p5.Vector.sub(target, this.pos);
  if (desired.mag() > 800 ) {
    this.rev = true;
    this.vel = p5.Vector.mult(desired, random(0.002, 0.004))
  }
  if (desired.mag() < 1.2  && this.rev == true) {
    this.vel = p5.Vector.mult(this.vel, 0)
    this.stopped = true;
  }
  }
//   if (mag(this.target - this.pos) > 10) {
//   
//   var d = desired.mag();
//   var speed = this.maxspeed;
//   if (d < 100) {
//     var speed = map(d, 0, 100, 0, this.maxspeed)
    
//   }
//     desired.setMag(this.maxspeed);
//   var steer = p5.Vector.sub(desired, this.vel);
//   return steer
//   }

}

Vehicle.prototype.applyForce = function(f) {
  this.acc.add(f);
}

Vehicle.prototype.update = function() {
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);
}

Vehicle.prototype.show = function() {
  strokeWeight(0)
  fill(this.color)
  stroke(0)
  circle(this.pos.x, this.pos.y, this.r, this.r)
}