
//target is the selection of the g element to place the graph in
//xscale,yscale are the x and y scales.
var drawBars = function(marketyear,target,graphDim,
                         xScale,yScale)
{
    target.selectAll("rect")
          .data(marketyear)
          .enter()
          .append("rect")
          .attr("x", function(marketyear)
            {
                return xScale(marketyear.MarketYear)
            })
           .attr("y", function(marketyear)
            {
                return yScale(marketyear.Total)
            })
           .attr("width", xScale.bandwidth)
           .attr("height",function(marketyear)
            {
               return graphDim.height-yScale(marketyear.Total)
            })
            .attr("fill", "#443730")
            .style("opacity", 0.5)
}

//graphDim is an object that describes the width and height of the graph area.
//margins is an object that describes the space around the graph
//xScale and yScale are the scales for the x and y scale.
var drawVAAxes = function(graphDim,margins,
                         xScale,yScale,zScale)
{
   var xAxis = d3.axisBottom(xScale)
    d3.select("#vagraph")
      .append("g")
      .attr("transform","translate("+margins.left+","+(graphDim.height+margins.top)+")")
      .call(xAxis)
    
    var yAxis = d3.axisLeft(yScale)
    d3.select("#vagraph")
      .append("g")
      .attr("transform","translate("+margins.left+","+(margins.top)+")")
      .call(yAxis)
    
    var zAxis = d3.axisRight(zScale)
    d3.select("#vagraph")
      .append("g")
      .attr("trasnform","translate("+margins.right+","+(graphDim.height+margins.top)+")")
      .call(zAxis)
}

//graphDim -object that stores dimensions of the graph area
//margins - object that stores the size of the margins
var drawVALabels = function(graphDim,margins)
{
   var labels = d3.select("#vagraph") 
                   .append("g")
                   .classed("labels", true)
    
    //title
    labels.append("text")
          .text("Total Coffee Production vs Average Temperature")
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


var drawVALegend = function(graphDim,margins)
{
   
}

//sets up several important variables and calls the functions for the visualization.
var initVAGraph = function(marketyear,temperature)
{ console.log(temperature)
    //size of screen
    var screen = {width:800,height:600}
    //how much space on each side
    var margins = {left:65,right:65,top:30,bottom:40}
    
    
    
    var graph = 
        {
            width:screen.width-margins.left-margins.right,
            height:screen.height - margins.top-margins.bottom
        }
    console.log(graph);
    
    d3.select("#vagraph")
    .attr("width",screen.width)
    .attr("height",screen.height)
    
    var target = d3.select("#vagraph")
    .append("g")
    .attr("transform",
          "translate("+margins.left+","+
                        margins.top+")");
    
    
    var xScale = d3.scaleBand()
        .domain(["2015/16","2016/17","2017/18","2018/19"])
        .range([0,graph.width])

    var yScale = d3.scaleLinear()
        .domain([0,180000])
        .range([graph.height,0]) 
    
    var zScale = d3.scaleLinear()
       .domain([22,27])
       .range([graph.height,0])
    
    //Brazil line
    var Bline = d3.line()
             .x(function(temperature) {return xScale(temperature.Year)})
            .y(function(temperature) {return zScale(temperature.Brazil)});
console.log("temperature", temperature)

    target.append("g")
        .append("path")
          .datum(temperature)
          .attr("class", "line")
          .attr("d",Bline)
          .attr("fill", "none")
         .attr("stroke", "#F7DAD9")
    
    //Colombia line
    var Cline = d3.line()
             .x(function(temperature) {return xScale(temperature.Year)})
             .y(function(temperature) {return zScale(temperature.Colombia)});


    target.append("g")
          .append("path")
          .datum(temperature)
          .attr("class", "line")
          .attr("d",Cline)
          .attr("fill", "none")
          .attr("stroke", "#F7DAD9")

    //Ethiopia line
    var Eline = d3.line()
             .x(function(temperature) {return xScale(temperature.Year)})
             .y(function(temperature) {return zScale(temperature.Ethiopia)});


    target.append("g")
          .append("path")
          .datum(temperature)
          .attr("class", "line")
          .attr("d",Eline)
          .attr("fill", "none")
          .attr("stroke", "#F7DAD9")
    
    //Vietnam line 
    var Vline = d3.line()
             .x(function(temperature) {return xScale(temperature.Year)})
             .y(function(temperature) {return zScale(temperature.Vietnam)});


    target.append("g")
          .append("path")
          .datum(temperature)
          .attr("class", "line")
          .attr("d",Vline)
          .attr("fill", "none")
          .attr("stroke", "#F7DAD9")

    drawVAAxes(graph,margins,xScale,yScale,zScale);
    drawBars(marketyear,target,graph,xScale,yScale); 
    drawVALabels(graph,margins);
    drawVALegend(graph,margins);    
}


var VAPromise = d3.csv("../csv/totalproduction.csv")

var VAsuccessFCN = function(values)
{
    var marketyear = values[0]
    var temperature = values[1]
    console.log(values[0])
    console.log("marketyear",marketyear);
    initVAGraph(marketyear,temperature);
    
}

var VAfailFCN = function(error)
{
    console.log("error",error);
}



var tempPromise = d3.csv("../csv/temperature.csv")
var promises = [VAPromise,tempPromise]
Promise.all(promises).then(VAsuccessFCN,VAfailFCN);