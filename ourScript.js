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

  paper.path("M 177 430 5 0 c 6 0 10 0 14 -1 4 -1 8 -4 11 -8 3 -4 4 -8 5 -13 1 -5 1 -14 1 -26 0 -9 0 -15 1 -20 1 -5 3 -10 6 -13 3 -3 7 -5 13 -5L 0 -16 c -6 0 -10 -2 -13 -5 -3 -3 -5 -8 -6 -13 -1 -5 -1 -11 -1 -20 0 -12 0 -21 -1 -26 -1 -5 -2 -9 -5 -13 -3 -4 -7 -7 -11 -8 -4 -1 -8 -1 -14 -1L -5 0 0 15 3 0 c 7 0 11 1 13 3 3 3 4 4 4 7L 0 25 c 0 15 2 25 5 31 3 6 9 10 15 13 -6 3 -12 7 -15 13 -3 6 -5 16 -5 31L 0 25 c 0 3 -1 4 -4 7 -2 2 -6 3 -13 3L -3 0 0 15Z")

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
