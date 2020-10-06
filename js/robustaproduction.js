//target is the selection of the g element to place the graph in
//xscale,yscale are the x and y scales.
//graphDim is an object that describes the width and height of the graph area.
//margins is an object that describes the space around the graph
//xScale and yScale are the scales for the x and y scale.
var drawRobustaAxes = function(graphDim,margins,
                         xScale,yScale)
{
    var xAxis = d3.axisBottom(xScale)
    d3.select("#robustagraph")
      .append("g")
      .attr("transform","translate("+margins.left+","+(graphDim.height+margins.top)+")")
      .call(xAxis)
    
    var yAxis = d3.axisLeft(yScale)
    d3.select("#robustagraph")
      .append("g")
      .attr("transform","translate("+margins.left+","+(margins.top)+")")
      .call(yAxis)
}

//graphDim -object that stores dimensions of the graph area
//margins - object that stores the size of the margins
var drawRobustaLabels = function(graphDim,margins)
{
  
    var labels = d3.select("#robustagraph") 
                   .append("g")
                   .classed("labels", true)
    
    //title
    labels.append("text")
          .text("Robusta Coffee Production")
          .classed("title",true)
          .attr("text-anchor","middle")
          .attr("x", margins.left+(graphDim.width/2))
          .attr("y", margins.top)
    
    //x-axis
    labels.append("text")
          .text("Market Year")
          .classed("label", true)
          .attr("text-anchor","middle")
          .attr("x", margins.left+(graphDim.width/2))
          .attr("y", margins.top+graphDim.height+margins.bottom)
    
    //y-axis
    labels.append("g")
          .attr("transform","translate(5,"+(margins.top+(graphDim.height/2))+")")
          .append("text")
          .text("Production (in thousand 60-kg bags)")
          .classed("label", true)
          .attr("text-anchor","middle")
          .attr("transform","rotate(90)")
}


var drawRobustaLegend = function(graphDim,margins)
{
    var legend = d3.select("#robustagraph")
                   .append("g")
                   .classed("legend",true)
                   .attr("transform", "translate("+(margins.left)+","+(margins.top)+")");
    
    var categories = [
        {
            class:"offyear",
            name:"Off Year"
        },
        {
            class:"onyear",
            name:"On Year"
        }
    ]
    
    var entries = legend.selectAll("g")
                        .data(categories)
                        .enter()
                        .append("g")
                        .classed("legendEntry",true)
                        .attr("class", function(category)
                        {
                            return category.class
                        })
                        .attr("transform", function(category,index)
                        {
                            return "translate(0,"+(index*20)+")";
                        })
    
    entries.append("circle")
           .attr("cx",8)
           .attr("cy",5)
           .attr("r",5)
           .attr("class", function(stat)
            {
                return stat.class
            })
    
    entries.append("text")
           .text(function(category)
            {
                return category.name
            })
    .attr("x",15)
    .attr("y",10)
}
//sets up several important variables and calls the functions for the visualization.
var initRobsutaGraph = function(marketyear)
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
    
    d3.select("#robustagraph")
    .attr("width",screen.width)
    .attr("height",screen.height)
    
    var target = d3.select("#robustagraph")
    .append("g")
    .attr("transform",
          "translate("+margins.left+","+
                        margins.top+")");
    
    
    var xScale = d3.scaleBand()
        .domain(["2015/16","2016/17","2017/18","2018/19"])
        .range([0,graph.width]);
   
    
    var maxcoffee = d3.max(marketyear,function(year){return parseInt(year.Total)})   
    
    var yScale = d3.scaleLinear()
        .domain([0,maxcoffee])
        .range([graph.height,0])
   
    //define line generator
    var line = d3.line()
             .x(function(marketyear) {return xScale(marketyear.MarketYear)})
             .y(function(marketyear) {return yScale(marketyear.Total)});


    target.append("path")
        .datum(marketyear)
        .attr("class", "line")
        .attr("d",line)
        .attr("fill", "none")
        .attr("stroke", "black")

 
    drawRobustaAxes(graph,margins,xScale,yScale);
    drawRobustaLabels(graph,margins);
    drawRobustaLegend(graph,margins);  
    
}




var robustaPromise = d3.csv("../csv/robustaproduction.csv")

var robustaSuccessFCN = function (marketyear)
{
    console.log("marketyear", marketyear);
    initRobsutaGraph(marketyear)

}

var robustaFailFCN = function (error)
{
    console.log("error", error);
}

robustaPromise.then(robustaSuccessFCN,robustaFailFCN);
