// https://www.youtube.com/watch?v=4hA7G3gup-4
var words = 'Jerome Paddick'
var rainbow = false;
var textSizeMult = 1.1;
var points;
let myFont;
var dotColor;
var pointsArray = [];
var vehicles = [];

function preload() {
  myFont = loadFont('assets/HighlandGothicFLF.ttf');
}

function setup() {
  createCanvas(800, 800);
  textFont(myFont);
  stroke(255, 255, 255, 255)

  // font object has a function textToPoints
  // returns Object(x, y, alpha)
  var wordSplit = words.split(' ')
  wordCount = wordSplit.length
  dotSize = 16/wordCount
  textSize(textSizeMult*280/wordCount)
  
  wordSplit.forEach((word, i) => {
  var points = myFont.textToPoints(
    word, 
    300 - (textSizeMult*30*word.length),
    (i+1)*height/(wordCount+1) + 50
  )
  pointsArray.push(points)
  })
  
  pointsArray.forEach((points) => {
    points.forEach(p => {
      if (rainbow==true){
        dotColor=color(random(255),random(255),random(255))
      } else {
        dotColor=color(255)
      }
      vehicles.push(
        new Vehicle(
          p.x, 
          p.y,
          dotColor,
          dotSize
        )
      )})
  })
}

function draw() {
  background(75)
  vehicles.forEach(v => {
                   v.behaviors();
                   v.update();
                   v.show();
  })              
}