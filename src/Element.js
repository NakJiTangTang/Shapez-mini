import {Shape} from './Shape.js'
import {FRAME_RATE, REF_SPEED, DIR_LATTICE, ElEM_RADIUS_INT, ElEM_RADIUS_RATIO} from './Constants.js'


class Element{
    constructor([n, m], [shapeU, shapeR, shapeD, shapeL], [dirIn, dirOut]){
        this.layers = [shapeU, shapeR, shapeD, shapeL];
        this.sprite = new Sprite(0, 0, ElEM_RADIUS_INT, ElEM_RADIUS_INT, 'static');
        this.tileWidth =0;
        this.movingPercent=0;
        this.inWhere = [n, m];
        this.inRef = [0, 0];
        this.collider = 's';
        this.buildingDir = [dirIn, dirOut];
        console.log([DIR_LATTICE[this.buildingDir[1]][0]-DIR_LATTICE[this.buildingDir[0]][0], DIR_LATTICE[this.buildingDir[1]][1]-DIR_LATTICE[this.buildingDir[0]][1]])
        this.sprite.draw = () => {
            let X, Y, R, dir, dirOut;
            R = this.tileWidth*ElEM_RADIUS_INT;
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


            fill(237, 205, 0);
            push();
            this.sprite.pos ={x:X, y:Y};
            ellipseMode(CENTER);
            ellipse(0, 0, 2*R, 2*R);
            pop();
            if (this.movingPercent<=100){
                this.movingPercent += REF_SPEED/FRAME_RATE;
            }else{
                this.movingPercent =100;
            }
            
            //console.log(this.movingPercent);
        };

        this.sprite.update = () => {
            //this.sprite.moveTowards(mouse, 0.07);
        };
    }
}

export {Element};
