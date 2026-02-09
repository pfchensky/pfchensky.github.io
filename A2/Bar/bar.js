let table;

let margin = 80;
let chartWidth;
let chartHeight;

//load data 
function preload() {
  table = loadTable("artists.csv", "csv", "header");
}

function setup() {

  createCanvas(800, 500);
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

  //get data 
  let states = [];
  let values = [];

  for (let r = 0; r < table.getRowCount(); r++) {
    let value = table.getNum(r, "artists_n");
    if (!isNaN(value)) {      
      states.push(table.getString(r, "state"));
      values.push(value);
    }
  }

  // y-axis marks
  let ticks = 8;
  for (let i = 0; i <= ticks; i++) {
    let y = map(i, 0, ticks, height - margin, margin);
    let label = int(map(i, 0, ticks, 0, 4000));
    
    stroke(0);
    line(margin - 5, y, margin, y); // tick mark

    noStroke();
    fill(0);
    textAlign(RIGHT, CENTER);
    text(label, margin - 10, y);
  }

  // bars
  let barWidth = chartWidth / states.length;

  for (let i = 0; i < states.length; i++) {
    let barHeight = map(values[i], 0, 4000, 0, chartHeight);
    let x = margin + i * barWidth;
    let y = height - margin - barHeight;

    fill(100, 150, 240);
    rect(x, y, barWidth - 15, barHeight);

    noStroke();
    fill(0);
    textAlign(CENTER, TOP);
    text(values[i], x + (barWidth-15) / 2, y-20);
    stroke(0);


    noStroke();
    fill(0);
    textAlign(CENTER, TOP);
    text(states[i], x + (barWidth-15) / 2, height - margin + 5);
    stroke(0);
  }

  // axis labels
  noStroke();
  fill(0);
  textAlign(CENTER);
  textSize(14);

  // x-axis label
  text("States", width / 2, height - 45);

  // y-axis label
  push();
  translate(20, height / 2);
  rotate(-HALF_PI);
  text("Number of Artists", 0, 0);
  pop();
}