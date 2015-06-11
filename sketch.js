var table;
var submissions = new Array();
var yearLow;
var yearHigh;
var dtLow;
var dtHigh;
var scoreLow;
var scoreHigh = -9999999999;
var timerange, pos;
var margin = 20;
var sortmode = false;
var videoPlayer;

function preload(){
  table = loadTable("submissions.csv", "csv", "header");
};

function setup(){
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  imageMode(CENTER);
  rectMode(CENTER);
  noStroke();
  fill(0,180,255,50);

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

  this.displayByYearAndScore();
};

function displayByYearAndScore(){
  submissions.sort(sortByYearAndScore);
  var currentYear = yearLow;
  for(var i=0; i<submissions.length; i++){
    var tx = margin + ((submissions[i].year - yearLow) / (yearHigh-yearLow)) * (width - (margin*2));
    var ty = 0;
    if(sortmode){
      submissions[i].scaleTo(20, submissions[i].score * 3, 2000);
    } else {
      submissions[i].scaleTo(20, 15, 2000);
    }
    if(submissions[i].year != currentYear){
      currentYear = submissions[i].year;
      ty = height - margin - submissions[i].targeth/2;
    } else {
      if(i > 0){
        ty = (submissions[i-1].targety - submissions[i-1].targeth/2) - submissions[i].targeth/2;
      } else {
        ty = height - margin - submissions[i].targeth/2;
      }
    }
    submissions[i].moveTo(tx, ty, 2000);
  }
};

function draw(){
  background(255);
  colorMode(HSB, 255);
  for(var i=0; i<submissions.length; i++){
    submissions[i].draw();
  }
  if(videoPlayer != undefined){
    videoPlayer.draw();
  }
};

function keyPressed(){
  sortmode = !sortmode;
  this.displayByYearAndScore();
};

function mouseReleased(){
  for(var i=0; i<submissions.length; i++){
    var s = submissions[i];
    s.displayColor();
  }
};

function mouseMoved(){
  for(var i=0; i<submissions.length; i++){
    var s = submissions[i];
    if(s.isOver(mouseX, mouseY)){
      s.displayThumb();
    } else {
      s.displayColor();
    }
  }
}

function mousePressed(){
  if(videoPlayer != undefined){
    if(videoPlayer.playing){
      videoPlayer.stop();
    }
  }
  for(var i=0; i<submissions.length; i++){
    var s = submissions[i];
    if(s.isOver(mouseX, mouseY)){
      print(s.artist +" - "+ s.trackname +" ["+ s.year +"]: "+ s.score +", id: "+ s.id);
      // create video player object
      videoPlayer = new VideoPlayer(s.id);
      videoPlayer.play();
    }
  }
};

function sortByYearAndScore(a, b){
  if(int(a.year) > int(b.year)){
    return 1;
  } else if(int(a.year) < int(b.year)){
    return -1;
  } else {
    if(int(a.score) > int(b.score)){
      return 1;
    } else if(int(a.score) < int(b.score)){
      return -1;
    } else {
      if(int(a.dt) > int(b.dt)){
        return 1;
      } else if(int(a.dt) < int(b.dt)){
        return -1;
      } else {
        return 0;
      }
    }
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  this.displayByYearAndScore();
};
