import {Shape} from './Shape.js'
import {COLOR_PALET, FRAME_RATE, REF_SPEED, DIR_LATTICE, ElEM_RADIUS_INT, ElEM_RADIUS_RATIO} from './Constants.js'
import { Subject} from './Subject.js';

class Element extends Subject{
    constructor([n, m], [bot, down, up, top], [dirIn, dirOut]){
        super();
        this.layers = [bot, down, up, top];
        this.sprite = new Sprite(0, 0, ElEM_RADIUS_INT, ElEM_RADIUS_INT, 'static');
        this.tileWidth =0;
        this.movingPercent=0;
        this.inWhere = [n, m];
        this.inRef = [0, 0];
        this.collider = 's';
        this.buildingDir = [dirIn, dirOut];
        this.visible = true;
        //console.log([DIR_LATTICE[this.buildingDir[1]][0]-DIR_LATTICE[this.buildingDir[0]][0], DIR_LATTICE[this.buildingDir[1]][1]-DIR_LATTICE[this.buildingDir[0]][1]])
        this.sprite.draw = () => {
            this.positionSet();
            if(this.visible){
                let R= this.tileWidth*ElEM_RADIUS_INT;
                push();
                strokeWeight(this.tileWidth/30);
                stroke(100);
                for (let layer of this.layers){
                    if(layer){for (let i=0; i<4; i++){
                        fill(COLOR_PALET[layer.color[i]]);
                        rotate(i*90);
                        if (layer.shape[i]=='C'){
                            arc(0, 0, 2*R, 2*R, -90, 0, PIE)
                        }
                        
                        rotate(-i*90);
                    }}
                }

                
                ellipseMode(CENTER);
                //
                //ellipse(0, 0, 2*R, 2*R);
                pop();
                //console.log(this.movingPercent);
            }
        };
    }
    positionSet(){
        let X, Y, dir, dirOut;
        
        X = this.inRef[0]+this.inWhere[0]*this.tileWidth
        Y = this.inRef[1]-this.inWhere[1]*this.tileWidth
        dir = DIR_LATTICE[this.buildingDir[0]];
        dirOut = DIR_LATTICE[this.buildingDir[1]];
        if (this.buildingDir[0]==this.buildingDir[1]){
            //ref: center of the tile
            let moveLinearAmount=((this.movingPercent/100)-1/2)*this.tileWidth;
            X +=moveLinearAmount*dir[0];
            Y -=moveLinearAmount*dir[1];
        }
        else{
            let phase=Math.PI/2 *(this.movingPercent/100);
            let dirVec = [dirOut[0]-dir[0], dirOut[1]-dir[1]]
            //Mode change if dirIn is about x axis
            let mode = abs(dirOut[0]);
            X += -1*dirVec[0]*this.tileWidth/2* Math.cos((mode)?phase:(Math.PI/2 -phase)) + (dirVec[0])*this.tileWidth/2;
            Y -= -1*dirVec[1]*this.tileWidth/2* Math.sin((mode)?phase:(Math.PI/2 -phase)) + (dirVec[1])*this.tileWidth/2;
        }
        let putX = X;
        let putY = Y;

        if (Y<0 || Y>height || X<0 || X>width){
            putY=height/2
            putX=width/2
            this.visible=false;
        }
        else{this.visible=true;}
        //console.log(this.visible);
        this.sprite.pos ={x:putX, y:putY};
    }
    
    
    init([n, m], [dirIn, dirOut]){
        this.inWhere = [n, m];
        this.buildingDir = [dirIn, dirOut];
        this.movingPercent=0;
        this.unsubscribeAll();
    }
    emit = ()=>{
        if (this.movingPercent ==100){
            //console.log(this.movingPercent)
            this.notifySubscribers('ElemReady');}
    }
    move = () => {
        //console.log(this.sprite.pos.y)
        if (!this.sprite){
            //this.sprite = new Sprite(0, 0, ElEM_RADIUS_INT, ElEM_RADIUS_INT, 'static');
            
        }
        if (this.movingPercent<100){
            this.movingPercent += REF_SPEED/FRAME_RATE;
            //console.log(this.sprite);
        }else{
            this.movingPercent =100;
        }
    }
}

export {Element};
