function VideoPlayer(id){
  this.id = id;
  this.video;
  this.playing = false;
  this.a = 0;
  this.fading = false;
}

VideoPlayer.prototype = {
  constructor: VideoPlayer,

  draw:function(){
    this.handleFading();
    fill(0, this.a);
    rect(width/2, height/2, width, height);
    if(this.video != undefined && this.playing){
      tint(255, this.a);
      image(this.video, width/2, height/2, width, width * 0.5625);
    }
  },

  handleFading:function(){
    if(this.fading){
      if(this.fadeTimer.isFinished()){
        this.a = this.targeta;
        this.fading = false;
        if(this.a == 0){
          // faded out, remove shit
          this.video = undefined;
          this.playing = false;
          removeElements();
        }
      } else {
        this.a = this.pasta + (this.fadeTimer.progress() * (this.targeta - this.pasta));
      }
    }
  },

  play:function(){
    this.video = createVideo("youtube.py?id=" + this.id);
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
    //this.video.stop();
    this.targeta = 0;
    this.pasta = this.a;
    this.fading = true;
    this.fadeTimer = new Timer(1000);
    this.fadeTimer.start();
  }
}
