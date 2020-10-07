//target is the selection of the g element to place the graph in
//xscale,yscale are the x and y scales.
var drawTotalPlot = function(marketyear,target,
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
          .attr("r",8)
          .attr("class",function(marketyear)
          {
            if(marketyear.Total>160)
            {
                return "onyear"
            }
            else
            {
                return "offyear"
            }
          })
    //tooltip on
          .on("mouseenter", function(marketyear)
          {
              var xPos = d3.event.pageX;
              var yPos = d3.event.pageY;
        
            d3.select("#totaltooltip")
              .classed("hidden",false)
              .style("top",yPos+"px")
              .style("left",xPos+"px")
        
            d3.select("#totaltotal")
              .text(marketyear.Total+" hundred thousand 60-kg bags");
          })
    //tooltip off
          .on("mouseleave", function()
            {
                d3.select("#totaltooltip")
                  .classed("hidden",true);
    })
    
}

//graphDim is an object that describes the width and height of the graph area.
//margins is an object that describes the space around the graph
//xScale and yScale are the scales for the x and y scale.
var drawTotalAxes = function(graphDim,margins,
                         xScale,yScale)
{
    var xAxis = d3.axisBottom(xScale)
    d3.select("#totalgraph")
      .append("g")
      .attr("transform","translate("+margins.left+","+(graphDim.height+margins.top)+")")
      .call(xAxis)
    
    var yAxis = d3.axisLeft(yScale)
    d3.select("#totalgraph")
      .append("g")
      .attr("transform","translate("+margins.left+","+(margins.top)+")")
      .call(yAxis)
}

//graphDim -object that stores dimensions of the graph area
//margins - object that stores the size of the margins
var drawTotalLabels = function(graphDim,margins)
{
  
    var labels = d3.select("#totalgraph") 
                   .append("g")
                   .classed("labels", true)
    
    //title
    labels.append("text")
          .text("Total Coffee Production")
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
          .attr("transform","translate(10,"+(margins.top+(graphDim.height/2))+")")
          .append("text")
          .text("Production (in thousand 60-kg bags)")
          .classed("label", true)
          .attr("text-anchor","middle")
          .attr("transform","rotate(90)")
}



//sets up several important variables and calls the functions for the visualization.
var initTotalGraph = function(marketyear)
{
    //size of screen
    var screen = {width:450,height:400}
    //how much space on each side
    var margins = {left:65,right:80,top:40,bottom:40}
    
    
    
    var graph = 
        {
            width:screen.width-margins.left-margins.right,
            height:screen.height - margins.top-margins.bottom
        }
    console.log(graph);

    d3.select("#totalgraph")
    .attr("width",screen.width)
    .attr("height",screen.height)
    
    var target = d3.select("#totalgraph")
    .append("g")
    .attr("transform",
          "translate("+margins.left+","+
                        margins.top+")");
    
    
    var xScale = d3.scalePoint()
        .domain(["2015/16","2016/17","2017/18","2018/19"])
        .range([0,graph.width]);
   

    var yScale = d3.scaleLinear()
        .domain([0,180])
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
    
 
    drawTotalPlot(marketyear,target,xScale,yScale);
    drawTotalAxes(graph,margins,xScale,yScale);
    drawTotalLabels(graph,margins);
    
}




var totalPromise = d3.csv("../csv/totalproduction.csv")

var totalSuccessFCN = function(marketyear)
{
    console.log("marketyear", marketyear);
    initTotalGraph(marketyear)

}

var totalFailFCN = function (error)
{
    console.log("error", error);
}

totalPromise.then(totalSuccessFCN,totalFailFCN);
