//set up the svg container
const svgWidth=450;
const svgHeight=400;
const margin={top:60,right:20,bottom:80,left:80};

const width=svgWidth-margin.left-margin.right;
const height=svgHeight-margin.top-margin.bottom;

const svg=d3.select("#box_plot")
  .append("svg")
  .attr("width",svgWidth)
  .attr("height",svgHeight)

const chart=svg.append("g")
  .attr("transform",`translate(${margin.left},${margin.top})`);

//X-label
svg.append("text")
  .attr("class", "axis text")
  .attr("x", svgWidth/2)
  .attr("y", svgHeight-50)
  .text("Athletes");

//Y-label
svg.append("text")
  .attr("class", "axis text")
  .attr("transform","rotate(-90)")
  .attr("x", -svgHeight/2)
  .attr("y", margin.left/2-10)
  .text("Weight(kg)");

// Chart title
svg.append("text")
  .attr("font-size", "18px")
  .attr("text-anchor", "middle")
  .attr("x", svgWidth/2)
  .attr("y",30)
  .text("Olympics Athletes Weight Distribution");

//read data and convert string to numeric
d3.csv("height_weight.csv").then(function(data){
  data.forEach(function(d){
  d.weight=+d.weight;
})
  // Sort the Weight
  const weights=data.map(d=>d.weight).sort(d3.ascending);
  const min=d3.min(weights);
  const max=d3.max(weights);
  const q1=d3.quantile(weights,0.25);
  const median=d3.quantile(weights,0.50);
  const q3=d3.quantile(weights,0.75);

  //Y scales
  const scaleY = d3.scaleLinear()
    .domain([40, d3.max(data, d => d.weight)])
    .nice()
    .range([height, 0]);
  
  //box position
  const boxX=width/2; //box x position
  const boxWidth=80;  //box wide 
  
  //box rect
  chart.append("rect")
    .attr("x",boxX-boxWidth/2)
    .attr("y",scaleY(q3))
    .attr("width",boxWidth)
    .attr("height",scaleY(q1)-scaleY(q3))
    .attr("class","box")
    .attr("stroke","black")

  //median line
  chart.append("line")
    .attr("x1", boxX-boxWidth/2)
    .attr("x2", boxX+boxWidth/2)
    .attr("y1", scaleY(median))
    .attr("y2", scaleY(median))
    .attr("stroke","black")

  //min to q1 vertical line 
  chart.append("line")
    .attr("x1", boxX)
    .attr("x2", boxX)
    .attr("y1", scaleY(min))
    .attr("y2", scaleY(q1))
    .attr("stroke","black")

  //q3 to max vertical line
  chart.append("line")
    .attr("x1", boxX)
    .attr("x2", boxX)
    .attr("y1", scaleY(q3))
    .attr("y2", scaleY(max))
    .attr("stroke","black")

  //min horizontal line
  chart.append("line")
    .attr("x1", boxX-boxWidth/4)
    .attr("x2", boxX+boxWidth/4)
    .attr("y1", scaleY(min))
    .attr("y2", scaleY(min))
    .attr("stroke","black")

  //max horizontal line
  chart.append("line")
    .attr("x1", boxX - boxWidth/4)
    .attr("x2", boxX + boxWidth/4)
    .attr("y1", scaleY(max))
    .attr("y2", scaleY(max))
    .attr("stroke", "black");

  //x axes baseline
  chart.append("line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", height)
    .attr("y2", height)
    .attr("stroke", "black");
  
  // Add Y axes
  chart.append("g")
    .attr("class", "axis axis-y")
    .call(d3.axisLeft(scaleY));
})