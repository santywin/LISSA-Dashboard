import { ReactiveVar } from 'meteor/reactive-var'

Template.failedCourse.onCreated(function(){
  this.showTolerance = new ReactiveVar(false);
  this.checkFail = new ReactiveVar(true);
});


Template.failedCourse.helpers({
  color: function(){
    let color = "white"; //"#ef9a9a";
    if(this.grade < 8) color = "failed" //"#ff8a80"; //failed
    else if(this.grade > 9) color = "passed" //"#a5d6a7"; //passed
    else if(this.grade >= 8 && this.grade <= 9) color = "tolerable"; // "#ffcc80"; //tolerable
    else color = "failed"; // "#ff8a80"; //failed
    return color;
  },
  courseLabel: function(){
    let label  = "NT";
    if ((this.try1 > 9) || (this.try2 > 9)) label = "G"; // Passed
    else if ((this.try1 >= 8 && this.try1 <= 9) || (this.try2 >= 8 && this.try2 <= 9)) label =  "T";
    else label = "NT";
    return label;
  },
  try1: function(){
    let bold  = "bold";
    if(this.try1 < this.try2) bold = "notbold";
    return {"grade":this.try1, "bold": bold};
  },
  try2: function() {
    let bold  = "bold";
    if(this.try1 > this.try2) bold = "notbold";
    return {"grade":this.try2, "bold": bold};
  }
});

Template.failedCourse.events({
  "click .top-bar.tolerable": function(event,template){
    if(!template.showTolerance.get()) {
      template.$(".course-bottom").css("max-height", "48px");
      template.$(".top-bar").css("box-shadow", "1px 1px 5px gainsboro");
      template.showTolerance.set(true);
    } else {
      template.$(".course-bottom").css("max-height", "0px");
      template.$(".top-bar").css("box-shadow", "0px 0px 0px gainsboro");
      template.$(".course").css("box-shadow", "0px 0px 0px gainsboro");
      template.$(".course").css("transform", "scale(1)");
      template.$(".course").css("z-index", "0");
      template.showTolerance.set(false);
    }
  },

  "click .stay-failed": function(event, template){
    console.log("fail");
    // if already clicked => do nothing
    if(!template.checkFail.get()){
      template.$(".check-fail").css("color", "white");
      template.$(".check-tolerate").css("color", "transparent")
      template.checkFail.set(true);
    }
  },

  "click .tolerate-course": function(event, template){
    console.log("tolerate");
    // not tolerate is checked
    if(template.checkFail.get()){
      template.$(".check-fail").css("color", "transparent");
      template.$(".check-tolerate").css("color", "white")
      let creditsLeft = $('#tolerantiepunten').find("paper-progress").attr('value');
      let afterToleration = creditsLeft - this.credit;
      if (afterToleration > 0){
        $('#tolerantiepunten').find("paper-progress").attr('value', afterToleration);
      }
      template.checkFail.set(false);
    }
  }
});

Template.failedCourse.onRendered(function(){
});
