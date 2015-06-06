function Submission(data){
  this.name = data.getString(0);
  this.dt = data.getString(1);
  this.user = data.getString(2);
  this.lastupdate = data.getString(3);
  this.score = data.getString(4);
  this.url = data.getString(5);
  this.artist = data.getString(6);
  this.trackname = data.getString(7);
  this.year = data.getString(8);
  this.flair = data.getString(9);
  this.thumb = loadImage("thumbs/"+this.name+".jpg", this.imageLoaded, this.imageError);
  this.x = random(width);
  this.y = height + random(height);
  this.w = 20;//70;
  this.h = 15;//52;
  //this.h = this.score * 3
  this.a = 255;

  // animation variables
  this.moving = false;
}

Submission.prototype = {
  constructor: Submission,

  draw:function(){
    if(this.thumb != undefined){
      this.handleMoving();
      //image(this.thumb, this.x, this.y, this.w, this.h);
      fill(150 - (this.score / scoreHigh) * 150, 255, 255);
      rect(this.x, this.y, this.w, this.h);
      stroke(0,0,255);
      line(this.x-this.w/2, this.y+this.h/2, this.x+this.w/2, this.y+this.h/2);
      noStroke();
    }
  },

  handleMoving:function(){
    if(this.moving){
      if(this.moveTimer.isFinished()){
        this.x = this.targetx;
        this.y = this.targety;
        this.moving = false;
      } else {
        var pos = this.moveTimer.sinProgress();
        this.x = this.pastx + ((this.targetx - this.pastx) * pos);
        this.y = this.pasty + ((this.targety - this.pasty) * pos);
      }
    }
  },

  imageError:function(){
    loadImage("thumbs/default.jpg");
  },

  imageLoaded:function(){

  },

  isOver:function(mx, my){
    if(mx > this.x-(this.w/2) && mx < this.x+(this.w/2) && my > this.y-(this.h/2) && my < this.y+(this.h/2)){
      return true;
    }
    return false;
  },

  moveTo:function(targetx, targety, duration){
    this.targetx = targetx;
    this.targety = targety;
    this.pastx = this.x;
    this.pasty = this.y;
    this.moveTimer = new Timer(duration);
    this.moveTimer.start();
    this.moving = true;
  }
}
