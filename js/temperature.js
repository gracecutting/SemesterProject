//target is the selection of the g element to place the graph in
//xscale,yscale are the x and y scales.
//graphDim is an object that describes the width and height of the graph area.
//margins is an object that describes the space around the graph
//xScale and yScale are the scales for the x and y scale.
var drawTempAxes = function(graphDim,margins,
                         xScale,yScale)
{
    var xAxis = d3.axisBottom(xScale)
    d3.select("#tempgraph")
      .append("g")
      .attr("transform","translate("+margins.left+","+(graphDim.height+margins.top)+")")
      .call(xAxis)
    
    var yAxis = d3.axisLeft(yScale)
    d3.select("#tempgraph")
      .append("g")
      .attr("transform","translate("+margins.left+","+(margins.top)+")")
      .call(yAxis)
}

//graphDim -object that stores dimensions of the graph area
//margins - object that stores the size of the margins
var drawTempLabels = function(graphDim,margins)
{
  
    var labels = d3.select("#tempgraph") 
                   .append("g")
                   .classed("labels", true)
    
    //title
    labels.append("text")
          .text("Average Temperature")
          .classed("title",true)
          .attr("text-anchor","middle")
          .attr("x", margins.left+(graphDim.width/2))
          .attr("y", margins.top)
    
    //x-axis
    labels.append("text")
          .text("Year")
          .classed("label", true)
          .attr("text-anchor","middle")
          .attr("x", margins.left+(graphDim.width/2))
          .attr("y", margins.top+graphDim.height+margins.bottom)
    
    //y-axis
    labels.append("g")
          .attr("transform","translate(5,"+(margins.top+(graphDim.height/2))+")")
          .append("text")
          .text("Temperature (in Celcius)")
          .classed("label", true)
          .attr("text-anchor","middle")
          .attr("transform","rotate(90)")
}


var drawTempLegend = function(graphDim,margins)
{
    var legend = d3.select("#tempgraph")
                   .append("g")
                   .classed("legend",true)
                   .attr("transform", "translate("+(margins.left)+","+(margins.top)+")");
    
    var categories = [
        {
            class:"brazil",
            name:"Brazil"
        },
        {
            class:"colombia",
            name:"Colombia"
        },
        {
            class:"ethiopia",
            name:"Ethiopia"
        },
        {
            class:"indonesia",
            name:"Indonesia"
        },
        {
            class:"vietnam",
            name:"Vietnam"
        },
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
var initTempGraph = function(temperature)
{
    //size of screen
    var screen = {width:600,height:400}
    //how much space on each side
    var margins = {left:65,right:150,top:40,bottom:40}
    
    
    
    var graph = 
        {
            width:screen.width-margins.left-margins.right,
            height:screen.height - margins.top-margins.bottom
        }
    console.log(graph);
   
    d3.select("#tempgraph")
    .attr("width",screen.width)
    .attr("height",screen.height)
    
    var target = d3.select("#tempgraph")
    .append("g")
    .attr("transform",
          "translate("+margins.left+","+
                        margins.top+")");
    
    
    var xScale = d3.scaleBand()
        .domain(["2015","2016","2017","2018"])
        .range([0,graph.width]);
   
    
   // var maxcoffee = d3.max(marketyear,function(year){return parseInt(year.Total)})   
    
    var yScale = d3.scaleLinear()
        .domain([22,27])
        .range([graph.height,0])
   
    //define line generator
    var line = d3.line()
             .x(function(temperature) {return xScale(temperature.MarketYear)})
             .y(function(marketyear) {return yScale(temperature.Total)});


    target.append("path")
        .datum(temperature)
        .attr("class", "line")
        .attr("d",line)
        .attr("fill", "none")
        .attr("stroke", "black")
    
 
    drawTempAxes(graph,margins,xScale,yScale);
    drawTempLabels(graph,margins);
    drawTempLegend(graph,margins);  
    
}




var tempPromise = d3.csv("../csv/temperature.csv")

var tempSuccessFCN = function(temperature)
{
    console.log("temperature", temperature);
    initTempGraph(temperature)

}

var tempFailFCN = function (error)
{
    console.log("error", error);
}

tempPromise.then(tempSuccessFCN,tempFailFCN);
