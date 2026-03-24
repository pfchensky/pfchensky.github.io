//set up the svg container
const svgWidth=900;
const svgHeight=700;
const margin={top:50,right:30,bottom:50,left:60};

// each line put two subgraphs
const cols=2 

// each subgraph width and height
const width=svgWidth/2-60-margin.left-margin.right;
const height=svgHeight/2-80-margin.top-margin.bottom;

const svg=d3.select("#multiples_chart")
  .append("svg")
  .attr("width",svgWidth)
  .attr("height",svgHeight)

// Whole chart title
svg.append("text")
  .attr("font-size", "18px")
  .attr("text-anchor", "middle")
  .attr("font-weight","bold")
  .attr("x", svgWidth/2+20)
  .attr("y",30)
  .text("Four States Population Distribution(2005-2015)");

//read data and convert string to numeric
d3.csv("four_state_pop.csv").then(function(data){
  data.forEach(function(d){
    d.year=new Date(d.year,0,1);
    d.pop=+d.pop;
  })
  
  // Four group CA,FL,NY,TX
  const stateGroup=Array.from(d3.group(data,d=>d.state));

  // Define X and Y scales
  const scaleX = d3.scaleTime()
    .domain(d3.extent(data, d => d.year))
    .range([0, width])

  const scaleY = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.pop)])
    .nice()
    .range([height, 0]);
  
  //define color scales
  const qualitativeScale=d3.scaleOrdinal()
    .domain(stateGroup.map(d=>d[0]))
    .range(["blue", "red","green","orange"]);

  // line
  const line = d3.line()
    .x(d => scaleX(d.year))
    .y(d => scaleY(d.pop));
  
  // each state is a subgraph 
  const subgraphs= svg.selectAll(".subgraph")
    .data(stateGroup)
    .enter()
    .append("g")
    .attr("class","subgraph")
    .attr("transform",(d,i)=>getTransform(i));

  //chart area of each subgraph
  const chart=subgraphs.append("g")
      .attr("transform",`translate(${margin.left},${margin.top})`)

  // iterate each group
  chart.each(function(subgraphData){
    const state=subgraphData[0];
    const values=subgraphData[1];
    //select current group
    const currentChart=d3.select(this);

    //draw lines
    currentChart.append("path")
      .datum(values)
      .attr("fill", "none")
      .attr("stroke", qualitativeScale(state))
      .attr("stroke-width", 2)
      .attr("d", line(values));
    
    //draw dots
    currentChart.selectAll(".dot")
      .data(values)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => scaleX(d.year))
      .attr("cy", d => scaleY(d.pop))
      .attr("r", 2)
      .attr("fill", qualitativeScale(state));

    //X-label
    currentChart.append("text")
      .attr("font-size", "12px")
      .attr("x", width/2-10)
      .attr("y", height+40)
      .text("Year");

    //Y-label
    currentChart.append("text")
      .attr("font-size", "12px")
      .attr("transform","rotate(-90)")
      .attr("text-anchor", "middle")
      .attr("x", -height/2)
      .attr("y", margin.left/2-60)
      .text("Population (Millions)");
  });
   
  // Add X and Y axes
  chart.append("g")
    .attr("class", "axis axis-x")
    .attr("transform", `translate(0, ${height})`)
    .call(
      d3.axisBottom(scaleX)
      .ticks(d3.timeYear.every(1))
      .tickFormat(d3.timeFormat("%Y"))
    );

  chart.append("g")
    .attr("class", "axis axis-y")
    .call(
      d3.axisLeft(scaleY)
      .ticks(6)
      .tickFormat(d => d3.format(".0f")(d / 1e6))
    );

  //Add d3-svg-legend
  const legend = d3.legendColor()
    .scale(qualitativeScale)
    .shape("circle")
    .shapeRadius(6)
    .title("States");

  svg.append("g")
    .attr("class", "legendOrdinal")
    .attr("transform", `translate(760, 80)`)
  
  svg.select(".legendOrdinal")
    .call(legend)
    .select(".legendTitle")
    .attr("y",8)
    .style("font-size","14px")
    
  svg.select(".legendOrdinal")
    .selectAll("text")
    .style("font-size","14px");
})

function getTransform(i) {
  const col = i % cols;
  const row = Math.floor(i / cols);
  const x = col * (width + margin.left + margin.right) + 40;
  const y = row * (height + margin.top + margin.bottom) + 50;
  return `translate(${x},${y})`;
}