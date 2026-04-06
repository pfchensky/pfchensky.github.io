//set up the svg container
const svgWidth=960;
const svgHeight=600;
const margin={top:70,right:40,bottom:70,left:40};

const width=svgWidth-margin.left-margin.right;
const height=svgHeight-margin.top-margin.bottom;

const svg=d3.select("#choropleth_map")
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
    .text("US County Unemployment Rate in 2023");

//read data 
Promise.all([
  d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json"),
  d3.csv("county_unemployment_2023.csv")
]).then(function([us, data]){
  
  //convert string to numeric
  data.forEach(function(d){
    d.Unemployment_rate_2023 = +d.Unemployment_rate_2023;
  });
  
  // create a map to store county FIPS_Code and corresponding unemployment_rate_2023
  const unemploymentRateMap = new Map();

  // create a map to store county FIPS_Code and corresponding county name
  const areaNameMap = new Map();

  data.forEach(function(d) {
    unemploymentRateMap.set(d.FIPS_Code, d.Unemployment_rate_2023);
    areaNameMap.set(d.FIPS_Code,d.Area_Name);
  });
  
  // convert topojson to geojson
  const counties = topojson.feature(us, us.objects.counties).features;
  
  // projection
  const projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2 + 20])
    .scale(1100);
  
  // path
  const path = d3.geoPath().projection(projection);

  // get min and max value
  const minValue = d3.min(data, d => d.Unemployment_rate_2023);
  const maxValue = d3.max(data, d => d.Unemployment_rate_2023);

  //define color scales
  const sequentialScale=d3.scaleSequential()
    .domain([minValue, maxValue])
    .interpolator(d3.interpolateReds);
  
  //define a tooltip 
  const tooltip=d3.select("#tooltip")

  // draw counties 
  chart.selectAll(".counties")
    .data(counties)
    .enter()
    .append("path")
    .attr("class", "counties")
    .attr("d", path)
    .attr("fill", d => sequentialScale(unemploymentRateMap.get(d.id)))
    .on("mouseover", (event, d) =>{
      tooltip
        .html(`
          Unemployment Rate: <strong>${unemploymentRateMap.get(d.id)}</strong><br>
          County Name: <strong>${areaNameMap.get(d.id)}</strong><br>
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

  // draw state borders
  chart.append("path")
    .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-linejoin", "round")
    .attr("d", path);

  //Add d3-svg-legend
  const legend = d3.legendColor()
    .scale(sequentialScale)
    .shapeWidth(30)
    .orient("horizontal")
    .labelFormat(d3.format(".0f"))
    .title("Unemployment Rate (%)");

  svg.append("g")
    .attr("class", "legendSequential")
    .attr("transform", `translate(${svgWidth - 300}, 50)`)
  
  svg.select(".legendSequential")
    .call(legend)
    .select(".legendTitle")
    .attr("y",12)
    .style("font-size","14px")
    
  svg.select(".legendSequential")
    .selectAll("text")
    .style("font-size","14px");
})