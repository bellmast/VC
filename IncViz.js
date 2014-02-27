var totalxCoords;
var totalyCoords;
var paper;
var canvasWidth = 800;
var canvasHeight= 700;
var padding = 10;
var orgNumber = 4;
var ourRadius = 1;
var FTcount = 0;
var oneMCcount = 0;
var arrowRadius = 5;

//Credit for arrow function [this version slightly adapted]: https://gist.github.com/viking/1043360
Raphael.fn.arrow = function(x1, y1, x2, y2, size) {
  var angle = Raphael.angle(x1, y1, x2, y2);
  var a45   = Raphael.rad(angle-45);
  var a45m  = Raphael.rad(angle+45);
  var a135  = Raphael.rad(angle-135);
  var a135m = Raphael.rad(angle+135);
  var x1a = x1 + Math.cos(a135) * size;
  var y1a = y1 + Math.sin(a135) * size;
  var x1b = x1 + Math.cos(a135m) * size;
  var y1b = y1 + Math.sin(a135m) * size;
  var x2a = x2 + Math.cos(a45) * size;
  var y2a = y2 + Math.sin(a45) * size;
  var x2b = x2 + Math.cos(a45m) * size;
  var y2b = y2 + Math.sin(a45m) * size;
  return this.path(
    "M"+x1+" "+y1+"L"+x1a+" "+y1a+
    "M"+x1+" "+y1+"L"+x1b+" "+y1b
  );
};

$(document).ready(function () {runProgram()});

function runProgram() {
    paper = new Raphael(document.getElementById('canvas_container'), canvasWidth, canvasHeight);  
    jQuery.getJSON("IncData.js", function (data)
    {drawNetwork(data)});       
}  

function drawNetwork(data) {

    orgXcoords = []
    orgRadii = []
    orgSet = paper.set();
    textSet = paper.set();
    sCorpLineSet = paper.set();
    arrowSet = paper.set();
    lineSet = paper.set();
    circlesSet = paper.set();
    orgColors = ["#03899C", "#1240AB", "#FFAA00", "#FF7A00"]
    orgNames = ["S-corp", "LLC", "C-Corp", "Other"]
    orgTotals = [238, 149, 74, 6]
    
    slots = canvasWidth/(orgNumber+1)
    midY = canvasHeight/2

    for(i = 1; i < orgNumber+1; i++) {
        xPos = slots*i
        orgXcoords.push(xPos)
        radius = Math.log(orgTotals[i-1])*10
        orgRadii.push(radius)
        orgSet.push(paper.circle(xPos, midY, radius).attr({stroke:0}).glow({width:3, color:orgColors[i-1]}))
        textSet.push(paper.text(xPos, midY+radius+10, orgNames[i-1]))
    }




    dataLength = data.length
    
    posConcatArray = []
    orgCount = [0, 0, 0, 0]
    orgCountBot = [0, 0, 0, 0]
    startingPosConcat = undefined
    testArray = []
    for(i=0; i < orgNumber; i++) {
        if(i!=3) {
        masterxArray = []
        masteryArray = []
        masterCirclePacking = 0
        masterCirclePackingArray = []
        circlesInLayer = 6
        layerArray = []
        counterArray = []
        circlesInLayerArray = []
        ourArray = []
        ourArray2 = []
        radiiArray = []
        }
        for(u=0; u < data.length; u++) {
            origin = data[u][0]
            change = data[u][1]
            if(change=="No" && origin == i && origin!=3) {
                originX = orgXcoords[i]
                originY = midY
                masterLength = masterxArray.length

                for (x = 0; x < masterLength; x++) {
                    if (originX == masterxArray[x] && originY == masteryArray[x]) {
                        
                        masterCirclePacking += 1

                        counter = Math.floor((masterCirclePacking-1)/circlesInLayer)+1

                        if(counter == 2) {
                            circlesInLayer += 6+masterCirclePacking
                        }
                        
                        layer = circlesInLayer/6

                        radiusModifier = Math.floor((masterCirclePacking-1)/6)*.5+1
                        radiiArray.push(radiusModifier)

                        counterArray.push(counter)
                        layerArray.push(layer)
                        circlesInLayerArray.push(circlesInLayer)

                        degreesInLayer = 360/circlesInLayer

                        originX += ((ourRadius*radiusModifier*2)*Math.cos((Math.PI/180)*(degreesInLayer*(masterCirclePacking%circlesInLayer))))
                        originY += ((ourRadius*radiusModifier*2)*Math.sin((Math.PI/180)*(degreesInLayer*(masterCirclePacking%circlesInLayer))))

                        masterCirclePackingArray.push(masterCirclePacking)

                        
                        
                    }
                }
                masterxArray.push(originX)
                masteryArray.push(originY)
                
                circlesSet.push(paper.circle(originX, originY, ourRadius).attr({fill:orgColors[i], "stroke-width":.05})).toBack()
            }
        }
        for(h=i+1; h < orgNumber; h++) {

            if(h==orgNumber-1) {
                endingPiMod = orgCount[h]+2
            } else {
                endingPiMod = (-orgCount[h]+4)
            }
            if(i==orgNumber-2) {
                startingPiMod = (-orgCount[i]+4)
            } else {
                startingPiMod = orgCount[i]+2
            }

            if(i==0) {
                startingPosX = orgXcoords[i]
                startingPosY = midY-orgRadii[i]
            } else {
                startingPosX = orgXcoords[i]+((orgRadii[i])*Math.sin(((startingPiMod)*2*Math.PI)/6))
                startingPosY = midY+((orgRadii[i])*Math.cos(((startingPiMod)*2*Math.PI)/6))
            }
            endingPosX = orgXcoords[h]+((orgRadii[h])*Math.sin(((endingPiMod)*2*Math.PI)/6))
            endingPosY = midY+((orgRadii[h])*Math.cos(((endingPiMod)*2*Math.PI)/6))
            orgCount[h] += 1

            curvePosX = (startingPosX+endingPosX)/2
            curvePosY = (midY-(midY/5/h))/((h/(i+1)))-(10*h)
            lineSet.push(paper.path("M"+startingPosX+" "+startingPosY+"Q"+curvePosX+" "+curvePosY+" "+endingPosX+" "+endingPosY).attr({"stroke-width": ".5", "stroke":orgColors[i]}))

            paper.arrow(endingPosX, endingPosY, curvePosX, curvePosY, arrowRadius).attr({fill:orgColors[i], stroke:orgColors[i]})

            i2 = -i+orgNumber-1
            h2 = -h+orgNumber-1

            if(h2==0) {
                endingPiMod = orgCountBot[h2]-1
            } else {
                endingPiMod = (-orgCountBot[h2]+1)
            }
            if(i2==1) {
                startingPiMod = (-orgCountBot[i2]+1)
            } else {
                startingPiMod = orgCountBot[i2]-1
            }

            if(i2==3) {
                startingPosX = orgXcoords[i2]
                startingPosY = midY+orgRadii[i2]
            } else {
                startingPosX = orgXcoords[i2]+((orgRadii[i2])*Math.sin(((startingPiMod)*2*Math.PI)/8))
                startingPosY = midY+((orgRadii[i2])*Math.cos(((startingPiMod)*2*Math.PI)/8))
            }
            endingPosX = orgXcoords[h2]+((orgRadii[h2])*Math.sin(((endingPiMod)*2*Math.PI)/8))
            endingPosY = midY+((orgRadii[h2])*Math.cos(((endingPiMod)*2*Math.PI)/8)) //gotta make this backwards
            orgCountBot[h2] += 1
            
            curvePosX = (startingPosX+endingPosX)/2
            curvePosY = Math.abs(((midY-(midY/5/h))/((h/(i+1)))-(10*h))-canvasHeight) //may need to alter to h2s and i2s

            lineSet.push(paper.path("M"+startingPosX+" "+startingPosY+"Q"+curvePosX+" "+curvePosY+" "+endingPosX+" "+endingPosY).attr({"stroke-width": ".5", "stroke":orgColors[i2]}))    

            paper.arrow(endingPosX, endingPosY, curvePosX, curvePosY, arrowRadius).attr({fill:orgColors[i2], stroke:orgColors[i2]})

        }        
    }

}
