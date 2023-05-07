import '../css/style.css';

import { CANVAS_WIDTH,CANVAS_HEIGHT, FIELD_HEIGHT, FIELD_WIDTH, REF_SPEED } from './Constants.js';
import { Field } from './Field.js';
import { Building } from './Building.js';

// Globals
let field;
let canErase = 1;
let Buildingtype;

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
  let [n, m] = field.clickedLattice(mouseX, mouseY);
  if (canErase){
    let newBuilding = new Building([n, m], 'up')
    field.insertBuilding(newBuilding.lattice,  newBuilding); 
  }
  else {field.insertBuilding([n, m],  0);}
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
  if (key === 'e' || key === 'E') {
    console.log("editability changed")
    canErase = !canErase;
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