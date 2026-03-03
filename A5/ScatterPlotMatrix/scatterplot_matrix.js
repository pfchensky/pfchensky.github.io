const cellSize = 120;
const padding  = 20;

d3.csv("olympics.csv", d3.autoType).then(data => {
  //get coloum numbers 
  const cols = Object.keys(data[0]);
  const n = cols.length;
  const size = n * cellSize;

  const svg = d3.select("#splom")
    .append("svg")
    .attr("width",  size + padding)
    .attr("height", size + padding);

  const chart = svg.append("g")
    .attr("transform", `translate(${padding/2},${padding/2})`);

  // One linear scale per column
  const scales = {};
  cols.forEach(col => {
    scales[col] = d3.scaleLinear()
      .domain(d3.extent(data, d => d[col]))
      .nice()
      .range([4, cellSize - 4]);
  });

  // Draw one cell per (row, col) pair
  cols.forEach((yCol, row) => {
    cols.forEach((xCol, col) => {
      const g = chart.append("g")
        .attr("transform", `translate(${col * cellSize},${row * cellSize})`);

      // Cell border
      g.append("rect")
        .attr("width",  cellSize)
        .attr("height", cellSize)
        .attr("fill", "none")
        .attr("stroke", "#aaa");

      if (row === col) {
        // Diagonal: just show the variable name
        g.append("text")
          .attr("x", cellSize / 2)
          .attr("y", cellSize / 2)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("font-size", "18px")
          .text(xCol);
      } else {
        // Off-diagonal: scatter plot
        g.selectAll("circle")
          .data(data)
          .join("circle")
          .attr("cx", d => scales[xCol](d[xCol]))
          .attr("cy", d => scales[yCol](d[yCol]))  
          .attr("r", 2)
          .attr("fill", "blue")
          .attr("opacity", 0.7);
      }
    });
  });
});