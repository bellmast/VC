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
    streamY = questionY + 7
    q = question
    for (stream in question) {
      if (!question.hasOwnProperty(stream)) {
        continue;
      }
      paper.text(17, streamY, stream).attr({"font-size":16, "text-anchor":"start"})
      streamY += 7
    }
  }
}
