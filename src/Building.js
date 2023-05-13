import {MIN_DIST, REF_SPEED, ElEM_RADIUS_INT, DIR_VEC, DIR_LATTICE} from './Constants.js';

import { Subject} from './Subject.js';

import { Element} from './Element.js';

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
            this.queue[i].sprite.move();
          }
        }
        this.queue[this.queue.length-1].sprite.move();
      }
    }
    emitElem(){
      if (this.queue.length){
        this.queue[this.queue.length-1].sprite.emit()
        
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
        //if (!(this.isJammed)){ this.movingElem() }
        console.log(this.queue);
        this.movingElem()
    }
    newElem(newElement){
      this.queue.unshift(newElement);
      this.queue[0].init(this.lattice, this.dir);
      newElement.subscribe(this);
    }

    update(source, ...others){
      if (source == 'ElemReady'){
        // others: []
        console.log('asfd')
        this.notifySubscribers('CheckNext', this.nextLattice, this.dir[1], this.lattice);
      }
      if (source == 'IsNotJam' && others[2].toString()==this.lattice.toString()){
        // others: [bool, new [n, m], now [n, m]]
        if (this.nextLattice.toString()==others[1].toString()){
          //console.log(others[0]);
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
    this.queue.push(new Element([n, m], [0,0,0,0], this.dir));
    this.queue[0].subscribe (this)



    console.log(this.queue);

  }
}












export { Building , Belt};