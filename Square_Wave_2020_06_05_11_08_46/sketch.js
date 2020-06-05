// https://www.youtube.com/watch?v=H81Tdrmz2LA
// In leui of a 3d renderer (like webgl/3js etc)
// I use overlapped rectangled of different colors
// to imply 3d when threeD is set to true

var threeD = false;
var numLines = 20;
var speed = 0.03;
var rads = 2;
var phase = 1;
var lineGap = 3;
var boxMaxHeight = 250;
var numRows = 20;
var lines = [];
var startAngle = 0;

function setup() {
  background(0);
  createCanvas(400, 400);
  rectMode(CENTER);
  // strokeWeight(2);
  // stroke(255);
  noFill();
  dataSet = []
  if (threeD == false) {
    dataSet.push(createData(0, 'white'))
  } else {
    for (var i=0; i<numRows; i++){
     data = createData(
       phase*PI*i/numRows, 
       color(random(255),random(255),random(255))
                      );
     dataSet.push(data)
    }
    // console.log(lines[0])
  }
}

function draw() {
  background(0);
  translate(width/2, height/2)
  dataSet.forEach(set=>drawRect(set))
}

function createData(startAngle=0, col) {
  var arr = []
  var visWidth = width/2 - 30
  for (var i=0; i<numLines; i ++ ){
    var obj = {
      angle: rads*PI*abs(i/numLines) + startAngle,
      width: (visWidth/numLines),
      offset: i*(visWidth/numLines),
      col: col
    }
    arr.push(obj)
  }
  return arr
}

function drawRect(lines) {
  lines.forEach(box => {
    fill(box.col)
    // stroke(box.col)
    rect(
      box.offset, 
      0, 
      box.width - lineGap, 
      sinValue(box.angle)
        );
    rect(
      - box.offset, 
      0, 
      box.width - lineGap, 
      sinValue(box.angle)
        );
    box.angle -= speed
  })
}

function sinValue(angle) {
  return map(sin(angle), -1, 1, 0, boxMaxHeight)
}