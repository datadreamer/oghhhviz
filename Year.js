function Year(year){
  this.year = year;
  this.submissions = new Array();
}

Year.prototype = {
  constructor: Year,

  addSubmission:function(sub){
    this.submissions.push(sub);
  },

  getAverageScore:function(){
    return this.getTotalScore() / this.submissions.length;
  },

  getTotalScore:function(){
    var total = 0;
    for(var i=0; i<this.submissions.length; i++){
      total += this.submissions[i].score;
    }
    return total;
  },

  getSubmissionCount:function(){
    return this.submissions.length;
  }

}
