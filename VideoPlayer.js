function VideoPlayer(){
  this.video;
  this.playing = false;
  this.fading = false;
  this.a = 0;
  this.aspectratio = 0.5625;
}

VideoPlayer.prototype = {
  constructor: VideoPlayer,

  draw:function(){
    this.handleFading();
    if(this.s != undefined){
      fill(0, this.a);
      rect(width/2, height/2, width, height);
      if(this.video != undefined && this.playing){
        tint(255, this.a);
        image(this.video, width/2, height/2, width, width * this.aspectratio);
      }
      fill(0, this.a * 0.5);
      rect(width/2, height - 50, width, 100);
      fill(255, this.a);
      textSize(32);
      text(this.s.artist +" - "+ this.s.trackname +" ["+ this.s.year +"]", margin, height - 50);
    }
  },

  handleFading:function(){
    if(this.fading){
      if(this.fadeTimer.isFinished()){
        this.a = this.targeta;
        this.fading = false;
      } else {
        this.a = this.pasta + (this.fadeTimer.progress() * (this.targeta - this.pasta));
      }
    }
  },

  play:function(s){
    this.s = s;
    this.video = createVideo("youtube.py?id=" + this.s.url);
    this.video.play();
    this.video.hide();
    this.playing = true;
    this.targeta = 255;
    this.pasta = this.a;
    this.fading = true;
    this.fadeTimer = new Timer(1000);
    this.fadeTimer.start();
  },

  pause:function(){
    this.video.pause();
  },

  stop:function(){
    this.video.stop();
    this.video = undefined;
    this.playing = false;
    removeElements();
    this.targeta = 0;
    this.pasta = this.a;
    this.fading = true;
    this.fadeTimer = new Timer(1000);
    this.fadeTimer.start();
  }
}
