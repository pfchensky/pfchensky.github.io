//set up the svg container
const svgWidth=600;
const svgHeight=400;
const margin={top:60,right:20,bottom:80,left:80};

const width=svgWidth-margin.left-margin.right;
const height=svgHeight-margin.top-margin.bottom;

const svg=d3.select("#bar_chart")
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
  .text("States");

//Y-label
svg.append("text")
  .attr("class", "axis text")
  .attr("transform","rotate(-90)")
  .attr("text-anchor","middle")
  .attr("x", -svgHeight/2)
  .attr("y", margin.left/2-10)
  .text("Artists Numbers");

// Chart title
svg.append("text")
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("x", svgWidth/2)
    .attr("y",30)
    .text("Artists Numbers Distribution Over States");

//read data and convert string to numeric
d3.csv("artists.csv").then(function(data){
  data.forEach(function(d){
    d.artists_n=+d.artists_n
  })
  // Define X and Y scales
  const scaleX = d3.scaleBand()
    .domain(data.map(d => d.state))
    .range([0, width])
    .padding(0.1);

  const scaleY = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.artists_n)])
    .nice()
    .range([height, 0]);

  //define color scales
  const sequentialScale=d3.scaleSequential()
    .domain([0, 4000])
    .interpolator(d3.interpolateReds);

  // Add bars
  chart.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => scaleX(d.state))
    .attr("y", d => scaleY(d.artists_n))
    .attr("width", scaleX.bandwidth())
    .attr("height", d => height - scaleY(d.artists_n))
    .attr("fill", d=>sequentialScale(d.artists_n));

  // Add data labels
  chart.selectAll(".bar-label")
    .data(data)
    .enter()
    .append("text")
    .attr("x", d => scaleX(d.state) + scaleX.bandwidth() / 2)
    .attr("y", d => scaleY(d.artists_n) - 5)
    .attr("font-size","13px")
    .attr("text-anchor","middle")
    .text(d=>d.artists_n);
  
  // Add X and Y axes
  chart.append("g")
    .attr("class", "axis axis-x")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(scaleX));

  chart.append("g")
    .attr("class", "axis axis-y")
    .call(d3.axisLeft(scaleY).ticks(8));

  //Add d3-svg-legend
  const legend = d3.legendColor()
    .scale(sequentialScale)
    .shapeWidth(30)
    .orient("horizontal")
    .labelFormat(d3.format(".0f"))
    .title("Artists Count");

  svg.append("g")
    .attr("class", "legendSequential")
    .attr("transform", `translate(${svgWidth - 170}, 50)`)
  
  svg.select(".legendSequential")
    .call(legend)
    .select(".legendTitle")
    .attr("y",12)
    .style("font-size","14px")
    
  svg.select(".legendSequential")
    .selectAll("text")
    .style("font-size","14px");
})