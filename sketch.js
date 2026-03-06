let massSlider;
let forceSlider;
let frictionSlider;

let startButton;
let pauseButton;
let resetButton;
let fullResetButton;

let position;
let velocity;

let running = false;

function setup() {
  createCanvas(800,300);

  // Sliders
  createP("Mass");
  massSlider = createSlider(1,10,5,0.1);

  createP("Force");
  forceSlider = createSlider(0,50,10,1);

  createP("Friction");
  frictionSlider = createSlider(0,1,0.1,0.01);

  // Buttons
  startButton = createButton("Start Simulation");
  startButton.mousePressed(startSimulation);

  pauseButton = createButton("Pause");
  pauseButton.mousePressed(pauseSimulation);

  resetButton = createButton("Reset Motion");
  resetButton.mousePressed(resetMotion);

  fullResetButton = createButton("Full Reset");
  fullResetButton.mousePressed(fullReset);

  // Initialize motion
  resetMotion();
}

function draw() {
  background(240);

  let mass = massSlider.value();
  let force = forceSlider.value();
  let friction = frictionSlider.value();

  if(running){
    // Physics calculations
    let frictionForce = velocity * friction;
    let netForce = force - frictionForce;

    let acceleration = netForce / mass;

    velocity += acceleration * 0.1;
    position += velocity;

    // Bounce logic for right wall
    if(position > width-50){
      position = width-50;
      if(abs(velocity) > 0.5){
        velocity *= -0.5; // bounce with damping
      } else {
        velocity = 0;
      }
    }

    // Bounce logic for left wall
    if(position < 0){
      position = 0;
      if(abs(velocity) > 0.5){
        velocity *= -0.5;
      } else {
        velocity = 0;
      }
    }

    // Stop tiny sliding in general
    if(abs(velocity) < 0.01){
      velocity = 0;
    }
  }

  // Ground
  stroke(0);
  strokeWeight(1);
  line(0,200,width,200);

  // Object
  fill(150);
  rect(position,175,50,25);

  // Draw arrows and labels
  drawForces(force, friction);
  drawVelocity();

  // Labels
  fill(0);
  textSize(14);
  text("Mass: " + mass,600,40);
  text("Force: " + force,600,60);
  text("Friction: " + friction,600,80);
  text("Velocity: " + velocity.toFixed(2),600,100);
}

function drawForces(force, friction){
  let frictionForce = velocity * friction;
  let boxCenter = position + 25;
  let y = 150;

  textSize(14);
  fill(0);

  // Applied Force (blue)
  stroke(0,0,255);
  strokeWeight(3);
  let appliedEnd = boxCenter + force*2;
  line(boxCenter, y, appliedEnd, y);
  // Arrowhead
  triangle(appliedEnd, y, appliedEnd-10, y-5, appliedEnd-10, y+5);
  noStroke();
  fill(0);
  text("Applied Force", appliedEnd + 5, y + 5);

  // Friction (red)
  stroke(255,0,0);
  strokeWeight(3);
  let frictionEnd = boxCenter - frictionForce*20;
  line(boxCenter, y+25, frictionEnd, y+25);
  // Arrowhead
  triangle(frictionEnd, y+25, frictionEnd+10, y+20, frictionEnd+10, y+30);
  noStroke();
  fill(0);
  text("Friction", frictionEnd - 60, y + 30);
}

function drawVelocity(){
  let boxCenter = position + 25;
  stroke(0,200,0);
  strokeWeight(3);
  let velocityEnd = boxCenter + velocity*10;
  line(boxCenter,125,velocityEnd,125);
  // Arrowhead
  triangle(velocityEnd,125,velocityEnd-10,120,velocityEnd-10,130);
  noStroke();
  fill(0);
  textSize(14);
  text("Velocity", velocityEnd + 5,125);
}

// Button functions
function startSimulation(){
  running = true;
}

function pauseSimulation(){
  running = false;
  if(abs(velocity) < 0.01){
    velocity = 0;
  }
}

function resetMotion(){
  running = false;
  position = 50;
  velocity = 0;
}

function fullReset(){
  massSlider.value(5);
  forceSlider.value(10);
  frictionSlider.value(0.1);
  resetMotion();
}