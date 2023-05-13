import '../css/style.css';

import { FRAME_RATE, CANVAS_WIDTH,CANVAS_HEIGHT, BUILDING_MODE, DIR_VEC, FIELD_HEIGHT, FIELD_WIDTH, REF_SPEED } from './Constants.js';
import { Field } from './Field.js';
import { Belt} from './Building.js';
import { Element} from './Element.js';

// Globals
let field;
let elemtest;
let noErase = 1;
let canEdit = 1;
const dirArray = ['up', 'right', 'down', 'left'];
let dirInIndex = 0;
let buildingtype= 1;


//let stretchy;



function setup() {
  createCanvas(CANVAS_WIDTH,CANVAS_HEIGHT);
  frameRate(FRAME_RATE);
  field = new Field();
  imageMode(CENTER);
}

function draw() {
  background('#eeeeee');
  field.draw();
}


function mouseWheel(event) {
  field.magnify(event.deltaY);
}

function isInCanvas(mX, mY){
  if (mX>=0 && mX<=width){
    if (mY>=0 && mY<=height){return true};
  }
}

let tempLattice
let dirOut
let dirIn
function mousePressed() {
  if (canEdit && isInCanvas(mouseX, mouseY)){
    let [n, m] = field.clickedLattice(mouseX, mouseY);
    if (noErase){
      //Add building
      //basic direction (starting point)
      //console.log(dirArray[dirInIndex]);
      field.deleteBuilding([n, m]);
      let newBuilding = new Belt([n, m], [dirArray[dirInIndex], dirArray[dirInIndex]])
      field.insertBuilding(newBuilding.lattice,  newBuilding); 
    }
    else {field.deleteBuilding([n, m]);}
    tempLattice = [n, m];
  }
  dirIn = dirArray[dirInIndex];
}

function vectorSum([a, b], [c, d]) {return [a+c, b+d]};

function mouseDragged(event) {
  //console.log([event.movementX, event.movementY]);
  if (canEdit && isInCanvas(mouseX, mouseY)){
    let nowLattice = field.clickedLattice(mouseX, mouseY)
    let diffLattice = [nowLattice[0]-tempLattice[0], nowLattice[1]-tempLattice[1]]
    
    if (buildingtype=BUILDING_MODE['belt']){
      if (abs(diffLattice[0])+abs(diffLattice[1])) {
        if (abs(diffLattice[0])) (diffLattice[0]>0)?(dirOut='right'):(dirOut='left');
        else if (abs(diffLattice[1])) (diffLattice[1]>0)?(dirOut='up'):(dirOut='down');
        let newBuilding;
        field.deleteBuilding(tempLattice);
        field.deleteBuilding(nowLattice);
        try{
          newBuilding = new Belt(tempLattice, [dirIn, dirOut])
          field.insertBuilding(tempLattice,  newBuilding); 
        }catch(event){
          if(event=='comeback error'){
            dirIn=dirOut;
            console.log('asdfsdf')
            newBuilding = new Belt(tempLattice, [dirOut, dirOut])
            field.insertBuilding(tempLattice,  newBuilding); 
          };
        }
        newBuilding = new Belt(nowLattice, [dirOut, dirOut])
        field.insertBuilding(nowLattice,  newBuilding);  
        dirIn = dirOut;
        tempLattice=nowLattice;

      }
    }
  } 
  else {field.drag(event.movementX, event.movementY);}
}


/*
window.addEventListener('keydown', (event) => {
  const key = event.key
  if (key === ' ' ) {canEdit = false}
})
*/
window.addEventListener('keyup', (event) => {
  const key = event.key
  if (key === ' ' ) {canEdit = true}
})

// Spacebar to reload
function keyPressed() {
  if (key === ' ') {
    canEdit = false; 
  }
  if (key === 'e' || key === 'E') {
    console.log("editability changed")
    noErase = !noErase;
  }
  if (key === 'r' || key === 'R') {
    console.log("rotate building CW");
    (dirInIndex>=3)?(dirInIndex=0) : (dirInIndex++);
    //console.log(dirInIndex);
  }
  if (key === '1' || key === 'b'|| key === 'B') {
    console.log("Building mode: Belt");
    buildingtype=BUILDING_MODE['belt'];
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