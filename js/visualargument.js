
//target is the selection of the g element to place the graph in
//xscale,yscale are the x and y scales.
var drawBars = function(marketyear,target,
                         xScale,yScale)
{
    target.selectAll("rect")
          .data(marketyear)
          .enter()
          .append("rect")
          .attr("x", function(marketyear)
        {
            return xScale()
        })
}


var makeTranslateString = function(x,y)
{
    return "translate("+x+","+y+")";
}


//graphDim is an object that describes the width and height of the graph area.
//margins is an object that describes the space around the graph
//xScale and yScale are the scales for the x and y scale.
var drawVAAxes = function(graphDim,margins,
                         xScale,yScale)
{
   
}

//graphDim -object that stores dimensions of the graph area
//margins - object that stores the size of the margins
var drawVALabels = function(graphDim,margins)
{
   
}


var drawVALegend = function(graphDim,margins)
{
   
}

//sets up several important variables and calls the functions for the visualization.
var initVAGraph = function(marketyear)
{
    //size of screen
    var screen = {width:800,height:600}
    //how much space on each side
    var margins = {left:50,right:150,top:40,bottom:40}
    
    
    
    var graph = 
        {
            width:screen.width-margins.left-margins.right,
            height:screen.height - margins.top-margins.bottom
        }
    console.log(graph);
    
    d3.select("svg")
    .attr("width",screen.width)
    .attr("height",screen.height)
    
    var target = d3.select("svg")
    .append("g")
    .attr("id","#graph")
    .attr("transform",
          "translate("+margins.left+","+
                        margins.top+")");
    
    
    var xScale = d3.scaleBand()
        .domain(["2015/16","2016/17","2017/18","2018/19"])
        .range([0,graph.width])

   var maxcoffee = d3.max(marketyear,function(year){return parseInt(year.Total)})   
    
    var yScale = d3.scaleLinear()
        .domain([0,maxcoffee])
        .range([graph.height,0]) 
    
    drawVAAxes(graph,margins,xScale,yScale);
    drawBars(marketyear,target,xScale,yScale);
    drawVALabels(graph,margins);
    drawVALegend(graph,margins);
    
    
    
    
    
}


var VAPromise = d3.csv("../csv/totalproduction.csv")

var VAsuccessFCN = function(marketyear)
{
    console.log("marketyear",marketyear);
    initGraph(marketyear);
    
}

var VAfailFCN = function(error)
{
    console.log("error",error);
}

VAPromise.then(VAsuccessFCN,VAfailFCN);