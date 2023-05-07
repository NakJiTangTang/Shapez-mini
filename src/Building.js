import {REF_SPEED, INT_ElEM_RADIUS} from './Constants.js';

class Building {
    constructor([n, m], [dirIn, dirOut]){
        this.queue = [];
        this.radius = INT_ElEM_RADIUS;
        this.imageSet = [0,0,0,0]
        let IMGURL = '../elem/buildings/belt_top.png'
        this.loadImg(IMGURL).then((loadImg)=>{
            this.imageSet[0] = loadImg
          }).catch((result)=>{
            console.log(result)
          })
        this.lattice = [n, m];
        this.isJammed = false;
        this.isJamPropagated = false;
        this.dir =[dirIn, dirOut];
        this.workSpeed =  REF_SPEED;
        this.tranparent = false;
    }
    loadImg (imageURL){
        return new Promise ((resolve, reject)=>{
          try{loadImage(imageURL, (loadedImage) => {
            resolve(loadedImage);});
          }catch (err) {reject("No images?")}})
    }
    draw(tileWidth, viewX, viewY){
        let X = viewX + tileWidth*this.lattice[0];
        let Y = viewY - tileWidth*this.lattice[1];
        if (this.imageSet[0]){
            image(this.imageSet[0], X, Y, tileWidth, tileWidth);
        }
        
    }

}

export { Building };