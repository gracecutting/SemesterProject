//counties is the array of data
//target is the selection of the g element to place the graph in
//xscale,yscale are the x and y scales.
var drawArabicaPlot = function(marketyear,target,
                         xScale,yScale)
{
    target.selectAll("circle")
          .data(marketyear)
          .enter()
          .append("circle")
          .attr("cx",function(marketyear)
          {
            return xScale(marketyear.MarketYear);   
          })
          .attr("cy",function(marketyear)
          {
            return yScale(marketyear.Total);    
          })
          .attr("r",3)
    //tooltip on
          target.on("mouseeneter", function(marketyear)
          {
              var xPos = d3.event.pageX;
              var yPos = d3.event.pageY;
        
            d3.select("#arabicatooltip")
              .classed("hidden",false)
              .style("top",yPos+"px")
              .style("left",xPos+"px")
        
            d3.select("#arabicatotal")
              .text(marketyear.Total);
          })
    //tooltip off
          .on("mouseleave", function()
            {
                d3.select("#arabicatooltip")
                  .classed("hidden",true);
    })
    
}

//graphDim is an object that describes the width and height of the graph area.
//margins is an object that describes the space around the graph
//xScale and yScale are the scales for the x and y scale.
var drawArabicaAxes = function(graphDim,margins,
                         xScale,yScale)
{
    var xAxis = d3.axisBottom(xScale)
    d3.select("#arabicagraph")
      .append("g")
      .attr("transform","translate("+margins.left+","+(graphDim.height+margins.top)+")")
      .call(xAxis)
    
    var yAxis = d3.axisLeft(yScale)
    d3.select("#arabicagraph")
      .append("g")
      .attr("transform","translate("+margins.left+","+(margins.top)+")")
      .call(yAxis)
}

//graphDim -object that stores dimensions of the graph area
//margins - object that stores the size of the margins
var drawArabicaLabels = function(graphDim,margins)
{
  
    var labels = d3.select("#arabicagraph") 
                   .append("g")
                   .classed("labels", true)
    
    //title
    labels.append("text")
          .text("Arabica Coffee Production")
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


var drawArabicaLegend = function(graphDim,margins)
{
    var legend = d3.select("#arabicagraph")
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
           .attr("r",3)
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
var initArabicaGraph = function(marketyear)
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
   
    d3.select("#arabicagraph")
    .attr("width",screen.width)
    .attr("height",screen.height)
    
    var target = d3.select("#arabicagraph")
    .append("g")
    .attr("transform",
          "translate("+margins.left+","+
                        margins.top+")");
    
    
    var xScale = d3.scalePoint()
        .domain(["2015/16","2016/17","2017/18","2018/19"])
        .range([0,graph.width]);
   
    
    var yScale = d3.scaleLinear()
        .domain([0,110000])
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
    
 
    drawArabicaPlot(marketyear,target,xScale,yScale);
    drawArabicaAxes(graph,margins,xScale,yScale);
    drawArabicaLabels(graph,margins);
    drawArabicaLegend(graph,margins);  
    
}




var arabicaPromise = d3.csv("../csv/arabicaproduction.csv")

var ArabicaSuccessFCN = function(marketyear)
{
    console.log("marketyear", marketyear);
    initArabicaGraph(marketyear)

}

var ArabicaFailFCN = function (error)
{
    console.log("error", error);
}

arabicaPromise.then(ArabicaSuccessFCN,ArabicaFailFCN);