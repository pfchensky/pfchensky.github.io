//set up the svg container
const svgWidth=600;
const svgHeight=400;
const margin={top:60,right:20,bottom:80,left:80};

const width=svgWidth-margin.left-margin.right;
const height=svgHeight-margin.top-margin.bottom;

const svg=d3.select("#ethical_chart")
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
  .text("Day");

//Y-label
svg.append("text")
  .attr("class", "axis text")
  .attr("transform","rotate(-90)")
  .attr("text-anchor", "middle")
  .attr("x", -svgHeight/2)
  .attr("y", margin.left/2-10)
  .text("Active Users");

// Chart title
svg.append("text")
  .attr("font-size", "18px")
  .attr("text-anchor", "middle")
  .attr("font-weight","bold")
  .attr("x", svgWidth/2+20)
  .attr("y",30)
  .text("ZenFocus Daily Active Users Over 11 Days");

//read data and convert string to numeric
d3.csv("active_users.csv").then(function(data){
  data.forEach(function(d){
    d.active_users=+d.active_users;
  })

  // Define X and Y scales
  const scaleX = d3.scalePoint()
    .domain(data.map(d => d.day))
    .range([0, width]);

  const scaleY = d3.scaleLinear()
    .domain([0, 550])
    .range([height, 0]);

  // line
  const line = d3.line()
    .x(d => scaleX(d.day))
    .y(d => scaleY(d.active_users));

  chart.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => scaleX(d.day))
    .attr("cy", d => scaleY(d.active_users))
    .attr("r", 4)
    .attr("fill", "blue");

  chart.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("d", line);
  
  // Add X and Y axes
  chart.append("g")
    .attr("class", "axis axis-x")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(scaleX));

  chart.append("g")
    .attr("class", "axis axis-y")
    .call(d3.axisLeft(scaleY));
})

