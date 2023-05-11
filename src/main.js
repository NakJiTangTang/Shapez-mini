import '../css/style.css';

import { CANVAS_WIDTH,CANVAS_HEIGHT, BUILDING_MODE, DIR_VEC, FIELD_HEIGHT, FIELD_WIDTH, REF_SPEED } from './Constants.js';
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
  field = new Field();
  imageMode(CENTER);
  /*
  stretchy = new Sprite();
	
	stretchy.draw = () => {
		fill(237, 205, 0);

		push();
		rotate(stretchy.direction);
		ellipse(0, 0, 100 + stretchy.speed, 100 - stretchy.speed);
		pop();
	};

	stretchy.update = () => {
		stretchy.moveTowards(mouse, 0.07);
	};
  */
 elemtest = new Element([0,0,0,0]);
}

function draw() {
  background('#eeeeee');
  field.draw();
}


function mouseWheel(event) {
  field.magnify(event.deltaY);
}


let dirOut
let dirIn
function mousePressed() {
  if (canEdit){
    let [n, m] = field.clickedLattice(mouseX, mouseY);
    if (noErase){
      //Add building

      //basic direction (starting point)
      console.log(dirArray[dirInIndex]);
      let newBuilding = new Belt([n, m], [dirArray[dirInIndex], dirArray[dirInIndex]])
      field.insertBuilding(newBuilding.lattice,  newBuilding); 
    }
    else {field.insertBuilding([n, m],  0);}
    tempLattice = [n, m];
  }
  dirIn = dirArray[dirInIndex];
}

function vectorSum([a, b], [c, d]) {return [a+c, b+d]};

function mouseDragged(event) {
  //console.log([event.movementX, event.movementY]);
  if (canEdit){
    let nowLattice = field.clickedLattice(mouseX, mouseY)
    let diffLattice = [nowLattice[0]-tempLattice[0], nowLattice[1]-tempLattice[1]]
    if (buildingtype=BUILDING_MODE['belt']){
      if (abs(diffLattice[0])+abs(diffLattice[1])) {
        if (abs(diffLattice[0])) (diffLattice[0]>0)?(dirOut='right'):(dirOut='left');
        else if (abs(diffLattice[1])) (diffLattice[1]>0)?(dirOut='up'):(dirOut='down');
        let newBuilding;
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



window.addEventListener('keydown', (event) => {
  const key = event.key
  if (key === ' ' ) {canEdit = false}
})
window.addEventListener('keyup', (event) => {
  const key = event.key
  if (key === ' ' ) {canEdit = true}
})

// Spacebar to reload
function keyPressed() {
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