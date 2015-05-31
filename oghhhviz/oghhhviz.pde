ArrayList<Submission> submissions = new ArrayList<Submission>();

int yearLow = 10000;
int yearHigh = 0;
int dtLow = 9999999999;
int dtHigh = 0;
int scoreLow = 9999999999;
int scoreHigh = -9999999999;
float timerange, pos;

void setup(){
  size(1280,720);
  frameRate(60);
  imageMode(CENTER);
  String lines[] = loadStrings("submissions.csv");
  for (int i=1; i < lines.length; i++) {
    Submission s = new Submission(lines[i].split(","));
    
    // get year range
    if(s.year < yearLow){
      yearLow = s.year;
    }
    if(s.year > yearHigh){
      yearHigh = s.year;
    }
    
    // get time range
    if(s.dt < dtLow){
      dtLow = s.dt;
    }
    if(s.dt > dtHigh){
      dtHigh = s.dt;
    }
    
    // get score range
    if(s.score < scoreLow){
      scoreLow = s.score;
    }
    if(s.score > scoreHigh){
      scoreHigh = s.score;
    }
    
    submissions.add(s);
  }
  //println("scoreLow: "+ scoreLow +", scoreHigh: "+ scoreHigh);
  timerange = dtHigh - dtLow;
  
  // position submissions on timeline
  for(Submission sub : submissions){
    pos = (sub.dt - dtLow) / timerange;
    sub.x = pos * width;
    sub.y = height - ((sub.score / (float)scoreHigh) * height);//random(height);
  }
}

void draw(){
  background(128);
  for(Submission sub : submissions){
    sub.draw();
  }
}
