import {Building} from './Building.js'
import {Element} from './Element.js'
import { Shape} from './Shape.js';
import {MIN_DIST, REF_SPEED, ElEM_RADIUS_INT, DIR_VEC, DIR_LATTICE} from './Constants.js';

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
            console.log('asdf')
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
    // test element (delete!)
    //let layer1 = new Shape(['S', 'S', 'S', 'S'], ['u','y','p','w'])
    //this.queue.push(new Element([n, m], [layer1,0,0,0], this.dir));
    //this.queue[0].subscribe (this)
    console.log(this.queue);
  }
  newElem(newElement){
    this.queue.unshift(newElement);
    this.queue[0].init(this.lattice, this.dir, this.tileWidth);
    this.queue[0].visibleChanger(false)
    newElement.subscribe(this);
    
  }
  
  changeTileWidth(newTileWidth){
    this.tileWidth = 3.5*newTileWidth;
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
      console.log(this.storage);
    }
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


  export { Miner, Hub, HubInlet}