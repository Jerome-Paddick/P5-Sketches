var stars = [];
var speed;

function setup() {
  createCanvas(800, 800);
  for (var i = 0; i < 100; i++){
    stars[i] = new Star()
  }
}



function draw() {
  background(0);
  for (var i = 0; i < stars.length; i++) {
    stars[i].update();
    stars[i].show();
  }
}