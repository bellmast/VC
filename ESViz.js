var earliestYear = 2008
var latestYear = 2013 //or lastrow if the data are organized
var yearAxis = earliestYear - latestYear
var programAxis = 3 //KDFP, KJFF, KPrize
//this gives us the dimensions of the "graph"
var canvasWidth = 800;
var canvasHeight= 700;
//beforehand, please organize data by year, then by impact score
//it will also save computing power to pre-calculate 

$(document).ready(function () {runProgram()});

function runProgram() {
    paper = new Raphael(document.getElementById('canvas_container'), canvasWidth, canvasHeight);  
    jQuery.getJSON("ESData.js", function (data)
    {drawNetwork(data)});       
}  

function drawNetwork(data) {

	textSet = paper.set()

	KJFFheight = canvasHeight/2
	KPrizeheight = KJFFheight+(1/2)KJFFheight
	KDFPheight = KJFFheight-(1/2)KJFFheight

	textSet.push(paper.text(50, KJFFheight, "KJFF"))
	textSet.push(paper.text(50, KPrizeheight, "KPrize"))
	textSet.push(paper.text(50, KDFPheight, "KDFP"))

	slots = canvasWidth/(yearAxis+1)
	yearXcoords = []

	for(i = 1; i < yearAxis+1; i++) {
        xPos = slots*i
        yearXcoords.push(xPos)
        textSet.push(paper.text(xPos, canvasHeight-50, earliestYear+i-1))
    }
  
}


//1) determine size of each year's encompassing circle




//2) Lookat each scholar
///a) place in appropriate encompassing circle; place in proper spiral order by impact score
///b) set circle size by impact score
///c) arrange unaffiliated coauthors as orbitals
///d) draw connections to affiliated coauthors if they've been drawn yet; count & hide out-of-eCircle connections

///3) Lookat the count of out-of-eCircle connections, draw them with appropriate thickness
