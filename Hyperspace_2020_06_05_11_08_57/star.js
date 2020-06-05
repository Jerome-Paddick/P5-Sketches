function Star () {
  this.x = random(0, width);
  this.y = random(0, height);
  this.r = 0
  this.cx = (width/2)
  this.cy = (height/2)
  this.speed = 5
  
  this.update = function() {
    if (mouseX) {
      this.speed = 2*mouseX/100
    }
    var offx = this.x - this.cx;
    var offy = this.y - this.cy;
    this.r += 3 * (this.speed*(
      Math.abs(offx) + Math.abs(offy)
      )/10000)
    this.x += this.speed*(offx)/100
    if (this.x > width || this.x < 0) {
    this.x = random(width/4, 3*width/4);
    this.r = 0;
    }
    this.y += this.speed*(offy)/100
    if (this.y > height || this.y < 0) {
    this.y = random(height/4, 3*height/4);
    this.r = 0;
    }

    
  }
  
  this.show = function() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.r, this.r);
  }
  
}