import {MIN_DIST, REF_SPEED, ElEM_RADIUS_INT, DIR_VEC, DIR_LATTICE} from './Constants.js';

import { Subject} from './Subject.js';

import { Element} from './Element.js';
import { Shape} from './Shape.js';


class Building extends Subject{
    constructor([n, m], [dirIn, dirOut], isInv){
      super();  
      this.queue = [];
      this.radius = ElEM_RADIUS_INT;
      this.imageSet = undefined;
      //Placeholder
      this.IMGURL = ""
      this.lattice = [n, m];
      this.isJammed = false;
      this.isJamPropagated = false;
      this.dir =[dirIn, dirOut];
      this.workSpeed =  REF_SPEED;
      this.tranparent = false;
      this.tileWidth = 0;

      let dirNext = DIR_LATTICE[this.dir[1]];
      this.nextLattice = [this.lattice[0]+dirNext[0], this.lattice[1]+dirNext[1]]


    }
    // return angle/PI in radian
    dirDelta(){
        //return deg, left, right
        let inAng = DIR_VEC[this.dir[0]];
        let outAng= DIR_VEC[this.dir[1]];
        let delta = outAng - inAng;
        if (abs(delta)<1) return (delta);
        //it means element will comeback
        else if (abs(delta)==1) throw ('comeback error')
        else return delta-2*delta/abs(delta);
    }
    settingImg (){
      this.loadImg(this.IMGURL).then((loadImg)=>{
        this.imageSet = loadImg
      }).catch((result)=>{
        console.log(result) //
      })
    }
    loadImg (imageURL){
      if (imageURL){
        return new Promise ((resolve, reject)=>{
          try{loadImage(imageURL, (loadedImage) => {
            resolve(loadedImage);});
          }catch (err) {reject("No images?")}})
      }
    }
    delElemAll(){for (let element of this.queue){element.sprite.remove();}}

    changeTileWidth(newTileWidth){
      this.tileWidth = newTileWidth;
      for (let element of this.queue){
        element.tileWidth = this.tileWidth;
      }
    }
    dragWithElement(refX, refY){
      for (let element of this.queue){
        element.inRef = [refX, refY];
      }
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
    emitElem(){
      if (this.queue.length){
        this.queue[this.queue.length-1].emit()
        
      }
    }

    draw(){
        let X = this.tileWidth*this.lattice[0];
        let Y = -this.tileWidth*this.lattice[1];
        if (this.imageSet){
          translate(X,Y);  
          rotate(DIR_VEC[this.dir[0]]*180)
          image(this.imageSet, 0, 0, this.tileWidth, this.tileWidth);
          rotate(-DIR_VEC[this.dir[0]]*180)
          translate(-X,-Y);
        }
        this.movingElem()
    }
    newElem(newElement){
      this.queue.unshift(newElement);
      this.queue[0].init(this.lattice, this.dir, this.tileWidth);
      this.queue[0].visibleChanger(false)
      newElement.subscribe(this);
    }

    update(source, ...others){
      if (source == 'ElemReady'){
        // others: []
        this.notifySubscribers('CheckNext', this.nextLattice, this.dir[1], this.lattice);
      }
      if (source == 'IsNotJam' && others[2].toString()==this.lattice.toString()){
        // others: [bool, new [n, m], now [n, m]]
        if (this.nextLattice.toString()==others[1].toString()){
          if (others[0]){
            this.isJammed = false;
            this.notifySubscribers('ElemTransferStart', this.queue.pop(), others[1]);
          }
          else{
            this.isJammed = true;
          }
        }

      }
    }

}



class Belt extends Building {
  constructor([n, m], [dirIn, dirOut]){

    super([n, m], [dirIn, dirOut]);
    //console.log(this.dirDelta());
    if (!(this.dirDelta())) this.IMGURL = '../elem/buildings/belt.png';
    else if (this.dirDelta()==0.5) this.IMGURL = '../elem/buildings/belt_right.png'
    else if (this.dirDelta()==(-0.5)) this.IMGURL = '../elem/buildings/belt_left.png'
    this.settingImg ();
    
    // test element (delete!)
    //let layer1 = new Shape(['S', 'S', 'S', 'S'], ['u','y','p','w'])
    //this.queue.push(new Element([n, m], [layer1,0,0,0], this.dir));
    //this.queue[0].subscribe (this)
    //console.log(this.queue);

  }
  newElem(newElement){
    this.queue.unshift(newElement);
    this.queue[0].init(this.lattice, this.dir, this.tileWidth);
    this.queue[0].visibleChanger(true)
    newElement.subscribe(this);
  }
}

class Ore extends Building {
  constructor([n, m], ore){
    //Each ore will be: C, R, W, S, r, g, b
    super([n, m], ['up', 'up']);
    this.ore = ore;
    if (['C', 'R', 'W', 'S'].includes(ore)){
      this.layer = new Shape([ore,ore,ore,ore], ['u','u','u','u']);
      this.queue.push(new Element([n, m], [this.layer,0,0,0], this.dir));
    }else if (['r', 'g', 'b'].includes(ore)){
      this.layer = new Shape(['Col','Col','Col','Col'], [ore,ore,ore,ore]);
      this.queue.push(new Element([n, m], [this.layer,0,0,0], this.dir));
    }
    this.queue[0].movingPercent=50;
    this.queue[0].subscribe (this)
  }
  movingElem(){}
  settingImg(){};
  update(source, ...others){
    if (source == 'ElemReady'){  }
    if (source == 'IsNotJam' && others[2].toString()==this.lattice.toString()){  }}
}

export { Building , Belt, Ore};