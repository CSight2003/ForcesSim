let massSlider, forceSlider, frictionSlider;
let massInput, forceInput, frictionInput;

let startButton;
let pauseButton;
let resetButton;
let fullResetButton;

let position;
let velocity;

let running = false;

function setup() {
  createCanvas(800,300);

  // MASS
  createP("Mass");
  massSlider = createSlider(1,10,5,0.1);
  massInput = createInput("5");
  massInput.attribute("type","number");
  massInput.attribute("min","1");
  massInput.attribute("step","0.1");

  massSlider.input(()=> massInput.value(massSlider.value()));
  massInput.input(updateMass);

  // FORCE
  createP("Force");
  forceSlider = createSlider(0,50,10,1);
  forceInput = createInput("10");
  forceInput.attribute("type","number");
  forceInput.attribute("min","0");

  forceSlider.input(()=> forceInput.value(forceSlider.value()));
  forceInput.input(updateForce);

  // FRICTION
  createP("Friction");
  frictionSlider = createSlider(0,1,0.1,0.01);
  frictionInput = createInput("0.1");
  frictionInput.attribute("type","number");
  frictionInput.attribute("min","0");
  frictionInput.attribute("max","1");
  frictionInput.attribute("step","0.01");

  frictionSlider.input(()=> frictionInput.value(frictionSlider.value()));
  frictionInput.input(updateFriction);

  // Buttons
  startButton = createButton("Start Simulation");
  startButton.mousePressed(startSimulation);

  pauseButton = createButton("Pause");
  pauseButton.mousePressed(pauseSimulation);

  resetButton = createButton("Reset Motion");
  resetButton.mousePressed(resetMotion);

  fullResetButton = createButton("Full Reset");
  fullResetButton.mousePressed(fullReset);

  resetMotion();
}

function draw() {
  background(240);

  let mass = massSlider.value();
  let force = forceSlider.value();
  let friction = frictionSlider.value();

  if(running){
    let frictionForce = velocity * friction;
    let netForce = force - frictionForce;

    let acceleration = netForce / mass;

    velocity += acceleration * 0.1;
    position += velocity;

    if(position > width-50){
      position = width-50;
      if(abs(velocity) > 0.5){
        velocity *= -0.5;
      } else {
        velocity = 0;
      }
    }

    if(position < 0){
      position = 0;
      if(abs(velocity) > 0.5){
        velocity *= -0.5;
      } else {
        velocity = 0;
      }
    }

    if(abs(velocity) < 0.01){
      velocity = 0;
    }
  }

  stroke(0);
  line(0,200,width,200);

  fill(150);
  rect(position,175,50,25);

  drawForces(force, friction);
  drawVelocity();

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

  stroke(0,0,255);
  strokeWeight(3);
  let appliedEnd = boxCenter + force*2;
  line(boxCenter, y, appliedEnd, y);
  triangle(appliedEnd, y, appliedEnd-10, y-5, appliedEnd-10, y+5);

  noStroke();
  fill(0);
  text("Applied Force", appliedEnd + 5, y + 5);

  stroke(255,0,0);
  strokeWeight(3);
  let frictionEnd = boxCenter - frictionForce*20;
  line(boxCenter, y+25, frictionEnd, y+25);
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
  triangle(velocityEnd,125,velocityEnd-10,120,velocityEnd-10,130);

  noStroke();
  fill(0);
  text("Velocity", velocityEnd + 5,125);
}


// INPUT VALIDATION FUNCTIONS

function updateMass(){
  let v = parseFloat(massInput.value());
  v = constrain(v,1,10);
  massSlider.value(v);
  massInput.value(v);
}

function updateForce(){
  let v = parseFloat(forceInput.value());
  v = constrain(v,0,50);
  forceSlider.value(v);
  forceInput.value(v);
}

function updateFriction(){
  let v = parseFloat(frictionInput.value());
  v = constrain(v,0,1);
  frictionSlider.value(v);
  frictionInput.value(v);
}


// BUTTONS

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

  massInput.value(5);
  forceInput.value(10);
  frictionInput.value(0.1);

  resetMotion();
}
