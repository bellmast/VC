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
  for (question in data) {
    if (!data.hasOwnProperty(question)) {
        continue;
    }
    paper.text(10, 10, question).attr({"font-size":18, "text-anchor":"start"})
  }
}
