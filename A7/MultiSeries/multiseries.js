//set up the svg container
const svgWidth=600;
const svgHeight=400;
const margin={top:60,right:70,bottom:80,left:80};

const width=svgWidth-margin.left-margin.right;
const height=svgHeight-margin.top-margin.bottom;

const svg=d3.select("#multiseries_chart")
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
  .text("Year");

//Y-label
svg.append("text")
  .attr("class", "axis text")
  .attr("transform","rotate(-90)")
  .attr("text-anchor", "middle")
  .attr("x", -svgHeight/2)
  .attr("y", margin.left/2-10)
  .text("Population (Millions)");

// Chart title
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
  const stateGroup=Array.from(d3.group(data,d=>d.state))
 
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

  // area
  const area = d3.area()
    .x(d=>scaleX(d.year))
    .y0(height)
    .y1(d => scaleY(d.pop));

  chart.selectAll(".area")
    .data(stateGroup)
    .enter()
    .append("path")
    .attr("class","area")
    .attr("fill", d => qualitativeScale(d[0]))
    .attr("fill-opacity",0.25)
    .attr("stroke","none")
    .attr("d",d=>area(d[1]))
  
  const tooltip=d3.select("#tooltip")
  
  // tooltip attached to each dot 
  chart.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => scaleX(d.year))
    .attr("cy", d => scaleY(d.pop))
    .attr("r", 3)
    .attr("fill", d=>qualitativeScale(d.state))
    .attr("fill-opacity",0.4)
    .on("mouseover", (event, d) =>{
      tooltip
        .html(`
          <strong>${d.state}</strong><br>
          Year: ${d3.timeFormat("%Y")(d.year)}<br>
          Population:${d3.format("0.0f")(d.pop/1e6)}M
        `)
        .style("opacity", 1)
    })
    .on("mousemove", (event)=> {
      tooltip
        .style("left", (event.pageX + 12) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseleave", ()=> {
      tooltip.style("opacity", 0);
    });

  // Add X and Y axes
  chart.append("g")
    .attr("class", "axis axis-x")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(scaleX).ticks(d3.timeYear.every(1)).tickFormat(d3.timeFormat("%Y")));

  chart.append("g")
    .attr("class", "axis axis-y")
    .call(d3.axisLeft(scaleY).ticks(6).tickFormat(d => d3.format(".0f")(d / 1e6)));

  //Add d3-svg-legend
  const legend = d3.legendColor()
    .scale(qualitativeScale)
    .shape("circle")
    .shapeRadius(6)
    .title("States");

  svg.append("g")
    .attr("class", "legendOrdinal")
    .attr("transform", `translate(550, 90)`)
    
  svg.select(".legendOrdinal")
    .call(legend)
    .selectAll("circle")
    .attr("fill-opacity",0.25)
  
  svg.select(".legendOrdinal")
    .call(legend)
    .select(".legendTitle")
    .attr("y",8)
    .style("font-size","14px");
    
  svg.select(".legendOrdinal")
    .selectAll("text")
    .style("font-size","14px");
})