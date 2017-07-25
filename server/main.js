import { Meteor } from 'meteor/meteor';

var Courses = new Meteor.Collection('generic_courses');
var Grades = new Mongo.Collection('generic_grades');
var CSEs = new Mongo.Collection('generic_cse');
var Students = new Mongo.Collection('generic_students');
//var Bachelor = new Meteor.Collection('bachelor');
var Historical = new Meteor.Collection('generic_history_sept');
//var September = new Meteor.Collection('september');
var Ijkingstoets = new Meteor.Collection('ijkingstoets');
var Exams = new Meteor.Collection('generic_examsuccess');
//var TTT_analyse = new Meteor.Collection('TTT_analyse');
//var TTT_mechanica = new Meteor.Collection('TTT_mechanica');
//var TTT_scheikunde = new Meteor.Collection('TTT_scheikunde');
//var TTT_algebra = new Meteor.Collection('TTT_algebra');



Meteor.publish('generic_grades', function(who){
  //console.log(who);
  return Grades.find({studentid: who});
});

Meteor.publish('generic_courses', function(){
  return Courses.find();
});

Meteor.publish('generic_students', function(who){
  return Students.find();
});


Meteor.publish("ijkingstoets", function(who){

  return Ijkingstoets.find({student:who});
})

/*Meteor.publish("TTT_analyse", function(who){
  //return TTT_analyse.find({student:620434});
  return TTT_analyse.find({student:who});
})

Meteor.publish("TTT_mechanica", function(who){
  //return TTT_mechanica.find({student:620434});
  return TTT_mechanica.find({student:who});
})

Meteor.publish("TTT_scheikunde", function(who){
  return TTT_scheikunde.find({student:who});
  //return TTT_scheikunde.find({student:0});
})

Meteor.publish("TTT_algebra", function(who){
  return TTT_algebra.find({student:who});
  //return TTT_scheikunde.find({student:0});
})*/

Meteor.methods({
  /*getTTTTotalDistribution: function(args)
  {
    //we will get 2 courses. find out which, and match them to the ECTS
    var ECTS ={ TTT_analyse: 6,
      TTT_mechanica: 5,
      TTT_scheikunde: 7,
      TTT_algebra: 5
    };
    var courseNames = ["TTT_analyse","TTT_mechanica","TTT_scheikunde","TTT_algebra"];
    var courses = Courses.find({semester:0});
    var studentScore = 0;
    var studentECTS = 0;
    var courses = args[0];
    var student = args[1];
    var scores = {};
    if(courses == undefined || courses.length == 0)  return {distribution:[], studentScore:0};;
    if(courses.indexOf("TTT_analyse") >= 0)
      scores["TTT_analyse"] =  TTT_analyse.find({grade:{$ne:"NA"}}).fetch();
    if(courses.indexOf("TTT_mechanica") >= 0)
      scores["TTT_mechanica"] = TTT_mechanica.find({grade:{$ne:"NA"}}).fetch();
    if(courses.indexOf("TTT_scheikunde") >= 0)
      scores["TTT_scheikunde"] = TTT_scheikunde.find({grade:{$ne:"NA"}}).fetch();
      if(courses.indexOf("TTT_algebra") >= 0)
        scores["TTT_algebra"] = TTT_algebra.find({grade:{$ne:"NA"}}).fetch();
    var studentGrades = {};
    //multiply them with ECTS each, then divide by total ECTS
    var totalECTS = 0;
    var modifier = 5
    courseNames.forEach(function(c){
      modifier = 1;
      if(scores[c] == undefined) return;
      if(c == "TTT_scheikunde") modifier = 5;
      var ects = ECTS[c];
      scores[c].forEach(function(s){
        if(studentGrades[s.student] == undefined){
          studentGrades[s.student] = [];
        }
        //if it's the student, gather his info so we can return his total score
        if(s.student == student)
        {
          studentECTS += ects;
          studentScore += parseInt(s.grade/modifier)*ects;
        }
        studentGrades[s.student].push(parseInt(s.grade/modifier)*ects);
      })
      totalECTS += ects;

    });
    //console.log(studentGrades)
    if(totalECTS == 0){
      //console.log("0 total ECTS, that's a bidt weird");
       return {distribution:[], studentScore:0};
     }
     studentScore /= studentECTS;
     //divide student's personal score

    //divide
    var scores = [];
    Object.keys(studentGrades).forEach(function(st){
      var s = studentGrades[st];
      if(s.length < courses.length) return; //only get the students who have these two courses as TTT, otherwie they have other combo and we can't compare.
      var t = 0;
      for(var i=0;i< courses.length;i++) t+=s[i];
      scores.push(parseInt(t/totalECTS));

    });
    //console.log(JSON.stringify(scores));

    var buckets = {};
    for(var i=0;i<10;i++)
    {
      buckets[i] = 0;
    }
    //get highest score

    scores.forEach(function(s){

      var bucketId = parseInt(s/2);
      if(bucketId == 10) bucketId = 9; //think about this. it's because we only have 10 buckets, not 11, which would include 20 as seperate

      buckets[bucketId]++;

    })
    var distribution = [];
    Object.keys(buckets).forEach(function(b){
      distribution.push({bucket:parseInt(b), count:buckets[b]})
    })
    //console.log("TTT" + JSON.stringify(distribution))
    return {distribution: distribution , studentScore:studentScore*5};
  },*/

  getIjkingstoetsTotalDistribution: function(args)
  {
    var scores = Ijkingstoets.find({jaar:args[0]});
    var buckets = {};
    for(var i=0;i<10;i++)
    {
      buckets[i] = 0;
    }
    //get highest score

    scores.forEach(function(s){
      if(s.juli == "#")
      {
            if(s.september == "#")
            {
              return;
            }
            else score = s.september;
      }
      else if(s.september == "#")
      {
        score = s.juli;
      }
      else {
        score = s.juli > s.september ? s.juli : s.september;
      }
      var bucketId = parseInt(score/2);
      if(bucketId == 10) bucketId = 9; //think about this. it's because we only have 10 buckets, not 11, which would include 20 as seperate

      buckets[bucketId]++;

    })
    var distribution = [];
    Object.keys(buckets).forEach(function(b){
      distribution.push({bucket:parseInt(b), count:buckets[b]})
    })
    return {distribution: distribution};
  },
  getSemesterDistribution: function(args){
    var search = {};
    var distribution = [];
    var cse = "";
    if(args[0] == "januari"){
      cse = "cse1";

    }
    else if(args[0] == "juni")
    {
      cse = "cse2";
    }
    else {
      cse = "cse3";
      search["cse2"] = {$lt:100};
    }
    search["year"] = args[1];
    search["$and"] = [];
    var and1 = {}; var and2 = {};
    for(var i=0;i < 10; i++)
    {

      and1[cse] = {$lt: (10 + i * 10)};
      and2[cse] = {$gte: 0 + i * 10};
      if(i == 9)
        and1[cse] = {$lte: (10 + i * 10)};
      search["$and"] = [and1, and2];
      //console.log(JSON.stringify(search));

      var count = CSEs.distinct("studentid",search).length
      distribution.push({bucket:i, count:count});
    }
    return {distribution: distribution};
  },
  getTotalPointDistribution: function(args){ //this function is like semester, but not CSE, focused on scores alone
    var courses = Courses.find({semester:args[0]}).fetch();
    var courseIds = [];
    courses.forEach(function(c){
      courseIds.push(c.courseid);
    });

    var search = {};
    var distribution = [];
    var cse = "finalscore";

    search["courseid"] = {"$in": courseIds};
    search["year"] = args[1];
    search["$and"] = [];
    var and1 = {}; var and2 = {};
    for(var i=0;i < 10; i++)
    {

      and1[cse] = {$lt: (2+ i * 2)};
      and2[cse] = {$gte: 0 + i * 2};
      if(i == 9)
        and1[cse] = {$lte: (2 + i * 2)};
      search["$and"] = [and1, and2];
      //console.log(JSON.stringify(search));

      var count = Grades.distinct("studentid",search).length
      distribution.push({bucket:i, count:count});
    }
    console.log(JSON.stringify(search));
    return {distribution: distribution};
  },
  getIjkingstoetsPointDistribution:function(args){
    var numberPerGrades_juli = {};
    var numberPerGrades_september = {};
    console.log("ijk",args);
    //get all grades of this year
    var studentGrades = Ijkingstoets.find({jaar: args[0]});
    if(studentGrades == undefined) return null;

    studentGrades.forEach(function(student){
        //get correct grade
        var grade = 0;
        if(student.juli  != "#" )
        {
          if(numberPerGrades_juli[student.juli] == undefined)
            numberPerGrades_juli[student.juli] = {grade: student.juli, count:0};
          numberPerGrades_juli[student.juli].count++;
        }
        if(student.september  != "#" )
        {
          if(numberPerGrades_september[student.september] == undefined)
            numberPerGrades_september[student.september] = {grade: student.september, count:0};
          numberPerGrades_september[student.september].count++;
        }

    });
    var min_june = Number.MAX_VALUE;var min_september = Number.MAX_VALUE;
    var max_june = Number.MIN_VALUE;var max_september = Number.MIN_VALUE;
    Object.keys(numberPerGrades_juli).forEach(function(score){
      if(min_june > numberPerGrades_juli[score].count)
        min_june = numberPerGrades_juli[score].count;
      if(max_june < numberPerGrades_juli[score].count)
        max_june = numberPerGrades_juli[score].count;
    });
    Object.keys(numberPerGrades_september).forEach(function(score){
      if(min_september > numberPerGrades_september[score].count)
        min_september = numberPerGrades_september[score].count;
      if(max_september < numberPerGrades_september[score].count)
        max_september = numberPerGrades_september[score].count;
    });


    numberPerGrades_juli = Object.keys(numberPerGrades_juli).map(function(key){
      return numberPerGrades_juli[key];
    });
    numberPerGrades_september = Object.keys(numberPerGrades_september).map(function(key){
      return numberPerGrades_september[key];
    });
    return [
      {numberPerGrades: numberPerGrades_juli, min:min_june, max:max_june},
      {numberPerGrades: numberPerGrades_september, min:min_september, max:max_september},
    ];
  }
  ,
    getCoursePointDistribution: function(args){
      var gradeField = "grade_try1";
      if(args[2] == 3) gradeField = "grade_try2";
        return helper_GetDistribution({courseid: args[0], year: args[1]}, Grades, gradeField);


  },
  getTTT_AnalysePointDistribution: function(args){
      return helper_GetDistribution({}, TTT_analyse,"grade");

},
  getTTT_MechanicaPointDistribution: function(args){
    return helper_GetDistribution({}, TTT_mechanica,"grade");

},
getTTT_ScheikundePointDistribution: function(args){
  return helper_GetDistributionFrom100({}, TTT_scheikunde,"grade");

},
getTTT_AlgebraPointDistribution: function(args){
  return helper_GetDistribution({}, TTT_algebra,"grade");

},

  getHistoricalData: function(who){

    //count how many tolerable, failed etc

    //get the sem1 en sem2 courses only
    var courses = Courses.find({$or:[{semester:1},{semester:2}]}).fetch();
    var courseIds =[];
    courses.forEach(function(c){
      courseIds.push(c.courseid);
    })

    var CSE_student = CSEs.findOne({studentid:who});

    //console.log(JSON.stringify(CSE_student));
    //TODO: select the CSE we want to filter on
    //green
    var limit1 = 100; var limit2 = 0;
    if(Meteor.settings.public.cselimit1 != undefined && Meteor.settings.public.cselimit2 != undefined)
    {
      limit1 = Meteor.settings.public.cselimit1;
      limit2 = Meteor.settings.public.cselimit2;
    }

    if(CSE_student["cse2"] >= limit1)
    {
      status = "green";
      match = {"cse_jun": {$gte:limit1}};

    }
    else if(CSE_student["cse2"] <limit1 && CSE_student["cse2"] >= limit2)
    {
      status = "orange";
      match = {$and:[{"cse_jun": {$lt:limit1}},{"cse_jun": {$gte:limit2}}]};
    }
    else {
      status = "red";
      match = {"cse_jun": {$lt:limit2}};
    }

   console.log(status);
   //match = {failed:f, tolerable:t};
   //now compare with DB
   console.log(JSON.stringify(match));

   var result = Historical.aggregate([
      {$match : match},
     //{ $project : { bachelor :  "$bachelor" , tolerable : "$tolerable"} },
      {$group : { _id : "$traject" , "Count" : { $sum : 1}}}
    ]
  );
  console.log(result);
    return result;

  },
  getHistoricalData_old: function(who){
    //count how many tolerable, failed etc

    var f = Grades.find({studentid:who, finalscore:{$lt:8}}).count();
    f += Grades.find({studentid:who, finalscore:"NA"}).count();
    var t = Grades.find({studentid:who, $and: [{finalscore:{$gte:8}}, {finalscore:{$lte:9}}]}).count();
    var p = Grades.find({studentid:who, finalscore:{$gte:10}}).count();
    console.log("ftp",f,t,p);

   //green
   var status = "";
   if(f == 0 && t <= 2)
   {
    status = "green";
    match = {failed:0, tolerable: {$lte:2}};
   }
   else if((f > 0 && f <=4) || (t > 2 && f == 0))
   {
    status = "orange";
    match = {$or: [
                    {
                      $and:
                        [
                          {failed:{$gt:0}},
                          {failed:{$lte:3}}
                        ]
                  },
                    {
                      $and:
                        [
                          {tolerable:{$gt:2}}, {failed:0}
                        ]}
                      ]
                  };
   }
   else {
     status = "red";
     match = {failed:{$gt:3}};
   }
   //console.log(status);
   //match = {failed:f, tolerable:t};
   //now compare with DB
   //console.log(JSON.stringify(match));
   var result = Bachelor.aggregate([
      {$match : match},
     //{ $project : { bachelor :  "$bachelor" , tolerable : "$tolerable"} },
      {$group : { _id : "$status" , "Count" : { $sum : 1}}}
    ]
  );
    return result;

  },
  //number of courses passed, and % chance to pass all courses
  getSeptemberSucces(nrOfCourses)
  {
    var result = {averageCoursesPassed:0, percentAllPassed:0};
    var ret = September.aggregate([
      {$match:{taken:nrOfCourses[0]}},
      {$group:
        { _id: null, passed_avg: {$avg: "$passed"}},

      }
    ])[0];
    if(ret == undefined) return {averageCoursesPassed:0, percentAllPassed:0};

    result.averageCoursesPassed = ret.passed_avg;


    var all = September.find({taken:nrOfCourses[0]}).count();

    var passed = September.find({taken:nrOfCourses[0], passed:nrOfCourses[0]}).count();
    result.percentAllPassed = passed/all;

    return result;

  },
  getSeptemberSuccess(nrOfCourses)
  {

    var result = {averageCoursesPassed:0, percentAllPassed:0};
    if(nrOfCourses == 0) return {averageCoursesPassed:0, percentAllPassed:1};;
    //find all students that took courses in september, and get the number of courses they took
    var total = Exams.aggregate([
      {$match:{grade_try2:{$gte:0}}}, {$group:{ _id: "$studentid", "c":{$sum: 1}}}
    ]);
    //console.log("in sept", total);
    //find all students that took courses in september, passed them, and how many
    var passed = Exams.aggregate([
      {$match:{grade_try2:{$gte:10}}}, {$group:{ _id: "$studentid", "c":{$sum: 1}}}
    ]);
    //get all students that took exactly the same number of courses as nrOfCourses
    var studentsThatMatch = {};
    total.forEach(function(t){
      if(t.c != nrOfCourses) return;
      studentsThatMatch[t._id] = {"t":t.c};
    })
      //console.log("studentsmatch",nrOfCourses, studentsThatMatch);
    //see how many of these students passed all their exams
    var nrPassed = 0;
    passed.forEach(function(p){
      if(studentsThatMatch[p._id] == undefined) return; //only students with exact amount of nrOfCourses
      if(p.c != nrOfCourses) return;

      nrPassed++;
    })
    console.log("match",Object.keys(studentsThatMatch).length);
    console.log("passed",nrPassed);
    if(Object.keys(studentsThatMatch).length == 0)
      result.percentAllPassed = 0;
    else
      result.percentAllPassed = nrPassed/Object.keys(studentsThatMatch).length;
    return result;
  },
  getFailedCourses(who)
  {

    var allCourses = Courses.find({$or:[{semester:1},{semester:2}]}).fetch();
    var indices = [];
    allCourses.forEach(function(c){
      indices.push(c.courseid);
    })
    var result = [];
    var courses = Grades.find({
      studentid:who,
      courseid:{$in:indices},
    }).fetch();
  //  console.log("in failed courses", courses, who, indices, allCourses)
    courses.forEach(function(c){
      if(c.finalscore > 9) return;
      result.push(c);
    })
    return result;
  },
  getRootRoute(){
    if(process.env.ROOTROUTE != undefined)
    {
      console.log(process.env.ROOTROUTE);
      return process.env.ROOTROUTE;
    }
    else {
      return "dev";
    }
  }

});

Meteor.startup(() => {
  if(process.env.KEY != undefined)
  {//console.log(process.env.KEY)
      console.log("SSL activated ", process.env.ROOTROUTE, process.env.KEY, process.env.CERT);
      SSLProxy({
         port: process.env.SSL_PORT, //or 443 (normal port/requires sudo)
         ssl : {
              key: Assets.getText(process.env.KEY),
              cert: Assets.getText(process.env.CERT),

              //Optional CA
              //Assets.getText("ca.pem")
         }

      });
    }
  else {
    console.log("process.env.KEY/CERT is not set, running without certificate/ssl");
  }



});

var helper_GetDistribution = function(search, collection,gradeField)
{
  var numberPerGrades = {};
  var total = 0;
  //get all grades of this year
  var studentGrades = collection.find(search);

  var min = Number.MAX_VALUE;
  var max = Number.MIN_VALUE;
  //console.log(studentGrades);
  studentGrades.forEach(function(student){

      //get correct grade
      var grade = 0;


      if(student[gradeField] == "NA" || student[gradeField] == "#" || student[gradeField] == "GR") return;
      grade = parseInt(student[gradeField]);


      //filter out the weird numbers, check later what they mean


      if(numberPerGrades[grade] == undefined)
        numberPerGrades[grade] = {grade: grade, count:0};
      numberPerGrades[grade].count++;
  });
  Object.keys(numberPerGrades).forEach(function(score){
    if(min > numberPerGrades[score].count)
      min = numberPerGrades[score].count;
    if(max < numberPerGrades[score].count)
      max = numberPerGrades[score].count;
  });


  numberPerGrades = Object.keys(numberPerGrades).map(function(key){

    return numberPerGrades[key];
  });
  return {numberPerGrades: numberPerGrades, min:min, max:max, total:total};
}

var helper_GetDistributionFrom100 = function(search, collection,gradeField)
{
  var numberPerGrades = {};
  var total = 0;
  //get all grades of this year
  var studentGrades = collection.find(search);

  var min = Number.MAX_VALUE;
  var max = Number.MIN_VALUE;
  studentGrades.forEach(function(student){
      //get correct grade
      var grade = 0;


      if(student[gradeField] == "NA" || student[gradeField] == "#" || student[gradeField] == "GR") return;
      grade = parseInt(student[gradeField]/5);


      //filter out the weird numbers, check later what they mean


      if(numberPerGrades[grade] == undefined)
        numberPerGrades[grade] = {grade: grade, count:0};
      numberPerGrades[grade].count++;
  });
  Object.keys(numberPerGrades).forEach(function(score){
    if(min > numberPerGrades[score].count)
      min = numberPerGrades[score].count;
    if(max < numberPerGrades[score].count)
      max = numberPerGrades[score].count;
  });


  numberPerGrades = Object.keys(numberPerGrades).map(function(key){

    return numberPerGrades[key];
  });
  return {numberPerGrades: numberPerGrades, min:min, max:max, total:total};
}
