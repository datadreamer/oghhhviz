function VideoPlayer(id){
  this.id = id;
  this.video;
  this.playing = false;
}

VideoPlayer.prototype = {
  constructor: VideoPlayer,

  draw:function(){
    if(this.playing && this.video != undefined){
      fill(0);
      //rect(width/2, height/2, width, height);
      // TODO: check aspect ratio of video and constrain it to fit inside window
      image(this.video, width/2, height/2, width, height);
    }
  },

  play:function(){
    this.video = createVideo("youtube.py?id=" + this.id);
    this.video.play();
    this.video.hide();
    this.playing = true;
    print("start playing " + this.id);
  },

  pause:function(){
    this.video.pause();
  }
}
