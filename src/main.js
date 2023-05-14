import '../css/style.css';

import { FRAME_RATE, CANVAS_WIDTH,CANVAS_HEIGHT, BUILDING_MODE, DIR_LATTICE, FIELD_HEIGHT, FIELD_WIDTH, REF_SPEED } from './Constants.js';
import { Field } from './Field.js';
import { Belt} from './Building.js';
import { Miner, Rotater} from './Etcbuilding.js';
import {Counterpart, Cutter, Balancer, Painter} from './Dualbuilding.js';
import { Element} from './Element.js';

// Globals
let field;
let elemtest;
let noErase = 1;
let canEdit = 1;
const dirArray = ['up', 'right', 'down', 'left'];
let dirInIndex = 0;
let buildingtype = 1;


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

  noStroke()

  fill(100)
  textSize(height/20 );
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  //console.log('adsfadsfds')
  let quote = ""
  if (canEdit ==false){
    quote = "Dragging"
  }
  else if (noErase == false){
    quote = "Erasing mode"
  }
  else{
    let buildingName=getKeyByValue(BUILDING_MODE, buildingtype);
    buildingName = buildingName.charAt(0).toUpperCase() + buildingName.slice(1);
    quote = `Building : ${buildingName}, ${dirArray[dirInIndex]}`
  }


  text(quote, width/2, height-height/20)

}


function getKeyByValue(obj, value) {return Object.keys(obj).find(key => obj[key] === value);}


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
//Ore test
//let oreIndex = 0;
function mousePressed() {
  let newBuilding;
  let newCounter;
  let [n, m] = field.clickedLattice(mouseX, mouseY);
  //console.log(field.buildings[field.nmIntoIndex([n, m])].invincible);
  if ((abs(n)>=2||abs(m)>=2)&& canEdit && isInCanvas(mouseX, mouseY)){
    if (noErase){
      //Add building
      //basic direction (starting point)
      //console.log(dirArray[dirInIndex]);
      field.deleteBuilding([n, m]);
      let dirIn = dirArray[dirInIndex];
      if (buildingtype==BUILDING_MODE['belt']){
        newBuilding = new Belt([n, m], [dirIn, dirIn])
      }
      else if (buildingtype==BUILDING_MODE['miner']){
        //console.log('asdf')
        newBuilding = new Miner([n, m], [dirIn, dirIn], field.Ores[field.nmIntoIndex([n, m])])
      }
      else if (buildingtype==BUILDING_MODE['cutter']){
        //console.log('asdf')
        console.log(DIR_LATTICE[dirIn]);
        //console.log([DIR_LATTICE[dirIn][1], -DIR_LATTICE[dirIn][0] ]);
        newBuilding = new Cutter([n, m], [dirIn, dirIn], [n+DIR_LATTICE[dirIn][1], m-DIR_LATTICE[dirIn][0] ])
        newCounter = new Counterpart([n+DIR_LATTICE[dirIn][1], m-DIR_LATTICE[dirIn][0] ], [dirIn, dirIn], [n, m])
        newCounter.inletOK = false;
      }
      else if (buildingtype==BUILDING_MODE['balancer']){
        //console.log('asdf')
        console.log(DIR_LATTICE[dirIn]);
        //console.log([DIR_LATTICE[dirIn][1], -DIR_LATTICE[dirIn][0] ]);
        newBuilding = new Balancer([n, m], [dirIn, dirIn], [n+DIR_LATTICE[dirIn][1], m-DIR_LATTICE[dirIn][0] ])
        newCounter = new Counterpart([n+DIR_LATTICE[dirIn][1], m-DIR_LATTICE[dirIn][0] ], [dirIn, dirIn], [n, m])
        newCounter.inletOK = true;
      }
      else if (buildingtype==BUILDING_MODE['rotater']){
        newBuilding = new Rotater([n, m], [dirIn, dirIn])
      }
      else if (buildingtype==BUILDING_MODE['painter']){
        //console.log('asdf')
        console.log(DIR_LATTICE[dirIn]);
        //console.log([DIR_LATTICE[dirIn][1], -DIR_LATTICE[dirIn][0] ]);
        newBuilding = new Painter([n, m], [dirIn, dirIn], [n+DIR_LATTICE[dirIn][0], m+DIR_LATTICE[dirIn][1] ])
        let dirChanger = {up:'right' , right: 'down', down:'left', left:'up'}
        newCounter = new Counterpart([n+DIR_LATTICE[dirIn][0], m+DIR_LATTICE[dirIn][1] ], [dirChanger[dirIn], dirChanger[dirIn]], [n, m])
        newCounter.inletOK = true;
      }



      field.insertBuilding(newBuilding.lattice,  newBuilding); 
      if (newCounter){field.insertBuilding(newCounter.lattice,  newCounter); }
    }
    else {
      field.deleteBuilding([n, m]);
      //For Ore test
      //Each ore will be: C, R, W, S, r, g, b
      //field.insertOre([n, m], ['C', 'R', 'W', 'S', 'r', 'g', 'b'][oreIndex])
    }
    tempLattice = [n, m];
  }
  dirIn = dirArray[dirInIndex];
}

function vectorSum([a, b], [c, d]) {return [a+c, b+d]};

function mouseDragged(event) {
  //console.log([event.movementX, event.movementY]);
  let nowLattice = field.clickedLattice(mouseX, mouseY)
  if(!canEdit) {field.drag(event.movementX, event.movementY);}
  else if ((abs(nowLattice[0])>=2||abs(nowLattice[1])>=2) && noErase && isInCanvas(mouseX, mouseY)){
    if (!tempLattice){
      tempLattice = nowLattice;
    }
    let diffLattice = [nowLattice[0]-tempLattice[0], nowLattice[1]-tempLattice[1]]
    let newBuilding;

    if (buildingtype==BUILDING_MODE['belt']){
      if (abs(diffLattice[0])+abs(diffLattice[1])) {
        if (abs(diffLattice[0])) (diffLattice[0]>0)?(dirOut='right'):(dirOut='left');
        else if (abs(diffLattice[1])) (diffLattice[1]>0)?(dirOut='up'):(dirOut='down');
        
        field.deleteBuilding(tempLattice);
        try{
          newBuilding = new Belt(tempLattice, [dirIn, dirOut])
          field.insertBuilding(tempLattice,  newBuilding); 
        }catch(event){
          if(event=='comeback error'){
            dirIn=dirOut;
            newBuilding = new Belt(tempLattice, [dirOut, dirOut])
            field.insertBuilding(tempLattice,  newBuilding); 
          };
        }
        newBuilding = new Belt(nowLattice, [dirOut, dirOut])
        if (abs(nowLattice[0])>=2||abs(nowLattice[1])>=2){
          field.deleteBuilding(nowLattice);
          field.insertBuilding(nowLattice,  newBuilding);  
        }
        dirIn = dirOut;
        tempLattice=nowLattice;

      }
    }
  }
  else if((abs(nowLattice[0])>=2||abs(nowLattice[1])>=2) && isInCanvas(mouseX, mouseY)) {
    field.deleteBuilding(tempLattice);
    field.deleteBuilding(nowLattice);
    tempLattice=nowLattice;
  }
  //else if (canEdit && (abs(nowLattice[0])<=2&&abs(nowLattice[1])<=2)){
 
  //}
  
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
  if (key === '2') {
    console.log("Building mode: Miner");
    buildingtype=BUILDING_MODE['miner'];
    //console.log(buildingtype);
  }
  if (key === '3') {
    console.log("Building mode: Cutter");
    buildingtype=BUILDING_MODE['cutter'];
    //console.log(buildingtype);
  }
  if (key === '4') {
    console.log("Building mode: Rotater");
    buildingtype=BUILDING_MODE['rotater'];
  }
  if (key === '5') {
    console.log("Building mode: Balancer");
    buildingtype=BUILDING_MODE['balancer'];
  }
  if (key === '6') {
    console.log("Building mode: Painter");
    buildingtype=BUILDING_MODE['painter'];
  }
  //Ore test
  /*
  if (key === ']') {
    (oreIndex<6)?(oreIndex += 1):(oreIndex=0);
    console.log(`Ore placing ${['C', 'R', 'W', 'S', 'r', 'g', 'b'][oreIndex]}`);
  }
  if (key === '=') {
    field.saveOreList()
    console.log(`Saving OreList`);
  }
  */
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