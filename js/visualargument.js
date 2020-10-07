
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
                return yScale(marketyear.Total)+20
            })
           .attr("width", xScale.bandwidth)
           .attr("height",function(marketyear)
            {
               return graphDim.height-yScale(marketyear.Total)
            })
            .attr("fill", "#443730")
            .style("opacity", 0.5)
            .attr("class",function(marketyear)
            {
                if(marketyear.Total>160)
                {
                    return "onyearbar"
                }
                else
                {
                    return "offyearbar"
                }
          }) 
    //Bar tooltip on
          .on("mouseenter", function(marketyear)
          {
              var xPos = d3.event.pageX;
              var yPos = d3.event.pageY;
        
            d3.select("#vatooltip")
              .classed("hidden",false)
              .style("top",yPos+"px")
              .style("left",xPos+"px")
        
            d3.select("#vatotal")
              .text(marketyear.Total+" thousand 60-kg bags");
          })
    //Bar tooltip off
          .on("mouseleave", function()
            {
                d3.select("#vatooltip")
                  .classed("hidden",true);
    })
    
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
      .attr("transform","translate("+margins.left+","+(graphDim.height+margins.top+20)+")")
      .call(xAxis)
    
    var yAxis = d3.axisLeft(yScale)
    d3.select("#vagraph")
      .append("g")
      .attr("transform","translate("+margins.left+","+(margins.top+20)+")")
      .call(yAxis)
    
    var zAxis = d3.axisRight(zScale)
    d3.select("#vagraph")
      .append("g")
      .attr("transform","translate(735,50)")
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
          .text("Production (in hundred thousand 60-kg bags)")
          .classed("label", true)
          .attr("text-anchor","middle")
          .attr("transform","rotate(90)")
    
    //z-xis
   labels.append("g")
          .attr("transform","translate(775,"+(margins.top+(graphDim.height/2))+")")
          .append("text")
          .text("Average Annual Temperatuer (in degrees Celcius)")
          .classed("label", true)
          .attr("text-anchor","middle")
          .attr("transform","rotate(90)")
}


var drawVALegend = function(graphDim,margins)
{
   
}

//sets up several important variables and calls the functions for the visualization.
var initVAGraph = function(marketyear,temperature)
{
    
    //size of screen
    var screen = {width:800,height:600}
    //how much space on each side
    var margins = {left:65,right:65,top:30,bottom:60}
    
    
    
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
        .paddingInner(.2)

    var yScale = d3.scaleLinear()
        .domain([0,180])
        .range([graph.height,0]) 
    
    var zScale = d3.scaleLinear()
       .domain([18,26])
       .range([graph.height,0])
    
     drawBars(marketyear,target,graph,xScale,yScale); 
    //Brazil line - light pink
    var Bline = d3.line()
             .x(function(temperature) {return xScale(temperature.Year)+70})
            .y(function(temperature) {return zScale(temperature.Brazil)+20});
console.log("temperature", temperature)

  target.append("g")
        .append("path")
        .datum(temperature)
        .attr("class", "line")
        .attr("d",Bline)
        .attr("fill", "none")
        .attr("stroke", "#F7DAD9")
 
target.append("g")
      .selectAll("circle")
      .data(temperature)
      .enter()
      .append("circle")
      .attr("cx",function(temperature)
          {
            return xScale(temperature.Year)+70;   
          })
          .attr("cy",function(temperature)
          {
            return zScale(temperature.Brazil)+20;    
          })
          .attr("r",8) 
          .attr("fill","#F7DAD9")
 //Brazil tooltip on
        .on("mouseenter", function(temperature)
          {
              var xPos = d3.event.pageX;
              var yPos = d3.event.pageY;
        
            d3.select("#braziltooltip")
              .classed("hidden",false)
              .style("top",yPos+"px")
              .style("left",xPos+"px")
        
            d3.select("#braziltemps")
              .text(temperature.Brazil+" degrees Celcius");
          })
    //Brazil tooltip off
          .on("mouseleave", function()
            {
                d3.select("#braziltooltip")
                  .classed("hidden",true);
    })
    
  
    //Colombia line - teal
    var Cline = d3.line()
             .x(function(temperature) {return xScale(temperature.Year)+70})
             .y(function(temperature) {return zScale(temperature.Colombia)+20});


    target.append("g")
          .append("path")
          .datum(temperature)
          .attr("class", "line")
          .attr("d",Cline)
          .attr("fill", "none")
          .attr("stroke", "#22333B")
 
 target.append("g")
       .selectAll("circle")
      .data(temperature)
      .enter()
      .append("circle")
      .attr("cx",function(temperature)
          {
            return xScale(temperature.Year)+70;   
          })
          .attr("cy",function(temperature)
          {
            return zScale(temperature.Colombia)+20;    
          })
          .attr("r",8) 
          .attr("fill","#22333B")
 //Colombia tooltip on
        .on("mouseenter", function(temperature)
          {
              var xPos = d3.event.pageX;
              var yPos = d3.event.pageY;
        
            d3.select("#colombiatooltip")
              .classed("hidden",false)
              .style("top",yPos+"px")
              .style("left",xPos+"px")
        
            d3.select("#colombiatemps")
              .text(temperature.Colombia+" degrees Celcius");
          })
    //Colombia tooltip off
          .on("mouseleave", function()
            {
                d3.select("#colombiatooltip")
                  .classed("hidden",true);
    })
    

    //Ethiopia line - dark purple
    var Eline = d3.line()
             .x(function(temperature) {return xScale(temperature.Year)+70})
             .y(function(temperature) {return zScale(temperature.Ethiopia)+20});


    target.append("g")
          .append("path")
          .datum(temperature)
          .attr("class", "line")
          .attr("d",Eline)
          .attr("fill", "none")
          .attr("stroke", "#593D3B")
 
target.append("g")
      .selectAll("circle")
      .data(temperature)
      .enter()
      .append("circle")
      .attr("cx",function(temperature)
          {
            return xScale(temperature.Year)+70;   
          })
          .attr("cy",function(temperature)
          {
            return zScale(temperature.Ethiopia)+20;    
          })
          .attr("r",8) 
          .attr("fill","#593D3B") 
 //Ethiopia tooltip on
        .on("mouseenter", function(temperature)
          {
              var xPos = d3.event.pageX;
              var yPos = d3.event.pageY;
        
            d3.select("#ethiopiatooltip")
              .classed("hidden",false)
              .style("top",yPos+"px")
              .style("left",xPos+"px")
        
            d3.select("#ethiopiatemps")
              .text(temperature.Ethiopia+" degrees Celcius");
          })
    //Ethiopia tooltip off
          .on("mouseleave", function()
            {
                d3.select("#ethiopiatooltip")
                  .classed("hidden",true);
    })
     
    
    //Vietnam line - white
    var Vline = d3.line()
             .x(function(temperature) {return xScale(temperature.Year)+70})
             .y(function(temperature) {return zScale(temperature.Vietnam)+20});


    target.append("g")
          .append("path")
          .datum(temperature)
          .attr("class", "line")
          .attr("d",Vline)
          .attr("fill", "none")
          .attr("stroke", "#F2F4F3")
 
    target.append("g")
          .selectAll("circle")
          .data(temperature)
          .enter()
          .append("circle")
          .attr("cx",function(temperature)
         {
            return xScale(temperature.Year)+70;   
          })
          .attr("cy",function(temperature)
          {
            return zScale(temperature.Vietnam)+20;    
          })
          .attr("r",8) 
          .attr("fill","#F2F4F3")
//Vietnam tooltip on
        .on("mouseenter", function(temperature)
          {
              var xPos = d3.event.pageX;
              var yPos = d3.event.pageY;
        
            d3.select("#vietnamtooltip")
              .classed("hidden",false)
              .style("top",yPos+"px")
              .style("left",xPos+"px")
        
            d3.select("#vietnamtemps")
              .text(temperature.Vietnam+" degrees Celcius");
          })
    //Vietnam tooltip off
          .on("mouseleave", function()
            {
                d3.select("#vietnamtooltip")
                  .classed("hidden",true);
    })
    drawVAAxes(graph,margins,xScale,yScale,zScale);
    drawVALabels(graph,margins);
    drawVALegend(graph,margins);    
};

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