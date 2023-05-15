import {Building} from './Building.js'
import {Element} from './Element.js'
import {Shape} from './Shape.js'
import {MIN_DIST, REF_SPEED, ElEM_RADIUS_INT, DIR_VEC, DIR_LATTICE} from './Constants.js';

class Counterpart extends Building {
    constructor([n, m], [dirIn, dirOut], [rootN, rootM]){
      super([n, m], [dirIn, dirOut]);
      this.isJammed = false;
      this.inletOK = true;
      this.type='counterpart';
      this.root = [rootN, rootM]
      //console.log(this.dirDelta());
      this.settingImg ();
      this.inselfLattice=[n, m]
    }
    settingImg(){};
    movingElem(){
      if (this.queue.length && !(this.isJammed)){
            for (let i=0;i<this.queue.length; i++){
              //console.log('CounterpartElem',this.queue.pop(), this.root , this.dir)  
              //console.log(this.observers);
              this.notifySubscribers('CounterpartElem', this.queue.pop(), this.root , this.inselfLattice );
            }
        }
        else {this.notifySubscribers('CounterpartElem', 0, this.root , this.inselfLattice );}
    }
    update(source, ...others){
      if (source == 'ElemReady'){
        // others: []
        this.notifySubscribers('CheckNext', this.nextLattice, this.dir[1], this.lattice, this.type);
      }
      if (source == 'IsRootJamed' && (this.inselfLattice.toString()==others[0].toString())){
        // others: [slave lattice itself [n, m], loot.queueCounterJam, loot.queueJam]
        this.isJammed = (others[1] && others[2]);
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
      this.twoOutOnly = false;
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
          //console.log(que)
          if((que[que.length-1])) {que[que.length-1].move()};
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
          if (this.twoOutOnly){
            if(this.queueJam){this.queue.pop()}
            if(this.queueCounterJam){this.queueCounter.pop()}
          }
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
    this.twoOutOnly = true;
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
    originSide.subscribe(this);
    this.newElemCounter(counterSide);
  }

}

class Balancer extends Dualbuilding {
  constructor([n, m], [dirIn, dirOut], [slaveN, slaveM]){
    super([n, m], [dirIn, dirOut], [slaveN, slaveM])
    this.nextLattice_counter = [n+DIR_LATTICE[dirIn][1]+DIR_LATTICE[dirIn][0], 
                                m-DIR_LATTICE[dirIn][0]+DIR_LATTICE[dirIn][1]]
    this.type='balancer';
    this.IMGURL = '../elem/buildings/balancer.png';
    this.settingImg ();
  }
  newElem(newElement){
    //console.log(this.queueJam, this.queueCounterJam);
    if(this.queueJam &&  !(this.queueCounterJam)){
      this.queueCounter.unshift(newElement);
      this.queueCounter[0].init(this.lattice, this.dir, this.tileWidth);
      this.queueCounter[0].visibleChanger(false)
    }
    else{
      this.queue.unshift(newElement);
      this.queue[0].init(this.lattice, this.dir, this.tileWidth);
      this.queue[0].visibleChanger(false)
      if ((this.queueCounterJam) && this.queueCounter.length){
        this.queue.unshift(this.queueCounter.pop());
      }
    }
    newElement.subscribe(this);
  }
  newElemCounter(newElement){
    if(this.queueCounterJam &&  !(this.queueJam)){
      this.queue.unshift(newElement);
      this.queue[0].init(this.lattice, this.dir, this.tileWidth);
      this.queue[0].visibleChanger(false)
    }
    else{
      this.queueCounter.unshift(newElement);
      this.queueCounter[0].init(this.lattice, this.dir, this.tileWidth);
      this.queueCounter[0].visibleChanger(false)
      if ((this.queueJam) && this.queue.length){
        this.queueCounter.unshift(this.queue.pop());
      }
    }
    newElement.subscribe(this);
  }
}

class Painter extends Dualbuilding {
  constructor([n, m], [dirIn, dirOut], [slaveN, slaveM]){
    super([n, m], [dirIn, dirOut], [slaveN, slaveM])
    this.nextLattice = [n+2*DIR_LATTICE[dirIn][0], m+2*DIR_LATTICE[dirIn][1]]
    this.type='painter';
    this.IMGURL = '../elem/buildings/painter.png';
    this.settingImg ();
    this.color ='u';
  }
  newElem(newElement){
    let originSide;
    originSide = new Element (newElement.inWhere, [0,0,0,0], newElement.buildingDir);
    originSide.visible=false;
    for (let i=0 ; i<4; i++){ 
      if(newElement.layers[i]){
        originSide.layers[i] = new Shape ([newElement.layers[i].shape[0], newElement.layers[i].shape[1], newElement.layers[i].shape[2], newElement.layers[i].shape[3]],
                                          [newElement.layers[i].color[0], newElement.layers[i].color[1], newElement.layers[i].color[2], newElement.layers[i].color[3]])
      }
    }
    if (this.color != 'u'){
      for (let i = 0 ; i < 4; i++){ 
        if(originSide.layers[i]){
          originSide.layers[i].color = [this.color, this.color, this.color, this.color];
        }
      }
      this.color = 'u'
    }
    
    newElement.sprite.remove();
    this.queue.unshift(originSide);
    this.queue[0].init(this.lattice, this.dir, this.tileWidth);
    this.queue[0].visibleChanger(false)
    originSide.subscribe(this);
  }
  newElemCounter(newElement){
    newElement.visibleChanger(false)
    if(newElement.layers[0].shape[0]=='Col'){
      this.color = newElement.layers[0].color[0]
    } else{this.color ='u'}
    if(this.color == 'u'){
      this.queueCounterJam=true;
    } else{
      this.queueCounterJam=false }
  }
  draw(){
    let X = this.tileWidth*this.lattice[0];
    let Y = -this.tileWidth*this.lattice[1];
    if (this.imageSet){
      translate(X,Y);  
      rotate(DIR_VEC[this.dir[0]]*180-90)
      image(this.imageSet, this.tileWidth/2, 0, this.tileWidth*2, this.tileWidth);
      rotate(-DIR_VEC[this.dir[0]]*180+90)
      translate(-X,-Y);
    }
    this.movingElem()
    if (this.queueCounterJam && this.queueJam){
      
      this.isJammed=true}
    else{ 
      this.isJammed=false
      if (this.twoOutOnly){
        if(this.queueJam){this.queue.pop()}
        if(this.queueCounterJam){this.queueCounter.pop()}
      }
    }
  }
}

class Stacker extends Dualbuilding {
  constructor([n, m], [dirIn, dirOut], [slaveN, slaveM]){
    super([n, m], [dirIn, dirOut], [slaveN, slaveM])
    this.nextLattice_counter = [n+DIR_LATTICE[dirIn][1]+DIR_LATTICE[dirIn][0], 
                                m-DIR_LATTICE[dirIn][0]+DIR_LATTICE[dirIn][1]]
    this.type='stacker';
    this.IMGURL = '../elem/buildings/stacker.png';
    this.settingImg ();
  }
  newElem(newElement){
    let originSide;
    originSide = new Element (newElement.inWhere, [0,0,0,0], newElement.buildingDir);
    originSide.visible=false;
    for (let i=0 ; i<4; i++){ 
      if(newElement.layers[i]){
        originSide.layers[i] = new Shape ([newElement.layers[i].shape[0], newElement.layers[i].shape[1], newElement.layers[i].shape[2], newElement.layers[i].shape[3]],
                                          [newElement.layers[i].color[0], newElement.layers[i].color[1], newElement.layers[i].color[2], newElement.layers[i].color[3]])
      }
    }
    if (this.color != 'u'){
      for (let i = 0 ; i < 4; i++){ 
        if(originSide.layers[i]){
          originSide.layers[i].color = [this.color, this.color, this.color, this.color];
        }
      }
      this.color = 'u'
    }
    
    newElement.sprite.remove();
    this.queue.unshift(originSide);
    this.queue[0].init(this.lattice, this.dir, this.tileWidth);
    this.queue[0].visibleChanger(false)
    originSide.subscribe(this);
  }
  newElemCounter(newElement){
    newElement.visibleChanger(false)
    if(newElement.layers[0].shape[0]=='Col'){
      this.color = newElement.layers[0].color[0]
    } else{this.color ='u'}
    if(this.color == 'u'){
      this.queueCounterJam=true;
    } else{
      this.queueCounterJam=false }
  }
}

export {Counterpart, Cutter, Balancer, Painter, Stacker}
