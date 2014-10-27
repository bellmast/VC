var canvasWidth = 800;
var canvasHeight= 700;

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
  dataLength = data.length
  questionY = 10

  paper.path("M400 500C400 350 700 650 700 500")

  for (question in data) {
    if (!data.hasOwnProperty(question)) {
        continue;
    }
    textQuestion = paper.text(10, questionY, question).attr({"font-size":16, "text-anchor":"start"})
    qBbox = textQuestion.getBBox()
    streamY = questionY + 20
    q = question
    testSet = []
    for (streamTest in data[question]) {
      testText = paper.text(10,10,streamTest).attr({"font-size":16})
      tBbox = testText.getBBox()
      testSet.push(tBbox["width"])
      testText.remove()
    }
    max_of_array = Math.max.apply(Math, testSet)
    for (stream in data[question]) {
      if (!data[question].hasOwnProperty(stream)) {
        continue;
      }
      widgetThickness = 0
      for (fact in data[question][stream]) {
        widgetThickness += 1
        factLength = data[question][stream][fact].length
        paper.path("M"+(max_of_array+40)+" "+(streamY+(widgetThickness*10))+"L"+qBbox["width"]+" "+(streamY+(widgetThickness*10))).attr({"stroke-width":factLength, "stroke-opacity":0.5})
      }
      textStream = paper.text(30, streamY+3+(widgetThickness*5), stream).attr({"font-size":16, "text-anchor":"start"})
      
      streamY += 20+(widgetThickness*10)
    }
  }
}
