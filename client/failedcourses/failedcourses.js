

Template.failedCourse.onRendered(function(){
  // variables about data
  var instance = this;  
  var data = this.data;
  var courseId = data.id;
  var courseName = data.name;
  var gradeTry1 = data.try1;
  var gradeTry2 = data.try2;
  var courseCredits  = data.credits;
  var gradeStatusTry1 = status(gradeTry1);
  var gradeStatusTry2 = status(gradeTry2);
  var colorTry1 = colorOfGrade(gradeTry1);
  var colorTry2 = colorOfGrade(gradeTry2);
  var courseColor = colorCourse(gradeStatusTry1, gradeStatusTry2);


  // layout variables
  var totalWidth = window.innerWidth / 8.5;
  var totalHeight = 75;

  var nameWidthFraction = 1;
  var infoHeightFraction = 0.4;
  var tryWidthFraction = 0.3

  var infoWidth = totalWidth;
  var infoHeight = infoHeightFraction * totalHeight;

  var nameWidth = nameWidthFraction * totalWidth;
  var nameHeight = infoHeight;

  var gradeWidth = totalWidth;
  var gradeHeight = (1-infoHeightFraction) * totalHeight;

  var try1Width = tryWidthFraction * gradeWidth;
  var try1Height = gradeHeight;

  var try2Width = tryWidthFraction * gradeWidth;
  var try2Height = gradeHeight;

  var creditsWidth = (1-(2*tryWidthFraction)) * gradeWidth;  
  var creditsHeight = gradeHeight;  
  
  var radius = 0;
  var border = 2;

  var littleFont = "6px";
  var smallFont = "8px";
  var mediumFont = "10px";
  var bigFont = "12px";

  // svg variables
  var container = d3.select("#"+courseId +"_failed").append("svg");
  container
    .attr("width",totalWidth)
    .attr("height", totalHeight)
    .style("position", "relative")
    ;
  var bottomLayer = appendSvg(container, "bottomlayer", totalWidth, totalHeight, 0,0);
  var topLayer = appendSvg(container, "toplayer", totalWidth, totalHeight, 0,0);

  var svgInfo = appendSvg(bottomLayer, "info", infoWidth, infoHeight, 0,0);
  var svgName = appendSvg(svgInfo, "name", nameWidth, nameHeight, 0,0);
  
  var svgGrade = appendSvg(bottomLayer, "grade", gradeWidth, gradeHeight, 0, infoHeight);
  var svgGradeTry1 = appendSvg(svgGrade, "try1", try1Width, try1Height,0, 0);
  var svgGradeTry2 = appendSvg(svgGrade, "try2", try2Width, try2Height,try1Width, 0 );
  var svgCredits = appendSvg(svgGrade, "credits", creditsWidth, creditsHeight, (try1Width + try2Width) ,0);

  function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0, //<-- 0!
        lineHeight = 1.2, // ems
        x = text.attr("x"), //<-- include the x!
        y = text.attr("y"),
        dy = text.attr("dy") ? text.attr("dy") : 0; //<-- null check
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
  }

  // A rounded border around everything
  var borderPath = topLayer.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("rx", radius)
    .attr("height", totalHeight)
    .attr("width", totalWidth)
    .style("stroke", courseColor)
    .style("fill", "none")
    .style("stroke-width", border);

  // The course name
  svgName
    .append("text")
    .text(courseName)
      .attr("font-family", "sans-serif")
      .attr("font-size", function(){
        return smallFont;
      })
      .attr("color", "#777777")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("transform", "translate("+ 0.5*nameWidth +","+ (0.5*nameHeight) + ")")
      .style("text-overflow", "hidden")
      .call(wrap, 0.9 * nameWidth)
    ;

    
             
  //A line under the name
  var separator = topLayer.append("line")
    .attr("x1", 0)
    .attr("x2", totalWidth)
    .attr("y1", nameHeight)
    .attr("y2", nameHeight)
    .style("stroke", courseColor)
    ;

  // The rectangle where we place the grade
  svgGradeTry1
    .append("path")
      .attr("d", leftbottomRoundedRect(0,0,try1Width, try1Height, radius))
      .attr("fill", colorTry1)
    ;
  svgGradeTry2
    .append("path")
      .attr("d", rightbottomRoundedRect(0,0,try2Width, try2Height, radius))
      .attr("fill", colorTry2)
    ;
  
  svgCredits
    .append("path")
      .attr("d", rightbottomRoundedRect(0,0,creditsWidth, creditsHeight, radius))
      .attr("fill", courseColor)
    ;

  // The grade
  svgGradeTry1
    .append("text")
    .text(gradeTry1)
      .attr("font-family", "sans-serif")
      .attr("font-size", "20px")
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "central")
      .attr("transform", "translate("+ try1Width/2.0 +","+ try1Height/2.0 + ")")
    ;

  svgGradeTry2
    .append("text")
    .text(gradeTry2)
      .attr("font-family", "sans-serif")
      .attr("font-size", "20px")
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "central")
      .attr("transform", "translate("+ try1Width/2.0 +","+ try1Height/2.00 + ")")
    ;

    // The credits of the course
  svgCredits
    .append("text")
    .text(formattedCredits(courseCredits))
      .attr("font-family", "sans-serif")
      .attr("font-size", "15px")
      .style("fill", "#ffffff")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "central")
      .attr("transform", "translate("+ creditsWidth/2.0 +","+ creditsHeight/2.0 + ")")
  
  
  
  

  function status(grade){
    if(grade < 8)
    {
      return "failed";
    }
    else if(grade > 9)
    {
      return "passed";
    }
    else if(grade >= 8 && grade <= 9){
      return "tolerable";
    }
    else {
      return "failed";
    }
  };

  function formattedCredits(credits){
    if(credits != 0)
      return "["+credits +"stp]";
    return "";
  }
  
  function colorOfGrade(grade){
    var color = "#777777";
    if(grade < 8)
    {
      color = "#FD6869";
    }
    else if(grade > 9)
    {
      color = "#A5DC89";
    }
    else if(grade >= 8 && grade <= 9){
      color =  "#E1B32D";
    }
    else {
      color =  "#FD6869";
    }
    return color;
  }

  function colorCourse(status1, status2){
    var color = "#777777";
    if (status1 === "passed" || status2 === "passed"){
      color = "#A5DC89";
    }
    else if (status1 === "tolerable" || status2 === "tolerable"){
      color =  "#E1B32D";
    }
    else{
      color = "#FD6869";
    }

    return color;
  }

  function leftbottomRoundedRect(x, y, width, height, radius) {
    return "M" + x + "," + y
       + "h" + width
       + "v" + height
       + "h" + (radius - width)
       + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + -radius
       + "z";
  }

  function rightbottomRoundedRect(x, y, width, height, radius) {
    return "M" + x + "," + y
       + "h" + width
       + "v" + (height-radius)
       + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
       + "h" + (radius - width)
       + "z";
  }

  function appendSvg(parent, svgClass, width, height, x, y ){
    var svg = parent.append("svg")
    svg
      .attr("class", svgClass)
      .attr("width", width)
      .attr("height", height)
      .attr("x", x)
      .attr("y", y)
      ;
    return svg;
  }

  function zoom(instance, scale, click){
    if (clicked || scale === 1){
      instance
        .style("transform" , "scale(1,1)")
        .style("background", "none")
        .style("z-index", "auto")
        .style("box-shadow", "none")
        ;
      if (click){
        clicked = false;
      }
    }
    else{
      instance
        .style("transform" , "scale(" + scale + "," + scale )
        .style("background", "white")
        .style("z-index", Number.MAX_SAFE_INTEGER)
        .style("box-shadow", "5px 5px 5px #888888")
        ;
      if (click){
        clicked = true;
      }    
    }
  }

  var clicked = false;
  container.on("mouseover", function(){
    if (clicked === false){
      zoom(d3.select(this), 1.5, false);
    }
    
  })
  container.on("mouseout", function(){
    if (clicked === false){
      zoom(d3.select(this), 1, false);
    }
  }) 



});