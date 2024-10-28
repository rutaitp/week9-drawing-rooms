console.log('The page is working!');

//STEP 4. Client socket setup
let socket = io();
let r;
let g;
let b;
let size;

//STEP 4.1 Log client socket connection
socket.on('connect', () => {
  console.log('Connected');
});

//Step 8. Listen for data and do something with it
socket.on('data', (data) => {
  // console.log(data);

  //draw ellipses
  fill(data.r, data.g, data.b);
  noStroke();
  ellipse(data.x, data.y, data.size);
});

//listen for color change and update color
socket.on('colorChange', () => {
  r = random(255);
  g = random(255);
  b = random(255);
});

//STEP 1. p5 setup
function setup(){
  createCanvas(windowWidth, windowHeight);
  background(255);

  r = random(255);
  g = random(255);
  b = random(255);
  size = random(50);
}

function mouseMoved(){

  //STEP 5. Emit the data
  let mousePos = {
    x: mouseX,
    y: mouseY,
    r: r,
    g: g,
    b: b,
    size: size
  }

  socket.emit('data', mousePos);
}

//Step 10. Change color on mouse click
function mousePressed(){
  //send evend trigger to server
  socket.emit('colorChange');
}
