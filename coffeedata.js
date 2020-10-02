//countries is the array of data
//target is the selection of the g element to place the graph in
//xscale,yscale are the x and y scales.
var drawBars = function(countries,target,
                         xScale,yScale)
{
   target.selectAll("rect") 
         .data(countries)
         .enter()
         .append("rect")
         .attr("x", function()
        {
            return xScale
         })
}


var makeTranslateString = function(x,y)
{
    return "translate("+x+","+y+")";
}


//graphDim is an object that describes the width and height of the graph area.
//margins is an object that describes the space around the graph
//xScale and yScale are the scales for the x and y scale.
var drawAxes = function(graphDim,margins,
                         xScale,yScale)
{
    
}

//graphDim -object that stores dimensions of the graph area
//margins - object that stores the size of the margins
var drawLabels = function(graphDim,margins)
{
  
     
}


var drawLegend = function(graphDim,margins)
{
    
}

//sets up several important variables and calls the functions for the visualization.
var initGraph = function(countries)
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
        .domain(["2015/16","2016/17","2017/18","2018/19","2019/20"])
        .range([0,graph.width])

    var yScale = d3.scaleBand()
        .domain([0,1])
        .range([graph.height,0])
    
    drawAxes(graph,margins,xScale,yScale);
    drawBars(countries,target,xScale,yScale);
    drawLabels(graph,margins);
    drawLegend(graph,margins);
    
    
    
    
    
}




var coffeePromise = d3.csv("../coffeedata.csv")

var successFCN = function (countries)
{
    console.log("countries", countries);
    drawBars(countries,target,xScale,yScale)
}

var failFCN = function (error)
{
    console.log("error", error);
}

coffeePromise.then(successFCN,failFCN);
