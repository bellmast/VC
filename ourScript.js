var canvasWidth = 800;
var canvasHeight= 700;
var maxWidth = 80;
var maxWidth2 = 570
var indent = 50;
var ourStack = [];
var ourStackArray = [];
var globalY = 0



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

function clickHandler(ourFirstFact, ourSet, ourBrace, ourText, ourText2, ourFirstFactText) {
         var newSet = ourSet
         var newBrace = ourBrace
         var newText = ourText
         var newFirstFact = ourFirstFact
         var newFactText = ourText2
         var newFirstFactText = ourFirstFactText

         var isClicked = false
         return function(){
          var setLength = newSet.length
          var localTransform = setLength!=0 ? (setLength-2)*17 : 0
          var stackBelowTransform = (localTransform*2)
          var cStackIndex = ourStack.indexOf(this)

          if (isClicked == false) {
            for (var i = 0; i < ourStack.length; i++) {
              if (i > cStackIndex) {
                ourStackArray[i] +=  stackBelowTransform
                ourStack[i].animate({transform:"t1 "+ourStackArray[i]}, 500, "<>")
              }
            }
            newFirstFact.animate({transform:"t1 "+ourStackArray[cStackIndex]}, 500, "<>")
            newFirstFact.animate({opacity: 0}, 1000, "<>")
            newFirstFactText.animate({transform:"t1 "+ourStackArray[cStackIndex]}, 500, "<>")
            newFirstFactText.animate({opacity: 1}, 1000, "<>")
            var k = 17
            var h = 17
            newSet.forEach(function(e) {
              e.animate({transform:"t1 "+(k+ourStackArray[cStackIndex])}, 500, "<>")
              e.animate({opacity: 0}, 1000, "<>")
              k += 17
            })
            newFactText.forEach(function(e) {
              e.animate({transform:"t1 "+(h+ourStackArray[cStackIndex])}, 500, "<>")
              e.animate({opacity: 1}, 1000, "<>")
              h += 17
            })
            var newDistance = (streamBottomY - streamTopY + k) / 2
            var oldDistance = (streamBottomY - streamTopY) / 2
            var sTransform = newDistance/oldDistance
            localTransform += ourStackArray[cStackIndex]
            newBrace.animate({transform:"t1 "+localTransform+"s1 "+sTransform}, 500, "<>")
            newText.animate({transform:"t1 "+localTransform}, 500, "<>")
            this.animate({transform:"t1 "+localTransform+"s1 "+sTransform}, 500, "<>")
            ourStackArray[cStackIndex] = localTransform
            ourStackArray[cStackIndex-1] = localTransform
            ourStackArray[cStackIndex-2] = localTransform
            ourStackArray[cStackIndex-3] = localTransform
            ourStackArray[cStackIndex-4] = localTransform
            ourStackArray[cStackIndex-5] = localTransform
            ourStackArray[cStackIndex-6] = localTransform
            console.log(ourStackArray)
          }
          else if (isClicked == true) {
            for (var i = 0; i < ourStack.length; i++) {
              
              if (i > cStackIndex) {
                ourStackArray[i] -=  stackBelowTransform
                ourStack[i].animate({transform:"t1 "+ourStackArray[i]}, 500, "<>")
              }
            }
            ourStackArray[cStackIndex] -= localTransform
            ourStackArray[cStackIndex-1] -= localTransform
            ourStackArray[cStackIndex-2] -= localTransform
            ourStackArray[cStackIndex-3] -= localTransform
            ourStackArray[cStackIndex-4] -= localTransform
            ourStackArray[cStackIndex-5] = localTransform
            ourStackArray[cStackIndex-6] = localTransform
            localTransform = ourStackArray[cStackIndex]
            newFirstFact.animate({transform:"t1 "+localTransform}, 500, "<>")
            newFirstFact.animate({opacity: 1}, 1000, "<>")
            newFirstFactText.animate({transform:"t1 "+localTransform}, 500, "<>")
            newFirstFactText.animate({opacity: 0}, 1000, "<>")         
            newBrace.animate({transform:"t1 "+localTransform+"s1 1"}, 500, "<>")
            newSet.forEach(function(e) {
              e.animate({transform:"t1 "+localTransform, opacity: 1}, 500, "<>")
              e.animate({opacity: 1}, 1000, "<>")
            })
            newFactText.forEach(function(e) {
              e.animate({transform:"t1 "+localTransform, opacity: 0}, 500, "<>")
              e.animate({opacity: 0}, 1000, "<>")
            })
            newText.animate({transform:"t1 "+localTransform}, 500, "<>")
            this.animate({transform:"t1 "+localTransform+"s1 1"}, 500, "<>")
            console.log(ourStackArray)
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
    ourStack.push(textQuestion)
    ourStackArray.push(0)
    qBbox = textQuestion.getBBox()
    streamY = questionY + 20
    q = question

    for (stream in data[question]) {
      if (!data[question].hasOwnProperty(stream)) {
        continue;
      }
      factSet = paper.set()
      factSet2 = paper.set()
      factTextSet = paper.set()

      widgetThickness = 0
      for (fact in data[question][stream]) {
        widgetThickness += 1
        factLength = data[question][stream][fact].length
        newFact = paper.path("M"+(indent+maxWidth+6)+" "+(streamY+(widgetThickness*10))+"L"+qBbox["width"]+" "+(streamY+(widgetThickness*10))).attr({"stroke-width":factLength, "fill":"black", "stroke-opacity":0.3})
        factSet.push(newFact)
        var t = paper.text(indent+maxWidth+6, streamY+(widgetThickness*10)).attr({"font-size":16, "text-anchor":"start", opacity: 0})
        t.attr("text", widgetThickness+".&nbsp"+fact);
        
        
        //var words = fact.split(" ");
        //var tempText = "";
        //var t = paper.text(indent+maxWidth+6, streamY+(widgetThickness*10)).attr({"font-size":16, "text-anchor":"start"})
        //for (var i=0; i<words.length; i++) {
        //  t.attr("text", tempText + " " + words[i]);
        //  if (t.getBBox().width > maxWidth2) {
        //    tempText += "\n" + words[i];
        //  } else {
        //    tempText += " " + words[i];
        //  }
        //}
        //t.attr("text", tempText.substring(1));
        if (widgetThickness != 1) {
          factSet2.push(newFact)
          factTextSet.push(t)
        } else {
          firstFact = newFact
          firstFactText = t
          ourStack.push(firstFactText)
          ourStack.push(0)
          ourStack.push(firstFact)
          ourStackArray.push(0)
        }
      }
      ourStack.push(factSet)
      ourStack.push(factTextSet)
      ourStackArray.push(0)
      ourStackArray.push(0)
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
      ourStack.push(t)
      ourStackArray.push(0)
      if (widgetThickness > 1) {
        streamTopX = (indent+maxWidth+6)
        streamTopY = streamY+4
        streamBottomX = (indent+maxWidth+6)
        streamBottomY = (streamY+5+(widgetThickness*10))
        ourPath = makeCurlyBrace(streamTopX, streamTopY, streamBottomX, streamBottomY, 25, .5)
        streamBrace = paper.path(ourPath).attr({"stroke-opacity":0.3, "stroke-width":widgetThickness/2})
        factSet.push(streamBrace)
      }
      else {
        ourPath = makeCurlyBrace((indent+maxWidth+6), streamY+4, (indent+maxWidth+6), (streamY+5+(widgetThickness*10)), 0, .5)
        streamBrace = paper.path(ourPath).attr({"stroke-opacity":0.3, "stroke-width":widgetThickness/2})
        streamBrace.hide()
        factSet.push(streamBrace)
      }
      ourStack.push(streamBrace)
      ourStackArray.push(0)
      controllerBox = paper.rect((indent), streamY, (qBbox["width"]-(indent+maxWidth+6-25)), ((streamY+5+(widgetThickness*10))-streamY+2)).attr({"stroke-width":0})
      controllerBox.attr({stroke: "none", fill: "#f00", "fill-opacity": 0})
      ourStack.push(controllerBox)
      ourStackArray.push(0)
      controllerBox.hover(getHoverHandler(1, factSet),
                          getHoverHandler(.3, factSet));
      controllerBox.hover(textHoverHandler(18, t, 100),
                          textHoverHandler(16, t, 150));
      controllerBox.click(clickHandler(firstFact, factSet2, streamBrace, t, factTextSet, firstFactText))
      streamY += 20+(widgetThickness*10)
    }
  }
  console.log(ourStackArray)
}
