var earliestYear = 2003
var latestYear = 2014 //or lastrow if the data are organized
var yearAxis = latestYear - earliestYear
var programAxis = 3 //KDFP, KJFF, KPrize
//this gives us the dimensions of the "graph"
var canvasWidth = 1370;
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
	scholarSet = paper.set()
	linesSet = paper.set()

	KJFFheight = canvasHeight/2
	KPrizeheight = KJFFheight-((1/2)*KJFFheight)
	KDFPheight = KJFFheight+((1/2)*KJFFheight)

	textSet.push(paper.text(50, KJFFheight, "KJFF"))
	textSet.push(paper.text(50, KPrizeheight, "KPrize"))
	textSet.push(paper.text(50, KDFPheight, "KDFP"))

	slots = canvasWidth/(yearAxis+1)
	yearXcoords = []
	KJFFcounts = []
	KJFFscaleTracker = []
	KDFPcounts = []
	KDFPscaleTracker = []

	years = []

	for(i = 1; i < yearAxis+1; i++) {
        xPos = slots*i
        yearXcoords.push(xPos)
        textSet.push(paper.text(xPos, canvasHeight-50, earliestYear+i-1))
        years.push(earliestYear+i-1)
        KJFFcounts.push(0)
        KJFFscaleTracker.push(0)
        KDFPcounts.push(0)
        KDFPscaleTracker.push(0)
    }

    ////

    dataLength = data.length
    dataRowLength = data[0].length


    scholarDict = {}
    areWeHeres = 0
    newDict = []
    newDict2 = []

    for(i=0; i < data.length; i++) {
    	if(data[i][1] != '') {
    		areWeHeres += 1
    		newDict.push(data[i])
    		
    	} else if(data[i][2] != '') {
    		currentYear = data[i][2]
    		KJFFcounts[currentYear - earliestYear] += 1
    		areWeHere = "yesssss"
    	} else if(data[i][3] != '') {
    		currentYear = data[i][3]
    		KDFPcounts[currentYear - earliestYear] += 1
    	}

    }
    KJFFcountsMobile = KJFFcounts
    KDFPcountsMobile = KDFPcounts

    for(i=0; i < data.length; i++) {
    	
    	currentName = data[i][0]
    	scale = data[i][4]

    	if(data[i][1] != '') {
    		currentYear = data[i][1]
    		currentProgram = "KPrize"
    		marker = currentYear - earliestYear
    		yPos = KPrizeheight
    	} else if(data[i][2] != '') {
    		currentYear = data[i][2]
    		currentProgram = "KJFF"
    		yPos = KJFFheight
    		marker = currentYear - earliestYear
    		qMax = KJFFcounts[marker]
    		q = qMax - KJFFcountsMobile[marker]
    		KJFFcountsMobile[marker] -= 1
    		KJFFscaleTracker[marker] += scale
    	} else if(data[i][3] != '') {
    		currentYear = data[i][3]
    		currentProgram = "KDFP"
    		yPos = KDFPheight
    		marker = currentYear - earliestYear
    		qMax = KDFPcounts[marker]
    		q = qMax - KDFPcountsMobile[marker]
    		KDFPcountsMobile[marker] -= 1
    		KDFPscaleTracker[marker] += scale
    	}
    	
    	xPos = yearXcoords[marker]



    	if(currentProgram != "KPrize") {
    		var radiix = 3*Math.cos(2*Math.PI/qMax*q)
    		var radiiy = 3*Math.sin(2*Math.PI/qMax*q)
    		xPos += radiix
    		yPos += radiiy  	
    	}

    	scholarSet.push(paper.circle(xPos, yPos, scale))

    	for(u=5; u < dataRowLength; u++) {
    		cName = data[i][u]
    		if (cName == '') {
    			break
    		} else if (cName in scholarDict) {
    			targetYear = scholarDict[cName][2]
    			targetProgram = scholarDict[cName][3]
    			// if (targetYear == currentYear && targetProgram == currentProgram) {
	    			xTarget = scholarDict[cName][0]
	    			yTarget = scholarDict[cName][1]
	    			linesSet.push(
	    			paper.path("M"+xPos+" "+yPos+"L"+xTarget+" "+yTarget).attr({"stroke-width": ".2"})
	    			)	
    		// 	} else {
    		// 		baseYear = Math.min(currentYear, targetYear)
    		// 		if (baseYear == currentYear) {
    		// 			baseProgram = currentProgram
    		// 			topYear = targetYear
    		// 			topProgram = targetProgram
    		// 		} else {
    		// 			baseProgram = targetProgram
    		// 			topYear = currentYear
    		// 			topProgram = currentProgram
    		// 		}
    		// 		newString = baseYear+baseProgram+baseYear+baseProgram
    		// 		if(newString in eCircleConnects){
    		// 			eCircleConnects[newString] += 1
    		// 		} else {
    		// 			eCircleConnects[newString] = 0
    		// 		}

    		// 		//count a point for the connection between this programyear and that one
    		// }
    			
    		}
    	}

    	scholarDict[currentName] = [xPos, yPos, currentYear, currentProgram]

    }

    for(i=0; i < yearAxis+1; i++) {
    	paper.circle(yearXcoords[i], KJFFheight, KJFFscaleTracker[i])
    	// q=0
    	// for(u=years[i]; u < latestYear+1; u++) {
    	// 	cWidth = eCircleConnects[years[i]+"KJFF"+u+"KJFF"]
    	// 	paper.path("M"+yearXcoords[i]+" "+KJFFheight+"L"++" "+yTarget).attr({"stroke-width": ".2"})
    	// }
    	paper.circle(yearXcoords[i], KDFPheight, KDFPscaleTracker[i])
    }

  
}


//1) determine size of each year's encompassing circle




//2) Lookat each scholar
///a) place in appropriate encompassing circle; place in proper spiral order by impact score
///b) set circle size by impact score
///c) arrange unaffiliated coauthors as orbitals
///d) draw connections to affiliated coauthors if they've been drawn yet; count & hide out-of-eCircle connections

///3) Lookat the count of out-of-eCircle connections, draw them with appropriate thickness
