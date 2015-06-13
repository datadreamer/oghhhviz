var table;
var submissions = new Array();
var yearCount = new Array();
var years = new Array();
var yearLow;
var yearHigh;
var yearCountHigh = 0;
var dtLow;
var dtHigh;
var scoreLow;
var scoreHigh = -9999999999;
var timerange, pos;
var margin = 20;
var sortmode = false;
var videoPlayer = new VideoPlayer();;

function preload(){
  table = loadTable("api.py", "csv", "header");
};

function setup(){
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  imageMode(CENTER);
  rectMode(CENTER);
  noStroke();
  fill(0,180,255,50);

  for (var r=0; r<table.getRowCount()-1; r++){
    var s =  new Submission(table.getRow(r));
    append(submissions, s);

    // get year range
    if(s.year < yearLow || yearLow == undefined){
      yearLow = s.year;
    }
    if(s.year > yearHigh || yearHigh == undefined){
      yearHigh = s.year;
    }

    // count years as they are added
    if(yearCount[s.year] == undefined){
      yearCount[s.year] = 1;
      years[s.year] = new Year(s.year);
    } else {
      yearCount[s.year]++;
      years[s.year].addSubmission(s);
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

  for(var y=0; y<yearCount.length; y++){
    if(yearCount[y] > yearCountHigh){
      yearCountHigh = yearCount[y];
    }
  }

  this.displayByTime();
  this.scaleSubmissions();
};

function displayByTime(){
  submissions.sort(sortByTime);
  var timeInADay = 86400000;
  for(var i=0; i<submissions.length; i++){
    // day of year is for horizontal distribution
    var day = new Date(int(submissions[i].dt + "000"));
    day.setHours(0);
    day.setMinutes(0);
    day.setSeconds(0);
    // time of day is for vertical distribution
    var time = submissions[i].date.getHours() * 60 * 60 * 1000;
    time += submissions[i].date.getMinutes() * 60 * 1000;
    time += submissions[i].date.getSeconds() * 1000;
    var tx = margin + (((day.valueOf()/1000) - dtLow) / (dtHigh-dtLow)) * (width - (margin*2));
    var ty = margin + ((time / timeInADay) * (height - (margin*2)));
    submissions[i].moveTo(int(tx), int(ty), 2000);
  }
}

function displayByYearAndScore(){
  submissions.sort(sortByYearAndScore);
  var currentYear = yearLow;
  for(var i=0; i<submissions.length; i++){
    var tx = margin + ((submissions[i].year - yearLow) / (yearHigh-yearLow)) * (width - (margin*2));
    var ty = 0;
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
    submissions[i].moveTo(int(tx), int(ty), 2000);
  }
};

function draw(){
  background(0);
  colorMode(HSB, 255);
  for(var i=0; i<submissions.length; i++){
    submissions[i].draw();
  }
  if(videoPlayer != undefined){
    videoPlayer.draw();
  }
};

function keyPressed(){
  if(key == "1"){
    this.scaleSubmissions();
    this.displayByYearAndScore();
  } else if(key == "2"){
    this.scaleSubmissions();
    this.displayByTime();
  } else if(key == " "){
    sortmode = !sortmode;
    this.scaleSubmissions();
  } else if(key == "-"){
    videoPlayer.aspectratio = 0.5625; // 16:9
  } else if(key == "="){
    videoPlayer.aspectratio = 0.75; // 4:3
  }
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
  if(videoPlayer.playing){
    videoPlayer.stop();
  } else {
    for(var i=0; i<submissions.length; i++){
      var s = submissions[i];
      if(s.isOver(mouseX, mouseY)){
        print(s.artist +" - "+ s.trackname +" ["+ s.year +"]: "+ s.score +", id: "+ s.url);
        videoPlayer.play(s);
      }
    }
  }
};

function scaleSubmissions(){
  // fit everything on screen
  var subH = (height - (margin*2)) / yearCountHigh;
  var subW = subH * 1.33;
  if(subW * (yearHigh-yearLow) > width - (margin*2)){
    subW = (width - (margin*2)) / (yearHigh-yearLow);
    subH = subW * 0.75;
  }

  for(var i=0; i<submissions.length; i++){
    if(sortmode){
      // TODO: scale total height baseed on canvas height
      submissions[i].scaleTo(subW, submissions[i].score * 3, 2000);
    } else {
      submissions[i].scaleTo(subW, subH, 2000);
    }
  }
}

function sortByTime(a, b){
  if(int(a.dt) > int(b.dt)){
    return 1;
  } else if(int(a.dt) < int(b.dt)){
    return -1;
  } else {
    return 0;
  }
}

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
