//set up the svg container
const svgWidth=500;
const svgHeight=500;
const margin={top:190,right:30,bottom:30,left:190};

const width=svgWidth-margin.left-margin.right;
const height=svgHeight-margin.top-margin.bottom;

const svg=d3.select("#adjmatrix_chart")
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
  .attr("x", svgWidth/2+60)
  .attr("y",20)
  .text("Company Network");

//read data 
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
  
  // create a set to store node relationship
  const linked = new Set();

  links.forEach(d => {
    linked.add(`${d.source},${d.target}`);
    linked.add(`${d.target},${d.source}`);
  });

  // Define a matrix to store each cell values 
  const matrix=[];
  
  nodes.forEach(function(rowNode, row) {
    nodes.forEach(function(colNode, col) {
      matrix.push({
        row: row,
        col: col,
        source: rowNode,
        target: colNode,
        value: linked.has(`${rowNode.new_id},${colNode.new_id}`) ? 1 : 0
      });
    });
  });

  //Define X scale
  const scaleX = d3.scaleBand()
    .domain(d3.range(nodes.length))
    .range([0, width])
  
  //Define Y scale 
  const scaleY = d3.scaleBand()
    .domain(d3.range(nodes.length))
    .range([0, height])
  
  // row labels
  chart.selectAll(".row-label")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "row-label")
    .attr("x", -8)
    .attr("y", (d, i) => scaleY(i) + scaleY.bandwidth() / 2)
    .attr("text-anchor", "end")
    .attr("font-size", "10px")
    .text(d => d.name);

  // column labels
  chart.selectAll(".col-label")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "col-label")
    .attr("x", (d, i) => scaleX(i) + scaleX.bandwidth() / 2)
    .attr("y", -8)
    .attr("text-anchor", "start")
    .attr("transform", (d, i) => {
      const x = scaleX(i) + scaleX.bandwidth() / 2;
      return `rotate(-90, ${x}, -8)`;
    })
    .attr("font-size", "10px")
    .text(d => d.name);
  
  //Define tooltip
  const tooltip=d3.select("#tooltip")

  // draw matrix cells
  chart.selectAll(".cell")
    .data(matrix)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("x", d => scaleX(d.col))
    .attr("y", d => scaleY(d.row))
    .attr("width", scaleX.bandwidth())
    .attr("height", scaleY.bandwidth())
    .attr("fill", d => d.value === 1 ? "blue" : "white")
    .attr("stroke", "gray")
    .on("mouseover", (event, d)=> {
      tooltip
        .html(`
          <strong>Row:</strong> ${d.source.name}<br>
          <strong>Column:</strong> ${d.target.name}<br>
          <strong>Connected:</strong> ${d.value === 1 ? "Yes" : "No"}
        `)
        .style("opacity", 1);
    })
    .on("mousemove", (event)=> {
      tooltip
        .style("left", (event.pageX + 12) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseleave", ()=> {
      tooltip.style("opacity", 0);
    });
})