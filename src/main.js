import '../css/style.css';

import { CANVAS_WIDTH,CANVAS_HEIGHT, FIELD_HEIGHT, FIELD_WIDTH, REF_SPEED } from './Constants.js';
import { Field } from './Field.js';
import { Building } from './Building.js';

// Globals
let field;
let canErase = 1;
let canEdit = 1;
let Buildingtype;

let tempLattice;
const DIR_VEC = ['up', 'right', 'down', 'left'];
let dir_index = 0;


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
  if (canEdit){
    let [n, m] = field.clickedLattice(mouseX, mouseY);
    if (canErase){
      //Add building
      let newBuilding = new Building([n, m], [DIR_VEC[dir_index], DIR_VEC[dir_index]])
      field.insertBuilding(newBuilding.lattice,  newBuilding); 
    }
    else {field.insertBuilding([n, m],  0);}
    tempLattice = [n, m];
  }
  
}



function mouseWheel(event) {
  field.magnify(event.deltaY);
}

function mouseDragged(event) {
  //console.log([event.movementX, event.movementY]);
  if (canEdit){

  } 
  else {field.drag(event.movementX, event.movementY);}
}



window.addEventListener('keydown', (event) => {
  const key = event.key
  if (key === ' ' ) {canEdit = false}
  else{canEdit = true};
})


// Spacebar to reload
function keyPressed() {
  if (key === 'e' || key === 'E') {
    console.log("editability changed")
    canErase = !canErase;
  }
  if (key === 'r' || key === 'R') {
    console.log("Direction changed by CW 90 degree")
    dir_index = (dir_index<3)? (dir_index+1) : 0;
    //console.log(dir_index);
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