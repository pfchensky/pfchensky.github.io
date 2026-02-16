let table;

let margin = 80;
let chartWidth;
let chartHeight;

//histogram setting 
let minAge = 15;
let maxAge = 60;
let binSize = 5;

//load data 
function preload() {
  table = loadTable("age.csv", "csv", "header");
}

function setup() {

  createCanvas(900, 520);
  background(250);
  chartWidth = width - margin * 2;
  chartHeight = height - margin * 2;
  noLoop();
}

function draw() {

  // draw coorinate
  stroke(0);
  line(margin, margin, margin, height - margin);              // y-axis
  line(margin, height - margin, width - margin, height - margin); // x-axis

  // faint grid lines
  stroke(200);     
  strokeWeight(1);

  // horizontal grid
  for (let i = 0; i <= 8; i++) {
    let y = map(i, 0, 8, height - margin, margin);
    line(margin, y, width - margin, y);
  }

  //get data 
  let ages = [];
  for (let r = 0; r < table.getRowCount(); r++) {
    let value = table.getNum(r, "age");
    if (!isNaN(value)) {      
      ages.push(value);
    }
  }
  let numBins = Math.floor((maxAge - minAge) / binSize); 
  let counts = new Array(numBins).fill(0);

  for (let a of ages) {
    if (a >= minAge && a < maxAge) {
      let idx = Math.floor((a - minAge) / binSize);
      counts[idx]++;
    } else if (a === maxAge) {
      counts[numBins - 1]++;
    }
  }

  // y-axis marks
  let ticks = 8;
  for (let i = 0; i <= ticks; i++) {
    let y = map(i, 0, ticks, height - margin, margin);
    let label = int(map(i, 0, ticks, 0, 80));
    
    stroke(0);
    line(margin - 5, y, margin, y); // tick mark

    noStroke();
    fill(0);
    textAlign(RIGHT, CENTER);
    text(label, margin - 10, y);
  }
  // x-axis ticks
  noStroke();
  fill(0);
  textAlign(CENTER, TOP);

  for (let xVal = minAge; xVal <= maxAge; xVal += binSize) {
    let x = map(xVal, minAge, maxAge, margin, width - margin);
    stroke(0);
    line(x, height - margin, x, height - margin + 5);

    noStroke();
    text(xVal, x, height - margin + 10);
  }
  // bars
  let barWidth = chartWidth / counts.length;

  for (let i = 0; i < counts.length; i++) {
    let barHeight = map(counts[i], 0, 80, 0, chartHeight);
    let x = margin + i * barWidth;
    let y = height - margin - barHeight;

    fill(70, 130, 180);
    stroke(0);
    rect(x, y, barWidth, barHeight);

    noStroke();
    fill(0);
    textAlign(CENTER, TOP);
    text(counts[i], x + (barWidth) / 2, y-20);
    stroke(0);

  }
  
  // chart title
  textAlign(CENTER);
  textSize(20);
  fill(0);
  text("Age Distribution of Olympic Athletes", width / 2, margin - 30);

  // axis labels
  noStroke();
  fill(0);
  textAlign(CENTER);
  textSize(14);

  // x-axis label
  text("ages", width / 2, height - 45);

  // y-axis label
  push();
  translate(20, height / 2);
  rotate(-HALF_PI);
  text("Counts", 0, 0);
  pop();
}