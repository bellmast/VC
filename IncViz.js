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
    endingPosConcatArray = []
    for(i=0; i < orgNumber; i++) {
        for(h=i+1; h < orgNumber; h++) {
            startingPosX = orgXcoords[i]
            startingPosY = midY-orgRadii[i]
            endingPosX = orgXcoords[h]
            endingPosY = midY-orgRadii[h]
            endingPosConcat = endingPosX+endingPosY
            if($.inArray(endingPosConcat, endingPosConcatArray) != -1) {
                endingPosX = orgXcoords[h]+((orgRadii[h])*Math.sin((Math.PI/180)*(60*i))) //radius modified
                endingPosY = midY+((orgRadii[h])*Math.cos((Math.PI/180)*(60*i))) //radius modified
            }
            endingPosConcatArray.push(endingPosConcat)   
            curvePosX = (startingPosX+endingPosX)/2
            curvePosY = (midY-(midY/5/h))/((h/(i+1)))-(10*h)
            lineSet.push(paper.path("M"+startingPosX+" "+startingPosY+"Q"+curvePosX+" "+curvePosY+" "+endingPosX+" "+endingPosY).attr({"stroke-width": ".5", "stroke":orgColors[i]}))
            
            startingPosX = orgXcoords[i] //radius modified
            startingPosY = midY+orgRadii[i] //radius modified
            endingPosX = orgXcoords[h]
            curvePosX = (startingPosX+endingPosX)/2
            endingPosY = midY+orgRadii[h]
            curvePosY = Math.abs(((midY-(midY/5/h))/((h/(i+1)))-(10*h))-canvasHeight)
            lineSet.push(paper.path("M"+startingPosX+" "+startingPosY+"Q"+curvePosX+" "+curvePosY+" "+endingPosX+" "+endingPosY).attr({"stroke-width": ".5", "stroke":orgColors[h]}))    


        }        
    }
}
