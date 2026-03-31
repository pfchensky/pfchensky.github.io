//set up the svg container
const svgWidth=300;
const svgHeight=300;
const margin={top:20,right:40,bottom:40,left:40};

const width=svgWidth-margin.left-margin.right;
const height=svgHeight-margin.top-margin.bottom;

const svg=d3.select("#nodelink_chart")
  .append("svg")
  .attr("width",svgWidth)
  .attr("height",svgHeight)

const chart=svg.append("g")
  .attr("transform",`translate(${margin.left},${margin.top})`);

// Chart title
svg.append("text")
  .attr("font-size", "18px")
  .attr("text-anchor", "middle")
  .attr("font-weight","bold")
  .attr("x", svgWidth/2)
  .attr("y",50)
  .text("Company Network");

//read data from csv file
Promise.all([
  d3.csv("fb-pages-company_nodes.csv"),
  d3.csv("fb-pages-company_edges.csv")
]).then(function([nodes,links]){
  
  //convert string to numeric
  nodes.forEach(function(d){
    d.new_id=+d.new_id;
  })
  
  //convert string to numeric
  links.forEach(function(d){
    d.source=+d.source;
    d.target=+d.target;
  })
  
  // draw links 
  const link= chart.selectAll(".link")
    .data(links)
    .enter()
    .append("line")
    .attr("class","link")
    .attr("stroke","black")
    .attr("stroke-opacity",0.6)
    .attr("stroke-width",1)

  //define a tooltip 
  const tooltip=d3.select("#tooltip")
  
  // draw nodes 
  const node= chart.selectAll(".node")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class","node")
    .attr("r", 6)
    .attr("fill", "blue")
    .on("mouseover", (event, d) =>{
      tooltip
        .html(`
          <strong>${d.name}</strong><br>
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
    })
    .call(d3.drag()
      .on("start",dragstarted)
      .on("drag",dragged)
      .on("end",dragended)
    );
  
  // create a simulation
  const simulation=d3.forceSimulation(nodes)
    .force("link",d3.forceLink(links)
      .id(d=>d.new_id)
      .distance(40)
    )
    .force("charge", d3.forceManyBody().strength(-40))
    .force("center", d3.forceCenter(width / 2, height / 2))

  // update position by each tick
  simulation.on("tick",function(){
    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
  })

  // drag helper functions
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
})