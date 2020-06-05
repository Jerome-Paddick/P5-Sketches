// The aim of this code is to create a matrix rain effect, loosely basing my code from this video tutorial youtube.com/watch?v=S1TQCi9axzg

var symbol;
var streams = [];
var streamCount
var symbolSize = 20
var blur = 160

function setup() {
  createCanvas(
    window.innerWidth,
    window.innerHeight
  );
  streamCount = round(width / 15)
  background(0);
  for (var i = 0; i < streamCount; i++) {
    streams[i] = new Stream()
    streams[i].generateSymbols()
  }
  textSize(symbolSize)


}

function draw() {
  // background(color, opacity) 
  // -> opacity is how much of previous frame remains drawn on new frame
  background(0, blur)
  for (var i = 0; i < streamCount; i++) {
    streams[i].render()
  }

}

function Symbols(x, y, speed, first) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.first = first;
  this.canChange;
  this.value = String.fromCharCode(
    0x30A0 + round(random(0, 96))
  );
  this.switchInterval = round(random(50, 80))

  this.setToRandomSymbol = function() {
    // 0x30A0 -> start of katakana unicode block 
    // frameCount -> inbuilt function of p5
    if (this.canChange > 0) {
      this.canChange -= 1
    }
    if (
      frameCount % this.switchInterval == 0 &&
      this.canChange == 0
    ) {
      this.value = String.fromCharCode(
        0x30A0 + round(random(0, 96))
      )
    }
  }

  this.rain = function() {
    this.y += this.speed
    // if (this.y > height) {
    //   this.y = 0
    // }
  }
}

function Stream() {
  this.symbols = [];
  this.totalSymbols = round(random(8, 30));
  this.speed = random(5, 10);

  this.generateSymbols = function() {
    var first = round(random(0, 5)) == 1;
    var y = random(-1500, 0);
    var x = random(0, width);

    for (var i = 0; i <= this.totalSymbols; i++) {
      symbol = new Symbols(x, y, this.speed, first);
      symbol.setToRandomSymbol();
      this.symbols.push(symbol);
      y -= symbolSize;
      first = false
    }
  }

  this.render = function() {
    this.symbols.forEach(function(symbol) {
      if (symbol.first) {
        fill(180, 255, 180)
      } else {
        fill(0, 255, 70);
      }
      text(symbol.value, symbol.x, symbol.y);
      symbol.setToRandomSymbol()
      symbol.rain()
    })
    if (round(random(0, 500)) == 1) {
      var neo = round(random(7, this.symbols.length)) - 6
      this.symbols[neo + 0].value = 'o'
      this.symbols[neo + 0].canChange = 3
      this.symbols[neo + 1].value = 'e'
      this.symbols[neo + 1].canChange = 3
      this.symbols[neo + 2].value = 'n'
      this.symbols[neo + 2].canChange = 3
    }
    if (this.symbols[this.symbols.length - 1].y > height + symbolSize) {
      this.symbols = [];
      this.totalSymbols = round(random(5, 30));
      this.generateSymbols()
    }
  }
}