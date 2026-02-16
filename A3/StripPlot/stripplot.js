let margin=80;
let table;

function preload(){
  table=loadTable("height_weight.csv","csv","header");
}

function setup(){
  createCanvas(700,500);
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

  // draw y ticks
  drawYTicks(0, 160);

  // title
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  textStyle(BOLD);
  text("Olympics athletes Weight Distribution (Strip Plot)", width/2, margin/2);
  textStyle(NORMAL);
  textSize(12);

  // y label
  push();
  translate(30, height/2);
  rotate(-HALF_PI);
  text("Weight (kg)", 0, 0);
  pop();

  // draw strip points
  const xCenter = width / 2;
  const jitter = 60;

  noStroke();
  fill(60, 100, 160, 180);

  for(let i = 0; i < weights.length; i++){
    const y = map(weights[i], 0, 160, height - margin, margin);
    const x = xCenter + random(-jitter, jitter); 
    circle(x, y, 6);
  }
}

function drawYTicks(minV, maxV){
  const ticks = 8;
  textAlign(RIGHT, CENTER);
  fill(0);

  for(let i = 0; i <= ticks; i++){
    const v = map(i, 0, ticks, minV, maxV);
    const y = map(v, minV, maxV, height - margin, margin);

    stroke(0);
    line(margin - 6, y, margin, y);

    noStroke();
    text(v.toFixed(0), margin - 10, y);
  }
}