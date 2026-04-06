//set up the svg container
const svgWidth=960;
const svgHeight=600;
const margin={top:70,right:40,bottom:70,left:40};

const width=svgWidth-margin.left-margin.right;
const height=svgHeight-margin.top-margin.bottom;

const svg=d3.select("#proportional_symbols")
  .append("svg")
  .attr("width",svgWidth)
  .attr("height",svgHeight)

const chart=svg.append("g")
  .attr("transform",`translate(${margin.left},${margin.top})`);

// Chart title
svg.append("text")
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("x", svgWidth/2)
    .attr("y",30)
    .text("US State Cost Index");

//read data 
Promise.all([
  d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),
  d3.csv("expensive_states.csv")
]).then(function([us, data]){
  
  //convert string to numeric
  data.forEach(function(d){
    d.lat = +d.lat;
    d.lng = +d.lng;
    d.costIndex = +d.costIndex;
  });
  
  // convert topojson to geojson
  const states = topojson.feature(us, us.objects.states).features;
  
  // projection
  const projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2 + 20])
    .scale(1100);
  
  // path
  const path = d3.geoPath().projection(projection);

  // draw states
  chart.selectAll(".state")
    .data(states)
    .enter()
    .append("path")
    .attr("class", "state")
    .attr("d", path)
    .attr("fill", "lightgray")
    .attr("stroke", "white")
    .attr("stroke-width", 1);
  
  // get min and max value
  const minValue = d3.min(data, d => d.costIndex);
  const maxValue = d3.max(data, d => d.costIndex);
  
  // radius scale
  const radiusScale = d3.scaleSqrt()
    .domain([minValue, maxValue])
    .range([2, 12]);

  //define a tooltip 
  const tooltip=d3.select("#tooltip")

  // draw proportional symbols
  chart.selectAll(".symbol")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "symbol")
    .attr("cx", d => projection([d.lng, d.lat])[0])
    .attr("cy", d => projection([d.lng, d.lat])[1])
    .attr("r", d => radiusScale(d.costIndex))
    .attr("fill", "blue")
    .attr("fill-opacity", 0.6)
    .attr("stroke", "black")
    .attr("stroke-width", 0.8)
    .on("mouseover", (event, d) =>{
      tooltip
        .html(`
          State: <strong>${d.state}</strong><br>
          Cost Index: <strong>${d.costIndex}</strong><br>
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

  // state borders
  chart.append("path")
    .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-linejoin", "round")
    .attr("d", path);

  //Add d3-svg-legend
  const legend = d3.legendSize()
    .scale(radiusScale)
    .shape("circle")
    .shapePadding(15)
    .labelOffset(10)
    .orient("vertical")
    .labelFormat(d3.format(".0f"))
    .title("Cost Index");

  svg.append("g")
    .attr("class", "legendSize")
    .attr("transform", `translate(${svgWidth - 80}, 300)`)
  
  svg.select(".legendSize")
    .call(legend)
    .select(".legendTitle")
    .attr("y",11)
    .style("font-size","14px")
    
  svg.select(".legendSize")
    .selectAll("text")
    .style("font-size","14px");
  
  svg.select(".legendSize")
    .selectAll("circle")
    .attr("fill", "blue")
    .attr("fill-opacity", 0.6)
    .attr("stroke", "black")
    .attr("stroke-width", 0.8)
})