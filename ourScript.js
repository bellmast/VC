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
      widgetThickness = 0
      textStream = paper.text(30, streamY+(widgetThickness*10), stream).attr({"font-size":16, "text-anchor":"start"})
      sBbox = textStream.getBBox()
      for (fact in data[question][stream]) {
        widgetThickness += 1
        paper.path("M"+(sBbox["width"]+40)+" "+(streamY+(widgetThickness*10))+"L"+qBbox["width"]+" "+(streamY+(widgetThickness*10))).attr({"stroke":"black", stroke-opacity":.8})
      }
      textStream.remove()
      textStream = paper.text(30, streamY+(widgetThickness*5), stream).attr({"font-size":16, "text-anchor":"start"})
      
      streamY += 20+(widgetThickness*10)
    }
  }
}
