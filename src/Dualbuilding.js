import {Building} from './Building.js'
import {Element} from './Element.js'
import {MIN_DIST, REF_SPEED, ElEM_RADIUS_INT, DIR_VEC, DIR_LATTICE} from './Constants.js';

class Counterpart extends Building {
    constructor([n, m], [dirIn, dirOut], [rootN, rootM]){
  
      super([n, m], [dirIn, dirOut]);
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
                this.notifySubscribers('CounterpartElem',this.queue.pop(), [rootN, rootM] , [n, m] );
            }
          }
    }
}

class Dualbuilding extends Building {
    constructor([n, m], [dirIn, dirOut], [slaveN, slaveM]){
      super([n, m], [dirIn, dirOut])
      this.queueCounter = [];
      this.latticeCounter = [slaveN, slaveM];
      this.dual = true;
      this.type='Dualbuilding';
      this.IMGURL = '../elem/buildings/cutter.png';
      this.settingImg ();
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
        //if needed
        //this.notifySubscribers('CheckNext', this.nextLattice_counter, this.dir[1], this.latticeCounter, this.type);
      }
      if (source == 'IsNotJam' && others[2].toString()==this.lattice.toString()){
        // others: [bool, new [n, m], now [n, m], next building type]
        if (this.nextLattice.toString()==others[1].toString()){
          if (others[0]){
            this.isJammed = false;
            this.notifySubscribers('ElemTransferStart', this.queue.pop(), others[1] );
          }
          else{
            this.isJammed = true;
          }
        }

      }
    }
  }

class Cutter extends Dualbuilding {
  constructor([n, m], [dirIn, dirOut], [slaveN, slaveM]){
    super([n, m], [dirIn, dirOut], [slaveN, slaveM])

    this.dual = true;
    this.type='cutter';
    this.IMGURL = '../elem/buildings/cutter.png';
    this.settingImg ();
  }
  movingElem(){
    if (this.queue.length){
      for (let i=0;i<this.queue.length-1; i++){
        if(this.queue[i+1].movingPercent-this.queue[i].movingPercent>MIN_DIST){
          this.queue[i].move();
        }
      }
      this.queue[this.queue.length-1].move();
    }
  }
}


export {Counterpart, Cutter}