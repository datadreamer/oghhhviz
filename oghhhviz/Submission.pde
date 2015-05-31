class Submission{
  
  float x, y, w, h;
  String name, user, url, artist, trackname, flair;
  int dt, lastupdate, score, year;
  PImage thumb;
 
  //Submission(String name, int dt, String user, int lastupdate, int score, String url, String artist, String trackname, int year, String flair){
  Submission(String[] line){
    this.name = line[0];
    this.dt = int(line[1]);
    this.user = line[2];
    this.lastupdate = int(line[3]);
    this.score = int(line[4]);
    this.url = line[5];
    this.artist = line[6];
    this.trackname = line[7];
    this.year = int(line[8]);
    this.flair = line[9];
    this.thumb = loadImage("thumbs/"+this.name+".jpg");
    x = random(width);
    y = random(height);
    // TODO: crop thumbs to eliminate letterboxing/columning
    w = 20;//70;
    h = 15;//52;
  }
  
  void draw(){
    image(thumb, x, y, w, h);
  }
  
}
