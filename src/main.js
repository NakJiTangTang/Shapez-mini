import '../css/style.css';

import { FRAME_RATE, BUILDING_MODE, DIR_LATTICE} from './Constants.js';
import { Field } from './Field.js';
import { Belt} from './Building.js';
import { Miner, Rotater} from './Etcbuilding.js';
import {Counterpart, Cutter, Balancer, Painter, Stacker} from './Dualbuilding.js';

// Globals
let field;
let noErase = 0;
let canEdit = 1;
const dirArray = ['up', 'right', 'down', 'left'];
let dirInIndex = 0;
let buildingtype = 1;

const tuto_URL =  '../elem/Tutorial.png'
let tutopromise
let tuto_img

function setup() {
  //createCanvas(CANVAS_WIDTH,CANVAS_HEIGHT);
  createCanvas(windowWidth, windowHeight);
  tutopromise = new Promise ((resolve, reject)=>{
    try{loadImage(tuto_URL, (loadedImage) => {
      resolve(loadedImage);});
    }catch (err) {reject("No images?")}})
  frameRate(FRAME_RATE);
  field = new Field();
  imageMode(CENTER);
}



function draw() {
  tutopromise.then((loadImg)=>{
    tuto_img = loadImg
  }).catch((result)=>{
    console.log(result)
  })

  background('#eeeeee');
  field.draw();
  noStroke()
  fill(100)
  textSize(height/20 );
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  let quote = ""
  if (canEdit ==false){
    quote = "Dragging"
  }else if (noErase == false){
    quote = "Erasing mode"
  }else{
    let buildingName=getKeyByValue(BUILDING_MODE, buildingtype);
    buildingName = buildingName.charAt(0).toUpperCase() + buildingName.slice(1);
    quote = `Building : ${buildingName}, ${dirArray[dirInIndex]}`
  }
  text(quote, width/2, height-height/20)
  if (tuto_img){
    let tutoW = width/2.5;
    let tutoH = tutoW*tuto_img.height/tuto_img.width;
    image(tuto_img, width-tutoW/2 , tutoH/2, tutoW, tutoH)
  }
}


function getKeyByValue(obj, value) {return Object.keys(obj).find(key => obj[key] === value);}

function mouseWheel(event) {field.magnify(event.deltaY);}

function isInCanvas(mX, mY){
  if (mX>=0 && mX<=width){
    if (mY>=0 && mY<=height){return true};
  }
}

let tempLattice
let dirOut
let dirIn

function mousePressed() {
  let newBuilding;
  let newCounter;
  let [n, m] = field.clickedLattice(mouseX, mouseY);
  if ((abs(n)>=2||abs(m)>=2)&& canEdit && isInCanvas(mouseX, mouseY)){
    if (noErase){
      //Initializing field @ that location
      field.deleteBuilding([n, m]);
      //Add building
      let dirIn = dirArray[dirInIndex];
      if (buildingtype==BUILDING_MODE['belt']){
        newBuilding = new Belt([n, m], [dirIn, dirIn])
      }
      else if (buildingtype==BUILDING_MODE['miner']){
        newBuilding = new Miner([n, m], [dirIn, dirIn], field.Ores[field.nmIntoIndex([n, m])])
      }
      else if (buildingtype==BUILDING_MODE['cutter']){
        newBuilding = new Cutter([n, m], [dirIn, dirIn], [n+DIR_LATTICE[dirIn][1], m-DIR_LATTICE[dirIn][0] ])
        newCounter = new Counterpart([n+DIR_LATTICE[dirIn][1], m-DIR_LATTICE[dirIn][0] ], [dirIn, dirIn], [n, m])
        newCounter.inletOK = false;
      }
      else if (buildingtype==BUILDING_MODE['balancer']){
        newBuilding = new Balancer([n, m], [dirIn, dirIn], [n+DIR_LATTICE[dirIn][1], m-DIR_LATTICE[dirIn][0] ])
        newCounter = new Counterpart([n+DIR_LATTICE[dirIn][1], m-DIR_LATTICE[dirIn][0] ], [dirIn, dirIn], [n, m])
        newCounter.inletOK = true;
      }
      else if (buildingtype==BUILDING_MODE['rotater']){
        newBuilding = new Rotater([n, m], [dirIn, dirIn])
      }
      else if (buildingtype==BUILDING_MODE['painter']){
        console.log(DIR_LATTICE[dirIn]);
        newBuilding = new Painter([n, m], [dirIn, dirIn], [n+DIR_LATTICE[dirIn][0], m+DIR_LATTICE[dirIn][1] ])
        let dirChanger = {up:'right' , right: 'down', down:'left', left:'up'}
        newCounter = new Counterpart([n+DIR_LATTICE[dirIn][0], m+DIR_LATTICE[dirIn][1] ], [dirChanger[dirIn], dirChanger[dirIn]], [n, m])
        newCounter.inletOK = true;
      }
      else if (buildingtype==BUILDING_MODE['stacker']){
        console.log(DIR_LATTICE[dirIn]);
        newBuilding = new Stacker([n, m], [dirIn, dirIn], [n+DIR_LATTICE[dirIn][1], m-DIR_LATTICE[dirIn][0] ])
        newCounter = new Counterpart([n+DIR_LATTICE[dirIn][1], m-DIR_LATTICE[dirIn][0] ], [dirIn, dirIn], [n, m])
        newCounter.inletOK = true;
      }

      field.deleteBuilding(newBuilding.lattice); 
      field.insertBuilding(newBuilding.lattice,  newBuilding); 
      if (newCounter){
        field.deleteBuilding(newCounter.lattice); 
        field.insertBuilding(newCounter.lattice,  newCounter); }
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

function mouseDragged(event) {
  let nowLattice = field.clickedLattice(mouseX, mouseY)
  if (!tempLattice){
    tempLattice = nowLattice;
  }
  if(!canEdit) {field.drag(event.movementX, event.movementY);}
  
  else if (noErase && isInCanvas(mouseX, mouseY)){
    
    let diffLattice = [nowLattice[0]-tempLattice[0], nowLattice[1]-tempLattice[1]]
    let newBuilding;

    if (buildingtype==BUILDING_MODE['belt'] && (abs(tempLattice[0])>=2||abs(tempLattice[1])>=2) ){
      if (abs(diffLattice[0])+abs(diffLattice[1])) {
        if (abs(diffLattice[0])) (diffLattice[0]>0)?(dirOut='right'):(dirOut='left');
        else if (abs(diffLattice[1])) (diffLattice[1]>0)?(dirOut='up'):(dirOut='down');
        
        let originType = field.takeType(tempLattice);
        console.log(originType);
        
        try{
          newBuilding = new Belt(tempLattice, [dirIn, dirOut])
          field.deleteBuilding(tempLattice);
          field.insertBuilding(tempLattice,  newBuilding); 
        }catch(event){
          if(event=='comeback error' && (!(originType)|| originType=='belt')){
            dirIn=dirOut;
            newBuilding = new Belt(tempLattice, [dirOut, dirOut])
            field.deleteBuilding(tempLattice);
            field.insertBuilding(tempLattice,  newBuilding); 
          };
        }
        if ((abs(nowLattice[0])>=2||abs(nowLattice[1])>=2) 
            && (!(field.takeType(nowLattice))|| field.takeType(nowLattice)=='belt')){
          newBuilding = new Belt(nowLattice, [dirOut, dirOut])
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
}

window.addEventListener('keyup', (event) => {
  const key = event.key
  if (key === ' ' ) {canEdit = true}
})

function keyPressed() {
  //System key
  if (key === ' ') {
    canEdit = false; 
  } else if (key === 'e'|| key === 'E') {
    console.log("editability changed")
    noErase = false;
  }else {noErase = true}
  if (key === 'r' || key === 'R') {
    console.log("rotate building CW");
    (dirInIndex>=3)?(dirInIndex=0) : (dirInIndex++);
  }

  //Buildings key
  if (key === '1') {
    console.log("Building mode: Belt");
    buildingtype=BUILDING_MODE['belt'];
  }
  if (key === '2') {
    console.log("Building mode: Miner");
    buildingtype=BUILDING_MODE['miner'];
  }
  if (key === '4') {
    console.log("Building mode: Cutter");
    buildingtype=BUILDING_MODE['cutter'];
  }
  if (key === '3') {
    console.log("Building mode: Rotater");
    buildingtype=BUILDING_MODE['rotater'];
  }
  if (key === '7') {
    console.log("Building mode: Balancer");
    buildingtype=BUILDING_MODE['balancer'];
  }
  if (key === '6') {
    console.log("Building mode: Painter");
    buildingtype=BUILDING_MODE['painter'];
  }
  if (key === '5') {
    console.log("Building mode: Stacker");
    buildingtype=BUILDING_MODE['stacker'];
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

window.setup = setup; 
window.draw = draw;
window.mousePressed = mousePressed;
window.keyPressed = keyPressed;
window.mouseWheel = mouseWheel;
window.mouseDragged = mouseDragged;