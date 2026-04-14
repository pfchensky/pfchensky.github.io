//set up the svg container
const svgWidth=600;
const svgHeight=400;
const margin={top:60,right:20,bottom:80,left:80};

const width=svgWidth-margin.left-margin.right;
const height=svgHeight-margin.top-margin.bottom;

const svg=d3.select("#deceptive_chart")
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
  .text("Tuition(USD)");

// Chart title
svg.append("text")
  .attr("font-size", "18px")
  .attr("text-anchor", "middle")
  .attr("font-weight","bold")
  .attr("x", svgWidth/2+20)
  .attr("y",30)
  .text("California tuition from 2006 to 2011");

//read data and convert string to numeric
d3.csv("ca_tuition.csv").then(function(data){
  data.forEach(function(d){
    d.year=+d.year;
    d.tuition = +d.tuition;
  })
  
  // cherry-pick 2006 to 2011 data to draw chart
  const deceptiveData = data.slice(2, 8);

  // Define X and Y scales
  const scaleX = d3.scalePoint()
    .domain(deceptiveData.map(d => d.year))
    .range([0, width]);

  const scaleY = d3.scaleLinear()
    .domain([5000, 9600])
    .range([height, 0]);

  // line
  const line = d3.line()
    .x(d => scaleX(d.year))
    .y(d => scaleY(d.tuition));
  
  //define a tooltip 
  const tooltip=d3.select("#tooltip")

  chart.selectAll(".dot")
    .data(deceptiveData)
    .enter()
    .append("circle")
    .attr("cx", d => scaleX(d.year))
    .attr("cy", d => scaleY(d.tuition))
    .attr("r", 4)
    .attr("fill", "blue")
    .on("mouseover", (event, d) =>{
      tooltip
        .html(`
          Year: <strong>${d.year}</strong><br>
          Tuition: <strong>${d.tuition}</strong><br>
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

  chart.append("path")
    .datum(deceptiveData)
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
    .call(d3.axisLeft(scaleY).tickValues([5000, 6500, 8000, 9500]));
})

