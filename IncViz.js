var totalxCoords;
var totalyCoords;
var paper;
var canvasWidth = 800;
var canvasHeight= 700;
var padding = 10;
var orgNumber = 4;
var ourRadius = 5;
var FTcount = 0;
var oneMCcount = 0;

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
    lineSet = paper.set();
    orgColors = ["#03899C", "#1240AB", "#FFAA00", "#FF7A00"]
    orgNames = ["S-corp", "C-corp", "LLC", "Other"]
    
    slots = canvasWidth/(orgNumber+1)
    midY = canvasHeight/2

    for(i = 1; i < orgNumber+1; i++) {
        xPos = slots*i
        orgXcoords.push(xPos)
        radius = data[0][i-1]*2.75
        orgRadii.push(radius)
        orgSet.push(paper.circle(xPos, midY, radius).attr({stroke:0}).glow({width:3, color:orgColors[i-1]}))
        textSet.push(paper.text(xPos, midY+radius+10, orgNames[i-1]))
    }
    posConcatArray = []
    orgCount = [0, 0, 0, 0]
    orgCountBot = [0, 0, 0, 0]
    startingPosConcat = undefined
    testArray = []
    for(i=0; i < orgNumber; i++) {
        for(h=i+1; h < orgNumber; h++) {

            if(h==orgNumber-1 && i!=orgNumber-2){
                startingPiMod = orgCount[i]+2
                endingPiMod = orgCount[h]+2
            } else {
                startingPiMod = (-orgCount[i]+4)
                endingPiMod = (-orgCount[h]+4)
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


            i2 = -i+orgNumber-1
            h2 = -h+orgNumber-1

            if(i2==3) {
                startingPosX = orgXcoords[i2]
                startingPosY = midY+orgRadii[i2]
            } else {
                startingPosX = orgXcoords[i2]+((orgRadii[i2])*Math.sin(((-orgCountBot[i2]+1)*2*Math.PI)/6))
                startingPosY = midY+((orgRadii[i2])*Math.cos(((-orgCountBot[i2]+1)*2*Math.PI)/6))
            }
            endingPosX = orgXcoords[h2]+((orgRadii[h2])*Math.sin(((-orgCountBot[h2]+1)*2*Math.PI)/6))
            endingPosY = midY+((orgRadii[h2])*Math.cos(((-orgCountBot[h2]+1)*2*Math.PI)/6)) //gotta make this backwards
            orgCountBot[h2] += 1
            
            curvePosX = (startingPosX+endingPosX)/2
            curvePosY = Math.abs(((midY-(midY/5/h))/((h/(i+1)))-(10*h))-canvasHeight) //may need to alter to h2s and i2s

            lineSet.push(paper.path("M"+startingPosX+" "+startingPosY+"Q"+curvePosX+" "+curvePosY+" "+endingPosX+" "+endingPosY).attr({"stroke-width": ".5", "stroke":orgColors[i2]}))    


        }        
    }
}
