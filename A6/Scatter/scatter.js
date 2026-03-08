//set up the svg container
const svgWidth=600;
const svgHeight=400;
const margin={top:60,right:20,bottom:80,left:80};

const width=svgWidth-margin.left-margin.right;
const height=svgHeight-margin.top-margin.bottom;

const svg=d3.select("#scatter_plot")
  .append("svg")
  .attr("width",svgWidth)
  .attr("height",svgHeight)

const chart=svg.append("g")
  .attr("transform",`translate(${margin.left},${margin.top})`);

//X-label
svg.append("text")
  .attr("class", "axis text")
  .attr("x", svgWidth/2)
  .attr("y", svgHeight-30)
  .text("Height (cm)");

//Y-label
svg.append("text")
  .attr("class", "axis text")
  .attr("transform","rotate(-90)")
  .attr("text-anchor","middle")
  .attr("x", -svgHeight/2)
  .attr("y", margin.left/2-10)
  .text("Weight (kg)");

// Chart title
svg.append("text")
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("x", svgWidth/2)
    .attr("y",30)
    .text("Olympic Athletes Height, Weight And Sex Distribution");

//read data and convert string to numeric
d3.csv("olympics.csv").then(function(data){
  data.forEach(function(d){
    d.height = +d.height;
    d.weight = +d.weight;
  })
  // Define X and Y scales
  const scaleX = d3.scaleLinear()
    .domain(d3.extent(data, d => d.height))
    .nice()
    .range([0, width]);

  const scaleY = d3.scaleLinear()
    .domain(d3.extent(data, d => d.weight))
    .nice()
    .range([height, 0]);

  //define color scales
  const qualitativeScale=d3.scaleOrdinal()
    .domain(["M", "F"])
    .range(["blue", "red"]);

  // Add circles
  chart.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => scaleX(d.height))
    .attr("cy", d => scaleY(d.weight))
    .attr("r", 4)
    .attr("fill", d => qualitativeScale(d.sex))
    .attr("opacity", 0.7);

  // Add X and Y axes
  chart.append("g")
    .attr("class", "axis axis-x")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(scaleX));

  chart.append("g")
    .attr("class", "axis axis-y")
    .call(d3.axisLeft(scaleY));

  //Add d3-svg-legend
  const legend = d3.legendColor()
    .scale(qualitativeScale)
    .shape("circle")
    .shapeRadius(6)
    .title("Sex");

  svg.append("g")
    .attr("class", "legendOrdinal")
    .attr("transform", `translate(${svgWidth - 50}, 50)`)
  
  svg.select(".legendOrdinal")
    .call(legend)
    .select(".legendTitle")
    .attr("y",8)
    .style("font-size","14px")
    
  svg.select(".legendOrdinal")
    .selectAll("text")
    .style("font-size","14px");
})