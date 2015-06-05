var table;
var submissions = new Array();
var yearLow;
var yearHigh;
var dtLow;
var dtHigh;
var scoreLow;
var scoreHigh = -9999999999;
var timerange, pos;

function preload(){
  table = loadTable("submissions.csv", "csv", "header");
};

function setup(){
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  for (var r=0; r<table.getRowCount(); r++){
    var s =  new Submission(table.getRow(r));
    append(submissions, s);

    // get year range
    if(s.year < yearLow || yearLow == undefined){
      yearLow = s.year;
    }
    if(s.year > yearHigh || yearHigh == undefined){
      yearHigh = s.year;
    }

    // get time range
    if(int(s.dt) < dtLow || dtLow == undefined){
      dtLow = s.dt;
    }
    if(int(s.dt) > dtHigh || dtHigh == undefined){
      dtHigh = s.dt;
    }

    // get score range
    if(int(s.score) < scoreLow || scoreLow == undefined){
      scoreLow = s.score;
    }
    if(int(s.score) > scoreHigh || scoreHigh == undefined){
      scoreHigh = s.score;
    }
  }

  timerange = dtHigh - dtLow;

  for(var i=0; i<submissions.length; i++){
    pos = (submissions[i].dt - dtLow) / timerange;
    var tx = pos * width;
    var ty = height - ((submissions[i].score / float(scoreHigh)) * height);
    submissions[i].moveTo(tx, ty, 2000)
  }
};

function draw(){
  background(255);
  for(var i=0; i<submissions.length; i++){
    submissions[i].draw();
  }
};

function mousePressed(){
  for(var i=0; i<submissions.length; i++){
    var s = submissions[i];
    if(s.isOver(mouseX, mouseY)){
      print(s.artist +" - "+ s.trackname +" ["+ s.year +"]");
    }
  }
};

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  for(var i=0; i<submissions.length; i++){
    pos = (submissions[i].dt - dtLow) / timerange;
    var tx = pos * width;
    var ty = height - ((submissions[i].score / float(scoreHigh)) * height);
    submissions[i].moveTo(tx, ty, 1000)
  }
};
