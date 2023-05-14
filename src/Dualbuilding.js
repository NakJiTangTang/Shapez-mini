import {Building} from './Building.js'
import {Element} from './Element.js'
import {Shape} from './Shape.js'
import {MIN_DIST, REF_SPEED, ElEM_RADIUS_INT, DIR_VEC, DIR_LATTICE} from './Constants.js';

class Counterpart extends Building {
    constructor([n, m], [dirIn, dirOut], [rootN, rootM]){
      super([n, m], [dirIn, dirOut]);

      this.inletOK = true;
      this.type='counterpart';
      this.root = [rootN, rootM]
      //console.log(this.dirDelta());
      this.settingImg ();
      console.log(this.queue);
      //Placeholder
      this.nextLattice_counter=[n, m]


    }
    settingImg(){};
    movingElem(){
        if (this.queue.length){
            for (let i=0;i<this.queue.length; i++){
                this.notifySubscribers('CounterpartElem',this.queue.pop(), this.root , this.dir );
            }
          }
    }
}

class Dualbuilding extends Building {
    constructor([n, m], [dirIn, dirOut], [slaveN, slaveM]){
      super([n, m], [dirIn, dirOut])
      this.queueCounter = [];
      this.latticeCounter = [slaveN, slaveM];
      //Placeholder
      this.nextLattice_counter = [slaveN, slaveM];

      this.dual = true;
      this.type='Dualbuilding';
      this.IMGURL = '../elem/buildings/cutter.png';
      this.settingImg ();

      this.queueJam = false;
      this.queueCounterJam = false;
    }
    emitElem(){
      if (this.queue.length){
        this.queue[this.queue.length-1].emit()
      }
      if (this.queueCounter.length){
        this.queueCounter[this.queueCounter.length-1].emit()
      }
    }
    movingElem(){
      function queueMove(que){
        if (que.length){
          for (let i=0;i<que.length-1; i++){
            if(que[i+1].movingPercent-que[i].movingPercent>MIN_DIST){
              que[i].move();
            }
          }
          que[que.length-1].move();
        }
      }
      queueMove(this.queue) 
      queueMove(this.queueCounter)
    }


    draw(){
        let X = this.tileWidth*this.lattice[0];
        let Y = -this.tileWidth*this.lattice[1];
        if (this.imageSet){
          translate(X,Y);  
          rotate(DIR_VEC[this.dir[0]]*180)
          image(this.imageSet, this.tileWidth/2, 0, this.tileWidth*2, this.tileWidth);
          rotate(-DIR_VEC[this.dir[0]]*180)
          translate(-X,-Y);
        }
        this.movingElem()
        if (this.queueCounterJam && this.queueJam){
          
          this.isJammed=true}
        else{ 
          this.isJammed=false
          if(this.queueJam){this.queue.pop()}
          if(this.queueCounterJam){this.queueCounter.pop()}
        }

    }
    newElemCounter(newElement){
      this.queueCounter.unshift(newElement);
      this.queueCounter[0].init(this.lattice, this.dir, this.tileWidth);
      this.queueCounter[0].visibleChanger(false)
      newElement.subscribe(this);
    }
    update(source, ...others){
      
      if (source == 'ElemReady'){
        // others: []
        this.notifySubscribers('CheckNext', this.nextLattice, this.dir[1], this.lattice, this.type);
        this.notifySubscribers('CheckNext', this.nextLattice_counter, this.dir[1], this.lattice, this.type);
      }
      if (source == 'IsNotJam' && others[2].toString()==this.lattice.toString()){
        // others: [bool, new [n, m], now [n, m], next building type]
        if (this.nextLattice.toString()==others[1].toString()){
          if (others[0]){
            this.queueJam = false;
            if (this.queue[0]){
              this.notifySubscribers('ElemTransferStart', this.queue.pop(), others[1] );
            }
          }
          else{this.queueJam = true;}
        }
        else if (this.nextLattice_counter.toString()==others[1].toString()){
          if (others[0]){
            this.queueCounterJam = false;
            if (this.queueCounter[0]){
              this.notifySubscribers('ElemTransferStart', this.queueCounter.pop(), others[1] );
            }
          }
          else{this.queueCounterJam = true;}
        }

      }
    }
  }

class Cutter extends Dualbuilding {
  constructor([n, m], [dirIn, dirOut], [slaveN, slaveM]){
    super([n, m], [dirIn, dirOut], [slaveN, slaveM])
    this.nextLattice_counter = [n+DIR_LATTICE[dirIn][1]+DIR_LATTICE[dirIn][0], m-DIR_LATTICE[dirIn][0]+DIR_LATTICE[dirIn][1]]
    this.type='cutter';
    this.IMGURL = '../elem/buildings/cutter.png';
    this.settingImg ();
  }
  splitElement(newElement){
    let originSide;
    let counterSide;
    counterSide = new Element (newElement.inWhere, [0,0,0,0], newElement.buildingDir);
    counterSide.visible=false;
    originSide = new Element (newElement.inWhere, [0,0,0,0], newElement.buildingDir);
    originSide.visible=false;
    for (let i=0 ; i<4; i++){ 
      if(newElement.layers[i]){
        counterSide.layers[i] = new Shape (['-', '-', newElement.layers[i].shape[2], newElement.layers[i].shape[3]],
                                          ['-', '-', newElement.layers[i].color[2], newElement.layers[i].color[3]])
        originSide.layers[i] = new Shape ([newElement.layers[i].shape[0], newElement.layers[i].shape[1], '-', '-'],
                                          [newElement.layers[i].color[0], newElement.layers[i].color[1], '-', '-'])
      }
    }
    newElement.sprite.remove()
    return [counterSide, originSide];
  }
  
  newElem(newElement){
    let [originSide, counterSide] = this.splitElement(newElement)
    
    this.queue.unshift(originSide);
    this.queue[0].init(this.lattice, this.dir, this.tileWidth);
    this.queue[0].visibleChanger(false)
    newElement.subscribe(this);

    this.newElemCounter(counterSide);
  }

}

export {Counterpart, Cutter}
