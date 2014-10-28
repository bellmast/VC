var canvasWidth = 800;
var canvasHeight= 700;
var maxWidth = 80;
var indent = 50;
var arrayOfSets = [];



function makeCurlyBrace(x1,y1,x2,y2,w,q) // Massive, massive credit due: https://gist.github.com/alexhornbake/6005176
    {
      //Calculate unit vector
      var dx = x1-x2;
      var dy = y1-y2;
      var len = Math.sqrt(dx*dx + dy*dy);
      dx = dx / len;
      dy = dy / len;
 
      //Calculate Control Points of path,
      var qx1 = x1 + q*w*dy;
      var qy1 = y1 - q*w*dx;
      var qx2 = (x1 - .25*len*dx) + (1-q)*w*dy;
      var qy2 = (y1 - .25*len*dy) - (1-q)*w*dx;
      var tx1 = (x1 -  .5*len*dx) + w*dy;
      var ty1 = (y1 -  .5*len*dy) - w*dx;
      var qx3 = x2 + q*w*dy;
      var qy3 = y2 - q*w*dx;
      var qx4 = (x1 - .75*len*dx) + (1-q)*w*dy;
      var qy4 = (y1 - .75*len*dy) - (1-q)*w*dx;
 
      return ( "M " +  x1 + " " +  y1 +
            " Q " + qx1 + " " + qy1 + " " + qx2 + " " + qy2 + 
              " T " + tx1 + " " + ty1 +
              " M " +  x2 + " " +  y2 +
              " Q " + qx3 + " " + qy3 + " " + qx4 + " " + qy4 + 
              " T " + tx1 + " " + ty1 );
    }

function getHoverHandler(strokeOpacity, ourSet) {
         var cSet = ourSet;
         
         return function(){
              cSet.animate({"stroke-opacity": strokeOpacity}, 300);
          };
    }

function textHoverHandler(fontWeight, ourText, speed) {
         var cText = ourText;
         
         return function(){
              cText.animate({"font-size": fontWeight}, speed);
          };
    }

function clickHandler(ourSet, ourBrace, ourText) {
         var newSet = paper.set()
         for (item in ourSet) {
          newSet.push(item)
         }
         console.log(newSet)
         console.log(factSet)
         console.log(ourSet)
         var newBrace = ourBrace
         var newText = ourText


    
         var isClicked = false
         return function(){
          var setLength = newSet.length
          var yTransform = setLength*17
          if (isClicked == false) {
            newBrace.animate({transform:"s1 1.5"}, 500, "<>")
            newSet.forEach(function(e) {
              e.animate({transform:"t1 17s1.5 1"}, 500, "<>")
            })
            var textMove = 50
            newText.animate({transform:"t1 "+yTransform}, 500, "<>")
          }
          else if (isClicked == true) {
            newBrace.animate({transform:"s1 1"}, 500, "<>")
            newSet.forEach(function(e) {
              e.animate({transform:"t1 1s1 1"}, 500, "<>")
            })
            newText.animate({transform:"t1 1"}, 500, "<>")
          }
          isClicked = isClicked == false ? true : false
         }
}



$(document).ready( function() {
    runProgram()
});




/**************************************************************/
/* Prepares the cv to be dynamically expandable/collapsible   */
/**************************************************************/
function runProgram() {
    paper = new Raphael(document.getElementById('canvas_container'), canvasWidth+60, canvasHeight);  
    jQuery.getJSON("sotfTestData.js", function (data)
    {drawList(data)});
};

function drawList(data) {
  controllers = paper.set();
  setOfFactSets = paper.set();

  dataLength = data.length
  questionY = 10

  for (question in data) {
    if (!data.hasOwnProperty(question)) {
        continue;
    }
    textQuestion = paper.text(10, questionY, question).attr({"font-size":16, "text-anchor":"start"})
    qBbox = textQuestion.getBBox()
    streamY = questionY + 20
    q = question

    for (stream in data[question]) {
      if (!data[question].hasOwnProperty(stream)) {
        continue;
      }
      factSet = paper.set()
      factSet2 = paper.set()
      widgetThickness = 0
      for (fact in data[question][stream]) {
        widgetThickness += 1
        factLength = data[question][stream][fact].length
        newFact = paper.path("M"+(indent+maxWidth+6)+" "+(streamY+(widgetThickness*10))+"L"+qBbox["width"]+" "+(streamY+(widgetThickness*10))).attr({"stroke-width":factLength, "fill":"black", "stroke-opacity":0.3})
        factSet.push(newFact)
        newFact = paper.path("M"+(indent+maxWidth+6)+" "+(streamY+(widgetThickness*10))+"L"+qBbox["width"]+" "+(streamY+(widgetThickness*10))).attr({"stroke-width":factLength, "stroke-opacity":1})
        newFact.hide()
        factSet2.push(newFact)
      }
      arrayOfSets.push(factSet)
      setOfFactSets.push(factSet2)
      var words = stream.split(" ");
      var tempText = "";
      var t = paper.text(indent, streamY+3+(widgetThickness*5)).attr({"font-size":16, "text-anchor":"start"})
      for (var i=0; i<words.length; i++) {
        t.attr("text", tempText + " " + words[i]);
        if (t.getBBox().width > maxWidth) {
          tempText += "\n" + words[i];
        } else {
          tempText += " " + words[i];
        }
      }
      t.attr("text", tempText.substring(1));
      arrayOfSets.push(t)
      if (widgetThickness > 1) {
        ourPath = makeCurlyBrace((indent+maxWidth+6), streamY+4, (indent+maxWidth+6), (streamY+5+(widgetThickness*10)), 25, .5)
        streamBrace = paper.path(ourPath).attr({"stroke-opacity":0.3, "stroke-width":widgetThickness/2})
        factSet.push(streamBrace)
      }
      else {
        ourPath = makeCurlyBrace((indent+maxWidth+6), streamY+4, (indent+maxWidth+6), (streamY+5+(widgetThickness*10)), 0, .5)
        streamBrace = paper.path(ourPath).attr({"stroke-opacity":0.3, "stroke-width":widgetThickness/2})
        streamBrace.hide()
        factSet.push(streamBrace)
      }
      controllerBox = paper.rect((indent), streamY, (qBbox["width"]-(indent+maxWidth+6-25)), ((streamY+5+(widgetThickness*10))-streamY+2)).attr({"stroke-width":0})
      controllerBox.attr({stroke: "none", fill: "#f00", "fill-opacity": 0})
      controllerBox.hover(getHoverHandler(1, factSet),
                          getHoverHandler(.3, factSet));
      controllerBox.hover(textHoverHandler(18, t, 100),
                          textHoverHandler(16, t, 150));
      factSet.pop()
      controllerBox.click(clickHandler(factSet, streamBrace, t))
      streamY += 20+(widgetThickness*10)
    }
  }
}
