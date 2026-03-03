//set up the svg container
const svgWidth=600;
const svgHeight=500;
const margin={top:60,right:20,bottom:80,left:80};

const width=svgWidth-margin.left-margin.right;
const height=svgHeight-margin.top-margin.bottom;

const svg=d3.select("#bubble_chart")
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
  .text("Height(cm)");

//Y-label
svg.append("text")
  .attr("class", "axis text")
  .attr("transform","rotate(-90)")
  .attr("text-anchor","middle")
  .attr("x", -svgHeight/2)
  .attr("y", margin.left/2-10)
  .text("Weight(kg)");

// Chart title
svg.append("text")
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("x", svgWidth/2)
    .attr("y",30)
    .text("Height, Weight, Age and Sex Distribution of Olympic Athletes");

//read data and convert string to numeric
d3.csv("olympics.csv").then(function(data){
  data.forEach(function(d){
    d.age=+d.age
    d.height=+d.height
    d.weight=+d.weight
  })

  // Define X and Y scales
  const scaleX = d3.scaleLinear()
    .domain(d3.extent(data, d => d.height))
    .nice()
    .range([0, width])

  const scaleY = d3.scaleLinear()
    .domain(d3.extent(data, d => d.weight))
    .nice()
    .range([height, 0]);

  //bubble size scale
  const scaleSize=d3.scaleSqrt()
    .domain(d3.extent(data, d => d.age))
    .nice()
    .range([3, 14]);

  //bubble color scale
  const scaleColor=d3.scaleOrdinal()
    .domain(["M","F"])
    .range(["red", "blue"]);
  
  // Add bubbles
  chart.selectAll(".bubble")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => scaleX(d.height))
    .attr("cy", d => scaleY(d.weight))
    .attr("r", d => scaleSize(d.age))
    .attr("fill", d=>scaleColor(d.sex))
    .attr("opacity", 0.7);
  
  // Add X and Y axes
  chart.append("g")
    .attr("class", "axis axis-x")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(scaleX).ticks(8));

  chart.append("g")
    .attr("class", "axis axis-y")
    .call(d3.axisLeft(scaleY).ticks(8));

  //legend
  const legend = chart.append("g")
    .attr("transform", `translate(${width - 90}, 10)`);
    
  const legendData = ["Male", "Female"];
  legend.selectAll("legend-dot")
    .data(legendData)
    .enter()
    .append("circle")
    .attr("cx", 70)
    .attr("cy", (d, i) => i * 20)
    .attr("r", 6)
    .attr("fill", d => scaleColor(d));

  legend.selectAll("legend-text")
    .data(legendData)
    .enter()
    .append("text")
    .attr("x", 80)
    .attr("y", (d, i) => i * 20 + 4)
    .attr("font-size", "12px")
    .text(d => d);

  // age legend
  legend.append("text")
    .attr("x", 75)
    .attr("y", 45)
    .attr("font-weight", "bold")
    .attr("font-size","12px")
    .text("Age");

  // age sizes
  const sizeValues = [
    d3.min(data, d => d.age),
    d3.max(data, d => d.age)
  ];

  // draw circles
  legend.selectAll(".size-circle")
    .data(sizeValues)
    .enter()
    .append("circle")
    .attr("cx", 75)
    .attr("cy", (d, i) => 55 + i * 25)
    .attr("r", d => scaleSize(d))
    .attr("fill", "none")
    .attr("stroke", "black");

  //labels
  legend.selectAll(".size-text")
    .data(sizeValues)
    .enter()
    .append("text")
    .attr("x", 95)
    .attr("y", (d, i) => 55 + i * 25 + 4)
    .attr("font-size", "10px")
    .text(d => Math.round(d));
})