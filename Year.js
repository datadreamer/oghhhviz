function Year(year){
  this.year = year;
  this.submissions = new Array();
}

Year.prototype = {
  constructor: Year,

  addSubmission:function(sub){
    this.submissions.push(sub);
  }

}
