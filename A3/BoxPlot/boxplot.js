let margin=80;
let table;
const axisMin = 35;
const axisMax = 140;

function preload(){
  table=loadTable("height_weight.csv","csv","header");
}

function setup(){
  createCanvas(1000,500);
  background(250);
  noLoop();
}

function draw(){
  // draw coorinate
  stroke(0);
  line(margin, margin, margin, height - margin);              // y-axis
  line(margin, height - margin, width - margin, height - margin); // x-axis
  
  //get raw data
  let weights=[];
  for(let r=0;r<table.getRowCount();r++){
    let value=table.getNum(r,"weight");
    if(!isNaN(value)){
      weights.push(value);
    }
  }

  weights.sort((a, b) => a - b);
  const summary = fiveNumberSummary(weights);
  const minV = summary.min;
  const q1 = summary.q1;
  const med = summary.median;
  const q3 = summary.q3;
  const maxV = summary.max;
  
  //x-axis ticks
  drawXTicks(axisMin, axisMax);

  // labels
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  text("Weight (kg)", width / 2, height - 40);

  // title
  textSize(20);
  textStyle(BOLD);
  text("Olympics Athletes Weight Distribution (Boxplot)", width / 2, margin / 2);
  textStyle(NORMAL);
  textSize(12);

  // map to screen 
  const xMin = margin;
  const xMax = width - margin;

  const x_minV = map(minV, axisMin, axisMax, xMin, xMax);
  const x_q1   = map(q1,   axisMin, axisMax, xMin, xMax);
  const x_med  = map(med,  axisMin, axisMax, xMin, xMax);
  const x_q3   = map(q3,   axisMin, axisMax, xMin, xMax);
  const x_maxV = map(maxV, axisMin, axisMax, xMin, xMax);

  // boxplot
  const yCenter = height / 2;
  const boxH = 140;
  const whiskerH = 80;

  // whisker line (min to max)
  stroke(0);
  strokeWeight(2);
  line(x_minV, yCenter, x_maxV, yCenter);

  // whisker caps
  line(x_minV, yCenter - whiskerH / 2, x_minV, yCenter + whiskerH / 2);
  line(x_maxV, yCenter - whiskerH / 2, x_maxV, yCenter + whiskerH / 2);

  // box (Q1 to Q3)
  noStroke();
  fill(60, 100, 160);
  rectMode(CORNERS);
  rect(x_q1, yCenter - boxH / 2, x_q3, yCenter + boxH / 2);

  // median line
  stroke(0);
  strokeWeight(2);
  line(x_med, yCenter - boxH / 2, x_med, yCenter + boxH / 2);

  // min/Q1/median/Q3/max
  noStroke();
  fill(0);
  textAlign(CENTER, BOTTOM);
  text(`min: ${minV.toFixed(1)}`, x_minV, yCenter - boxH / 2 - 10);
  text(`Q1: ${q1.toFixed(1)}`, x_q1, yCenter - boxH / 2 - 10);
  text(`median: ${med.toFixed(1)}`, x_med, yCenter - boxH / 2 - 10);
  text(`Q3: ${q3.toFixed(1)}`, x_q3, yCenter - boxH / 2 - 10);
  text(`max: ${maxV.toFixed(1)}`, x_maxV, yCenter - boxH / 2 - 10);
}

function quantile(sorted, q) {
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  }
  return sorted[base];
}

function fiveNumberSummary(valuesSorted) {
  const min = valuesSorted[0];
  const max = valuesSorted[valuesSorted.length - 1];
  const q1 = quantile(valuesSorted, 0.25);
  const median = quantile(valuesSorted, 0.5);
  const q3 = quantile(valuesSorted, 0.75);
  return { min, q1, median, q3, max };
}

function drawXTicks(minV, maxV) {
  const ticks = 8;
  stroke(0);
  strokeWeight(1);
  fill(0);
  noStroke();
  textAlign(CENTER, TOP);

  for (let i = 0; i <= ticks; i++) {
    const v = map(i, 0, ticks, minV, maxV);
    const x = map(v, minV, maxV, margin, width - margin);

    stroke(0);
    line(x, height - margin, x, height - margin + 6);

    noStroke();
    text(v.toFixed(0), x, height - margin + 10);
  }
}