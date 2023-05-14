import {Building} from './Building.js'
import {Element} from './Element.js'
import { Shape} from './Shape.js';
import {MIN_DIST, REF_SPEED, ElEM_RADIUS_INT, DIR_VEC, DIR_LATTICE} from './Constants.js';
import Levels from './Level.json'


class Miner extends Building {
    constructor([n, m], [dirIn, dirOut], Ore){
  
      super([n, m], [dirIn, dirOut]);
      this.type='miner';
      //console.log(this.dirDelta());
      this.IMGURL = '../elem/buildings/miner.png';
      this.settingImg ();
      if(Ore){
        this.layer =Ore.layer;
        this.newElem(new Element([n, m], [this.layer,0,0,0], this.dir))
      }
      
      // test element (delete!)
      //let layer1 = new Shape(['S', 'S', 'S', 'S'], ['u','y','p','w'])
      //this.queue.push(new Element([n, m], [layer1,0,0,0], this.dir));
      //this.queue[0].subscribe (this)
      console.log(this.queue);
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
        if (!(this.queue.length) && this.layer){
            this.newElem(new Element(this.dir, [this.layer,0,0,0], this.dir))
        }
    }

}

class Hub extends Building{
  constructor(){
    super([0, 0], ['up', 'up']);
    this.type='hub';
    //console.log(this.dirDelta());
    this.IMGURL = '../elem/buildings/hub_new.png';
    this.settingImg ();
    this.invincible = true;
    this.storage = {};
    this.level = 0; 
    this.levelLayer = 0;
    this.changeLevelLayer(this.level)
    console.log(this.levelLayer);
    console.log(this.levelTarget);
  }
  newElem(newElement){
    this.queue.unshift(newElement);
    this.queue[0].init(this.lattice, this.dir, this.tileWidth);
    this.queue[0].visibleChanger(false)
    newElement.subscribe(this);
    
  } 
  movingElem(){
    if (this.queue.length){
      for (let element of this.queue){
        let layers = [...element.layers];
        let layersStr = [];
        for (let layer of layers){
          if(layer){
            layersStr.push([...layer.color, ...layer.shape].toString()) 
          }else {layersStr.push(0)};
      }
        let data = layersStr.toString();
        if (this.storage[data]){
          this.storage[data]+=1;
        } else{
          this.storage[data] = 1
        }
        //this.storage.push(layers.toString());
        this.queue.shift();
      }
      //console.log(this.storage);
    }
    this.levelWorking();
  }
   
    changeTileWidth(newTileWidth){
      this.tileWidth = 3.5*newTileWidth;
      this.shapeWidth =2*  newTileWidth;
      this.levelLayer.tileWidth = this.shapeWidth;
    }
    
    dragWithElement(refX, refY){
      this.levelLayer.tileWidth = this.shapeWidth  
      this.levelLayer.inRef = [refX, refY];
    }

    levelWorking(){
      let count  = this.storage[this.levelTarget];
      if(!count){count= 0};
      if(count>=this.levelAmount){
        console.log(this.level);

        ((Levels.length-1)>this.level)?(this.level+=1):(this.level=0)
        
        this.levelLayer.sprite.text ="Clear!!"
        console.log(this.level);
        this.changeLevelLayer(this.level);
        this.storage = {};
      }
      this.levelLayer.sprite.text = `${count} / ${this.levelAmount}`
    }

  changeLevelLayer(level){
    if (this.levelLayer){
      console.log(this.levelLayer)
      this.levelLayer.sprite.remove();
      console.log(this.levelLayer)
      this.levelLayer.unsubscribeAll()
      this.levelLayer = 0;
    }
    let layersData =  Levels[level][0];
    let targets = [];
    let layers = [];
    for (let layer of layersData){
      if (layer[0]==0){
        layers.push(0);
        targets.push("0");
      }else{
        layers.push(new Shape(layer[1], layer[0 ], this.dir));
        targets.push([...layer[0], ...layer[1]])
      }
    }
    this.levelAmount = Levels[level][1];
    this.levelTarget = targets.toString();
    this.levelLayer = new Element([0, 0], layers, this.dir)
    this.levelLayer.movingPercent=50;
    
    

    this.levelLayer.subscribe (this)
  }

}

class HubInlet extends Building{
  constructor([n, m]){
    super([n, m], ['up', 'up']);
    this.type='hubinlet';
    this.invincible = true;
  }
  movingElem(){
    if (this.queue.length){
      for (let i=0;i<this.queue.length; i++){
        if(this.queue[i].movingPercent!=100){
          this.queue[i].movingPercent=100;
        }
      }
      this.queue[this.queue.length-1].move();
    }
  }
  settingImg(){};
  update(source, ...others){
    if (source == 'ElemReady'){ 
      this.notifySubscribers('ElemTransferStart', this.queue.pop(), [0,0] );
     }
    }
}
class Rotater extends Building {
  constructor([n, m], [dirIn, dirOut]){

    super([n, m], [dirIn, dirOut]);
    this.type='rotater';
    //console.log(this.dirDelta());
    this.IMGURL = '../elem/buildings/rotater.png';
    this.settingImg ();
  }
  rotateElement(newElement){
    let afterRotate;
    afterRotate = new Element (newElement.inWhere, [0,0,0,0], newElement.buildingDir);
    afterRotate.visible=false;
    for (let i=0 ; i<4; i++){ 
      if(newElement.layers[i]){
        afterRotate.layers[i] = new Shape ([newElement.layers[i].shape[3], newElement.layers[i].shape[0], newElement.layers[i].shape[1], newElement.layers[i].shape[2]],
                                          [newElement.layers[i].color[3], newElement.layers[i].color[0], newElement.layers[i].color[1], newElement.layers[i].color[2]])
      }
    }
    newElement.sprite.remove()
    return afterRotate;
  }
  newElem(newElement){
    let afterRotate = this.rotateElement(newElement)
    
    this.queue.unshift(afterRotate);
    this.queue[0].init(this.lattice, this.dir, this.tileWidth);
    this.queue[0].visibleChanger(false)
    afterRotate.subscribe(this);
  }
}

  export { Miner, Hub, HubInlet, Rotater}