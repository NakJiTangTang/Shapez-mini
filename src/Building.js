import {REF_SPEED, INT_ElEM_RADIUS, DIR_VEC, DIR_LATTICE} from './Constants.js';

import { Element} from './Element.js';

class Building {
    constructor([n, m], [dirIn, dirOut], isInv){
        this.queue = [];
        this.radius = INT_ElEM_RADIUS;
        this.imageSet = undefined;
        //Placeholder
        this.IMGURL = ""
        this.lattice = [n, m];
        this.isJammed = false;
        this.isJamPropagated = false;
        this.dir =[dirIn, dirOut];
        this.workSpeed =  REF_SPEED;
        this.tranparent = false;
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
    draw(tileWidth, viewX, viewY){
        let X = viewX + tileWidth*this.lattice[0];
        let Y = viewY - tileWidth*this.lattice[1];
        if (this.imageSet){
          translate(X,Y);  
          rotate(DIR_VEC[this.dir[0]]*180)
          image(this.imageSet, 0, 0, tileWidth, tileWidth);
          rotate(-DIR_VEC[this.dir[0]]*180)
          translate(-X,-Y);
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
    //this.queue.push(new Element([0,0,0,0]));

    console.log(this.queue);

  }
}












export { Building , Belt};