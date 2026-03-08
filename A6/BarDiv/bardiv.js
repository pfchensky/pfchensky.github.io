//set up the svg container
const svgWidth=700;
const svgHeight=500;
const margin={top:70,right:40,bottom:70,left:120};

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
  .text("Number of Athletes");

//Y-label
svg.append("text")
  .attr("class", "axis text")
  .attr("transform","rotate(-90)")
  .attr("text-anchor","middle")
  .attr("x", -svgHeight/2)
  .attr("y", margin.left/2-10)
  .text("Age Group");

// Chart title
svg.append("text")
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("x", svgWidth/2)
    .attr("y",30)
    .text("Olympic Athletes Age And Sex Distribution");

//read data and convert string to numeric
d3.csv("olympics.csv").then(function(data){
  data.forEach(function(d){
    d.age=+d.age;
  });
  
  const ageGroups = [
    "15-19", "20-24", "25-29", "30-34", "35-39", "40-44"
  ];
  
  function getAgeGroup(age) {
    if (age >= 15 && age <= 19) return "15-19";
    if (age >= 20 && age <= 24) return "20-24";
    if (age >= 25 && age <= 29) return "25-29";
    if (age >= 30 && age <= 34) return "30-34";
    if (age >= 35 && age <= 39) return "35-39";
    if (age >= 40 && age <= 44) return "40-44";
    return null;
  }
  const groupedData = ageGroups.map(group => {
    return {
      ageGroup: group,
      male: 0,
      female: 0
    };
  });

  data.forEach(function(d) {
    const group = getAgeGroup(d.age);
    if (group !== null) {
      const row = groupedData.find(g => g.ageGroup === group);
      if (d.sex === "M") row.male += 1;
      if (d.sex === "F") row.female += 1;
    }
  });

  // change male values negative for diverging chart
  groupedData.forEach(function(d) {
    d.male = -d.male;
  });

  //get max Count
  const maxCount = d3.max(groupedData, d => Math.max(Math.abs(d.male), d.female));

  // Define X and Y scales
  const scaleX = d3.scaleLinear()
    .domain([-15, 15])
    .range([0, width])

  const scaleY = d3.scaleBand()
    .domain(ageGroups)
    .range([0, height])
    .padding(0.15);

  //define color scales
  const divergingScale=d3.scaleDiverging()
    .domain([-12, 0, 12])
    .interpolator(d3.interpolateRdBu);

  // male bars
  chart.selectAll(".bar-male")
    .data(groupedData)
    .enter()
    .append("rect")
    .attr("class", "bar-male")
    .attr("x", d => scaleX(d.male))
    .attr("y", d => scaleY(d.ageGroup))
    .attr("width", d => scaleX(0) - scaleX(d.male))
    .attr("height", scaleY.bandwidth())
    .attr("fill", d => divergingScale(d.male));

  // female bars
  chart.selectAll(".bar-female")
    .data(groupedData)
    .enter()
    .append("rect")
    .attr("class", "bar-female")
    .attr("x", scaleX(0))
    .attr("y", d => scaleY(d.ageGroup))
    .attr("width", d => scaleX(d.female) - scaleX(0))
    .attr("height", scaleY.bandwidth())
    .attr("fill", d => divergingScale(d.female));

  // labels for male
  chart.selectAll(".label-male")
    .data(groupedData)
    .enter()
    .append("text")
    .attr("class", "label-male")
    .attr("x", d => scaleX(d.male) - 5)
    .attr("y", d => scaleY(d.ageGroup) + scaleY.bandwidth() / 2 + 4)
    .attr("text-anchor", "end")
    .attr("font-size", "12px")
    .text(d => Math.abs(d.male));

  // labels for female
  chart.selectAll(".label-female")
    .data(groupedData)
    .enter()
    .append("text")
    .attr("class", "label-female")
    .attr("x", d => scaleX(d.female) + 5)
    .attr("y", d => scaleY(d.ageGroup) + scaleY.bandwidth() / 2 + 4)
    .attr("text-anchor", "start")
    .attr("font-size", "12px")
    .text(d => d.female);
  
  // Add X and Y axes
  chart.append("g")
    .attr("class", "axis axis-x")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(scaleX).ticks(8).tickFormat(d=>Math.abs(d)));

  chart.append("g")
    .attr("class", "axis axis-y")
    .call(d3.axisLeft(scaleY));
  
  // center line at x = 0
  chart.append("line")
    .attr("x1", scaleX(0))
    .attr("x2", scaleX(0))
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  // side labels
  svg.append("text")
    .attr("x", margin.left + width * 0.25)
    .attr("y", 55)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .text("Male");

  svg.append("text")
    .attr("x", margin.left + width * 0.75)
    .attr("y", 55)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .text("Female");

  //Add legend with d3-svg-legend
  const legend = d3.legendColor()
    .scale(divergingScale)
    .shapeWidth(30)
    .orient("horizontal")
    .labelFormat(d3.format(".0f"))
    //.cells(7)
    .title("Male ← Count → Female");

  svg.append("g")
    .attr("class", "legendDiverging")
    .attr("transform", `translate(${svgWidth - 200}, 70)`)
  
  svg.select(".legendDiverging")
    .call(legend)
    .select(".legendTitle")
    .attr("y",12)
    .style("font-size","13px")
    
  svg.select(".legendDiverging")
    .selectAll("text")
    .style("font-size","14px");
})