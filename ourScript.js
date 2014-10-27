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
    paper.text(10, questionY, question).attr({"font-size":16, "text-anchor":"start"})
    streamY = questionY + 20
    q = question
    for (stream in data[question]) {
      if (!data[question].hasOwnProperty(stream)) {
        continue;
      }
      widgetThickness = 0
      for (fact in data[question][stream]) {
        widgetThickness += 1
        paper.path("M60"+(streamY+(widgetThickness*10))+"L200"+(streamY+(widgetThickness*10)))
      }
      paper.text(30, streamY+(widgetThickness*10), stream).attr({"font-size":16, "text-anchor":"start"})
      streamY += 20
    }
  }
}
