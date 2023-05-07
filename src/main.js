import '../css/style.css';

import { CANVAS_WIDTH,CANVAS_HEIGHT, FIELD_HEIGHT, FIELD_WIDTH, REF_SPEED } from './Constants.js';
import { Field } from './Field.js';
import { Building } from './Building.js';

// Globals
let field;

function setup() {
  createCanvas(CANVAS_WIDTH,CANVAS_HEIGHT);
  field = new Field();
  imageMode(CENTER);
}

function draw() {
  background('#eeeeee');
  field.draw();
}


function mousePressed() {
  field.insertBuilding(field.clickedLattice(mouseX, mouseY), new Building(field.clickedLattice(mouseX, mouseY), 'up') );
}


function mouseWheel(event) {
  field.magnify(event.deltaY);
}

function mouseDragged(event) {
  //console.log([event.movementX, event.movementY]);
  field.drag(event.movementX, event.movementY);
}



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
window.mouseWheel = mouseWheel;
window.mouseDragged = mouseDragged;