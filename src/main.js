import '../css/style.css';

import { FIELD_HEIGHT, FIELD_WIDTH, REF_SPEED } from './Constants.js';

// Globals
let field;

function setup() {
  createCanvas(800, 600);
}

function draw() {
  background('#eeeeee');
}

// Shoot
function mousePressed() {}

// Spacebar to reload
function keyPressed() {
  if (key === ' ') {
    
  }
}

// init field. subscribe & unsubscribe
function init() {

}

window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
window.keyPressed = keyPressed;
