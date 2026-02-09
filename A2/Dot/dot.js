let margin=80;
let table;

function preload(){
  table=loadTable("artists.csv","csv","header");
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
  let states=[];
  let values=[];
  for(let r=0;r<table.getRowCount();r++){
    let value=table.getNum(r,"artists_n");
    if(!isNaN(value)){
      states.push(table.getString(r,"state"));
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
  
  let xPadding=40;
  for (let i = 0; i < states.length; i++) {

    let x = map(i, 0, states.length - 1, margin+xPadding, width - margin-xPadding);
    let y = map(values[i], 0, 4000, height - margin, margin);
    
    noStroke();
    fill(60, 100, 160);
    circle(x, y, 8);

    fill(0);
    textAlign(CENTER, BOTTOM);
    text(values[i], x, y -5);

    noStroke();
    fill(0);
    textAlign(CENTER, TOP);
    text(states[i], x, height - margin + 12);
  }

  // x-axis label
  text("States", width / 2, height - 45);

  // y-axis label
  push();
  translate(20, height / 2);
  rotate(-HALF_PI);
  text("Number of Artists", 0, 0);
  pop();
}