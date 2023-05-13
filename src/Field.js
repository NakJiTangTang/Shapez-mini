import {CANVAS_WIDTH,CANVAS_HEIGHT, FIELD_HEIGHT, FIELD_WIDTH, ElEM_RADIUS_INT} from './Constants.js';
import { Subject } from './Subject.js';
import {Building} from './Building.js'


class Field {
    constructor(){
        this.fieldH = FIELD_HEIGHT;
        this.fieldW = FIELD_WIDTH;
        this.buildings = new Array(this.fieldH*this.fieldW);
        this.viewNum = 10;
        this.viewX=CANVAS_WIDTH/2;
        this.viewY=CANVAS_HEIGHT/2; 
        //this.peekBuilding = new Building([0,0], 'up')
    }
    tileWidthIs(){
        return CANVAS_WIDTH / this.viewNum;
    }
    draw(){
        const tileWidth = this.tileWidthIs()
        this.drawGrid(tileWidth);

        translate(this.viewX, this.viewY);
        rectMode(CENTER);
        fill(100);
        square(0, 0, 2.7*tileWidth);
        noFill();
        for (let building of this.buildings){ 
            if (building){
                building.draw()
                building.dragWithElement(this.viewX, this.viewY);
            }
        }
        translate(-this.viewX, -this.viewY);
        //this.drawPeek(tileWidth)
    }
    //Under consideration to implement
    drawPeek(tileWidth){
        this.peekBuilding.lattice = this.clickedLattice(mouseX, mouseY);
        if(this.peekBuilding.lattice){
            tint(255,100);
            this.peekBuilding.draw(tileWidth, this.viewX, this.viewY);
            tint(255,255);
        }
    }
    drawGrid(tileWidth){
        strokeWeight(tileWidth/100);
        stroke(170);
        for (let gridDrawMode of [0, 1]){
            // width-wise
            let lineNumber=this.viewNum;
            if (gridDrawMode){lineNumber = Math.min(this.viewNum, (this.fieldW-1)/2)}
            else {lineNumber = Math.min(this.viewNum, (this.fieldH-1)/2) }
            for (let i = 0 ; i<lineNumber ; i++){
                if (gridDrawMode){
                    line(this.viewX-(i+1/2)*tileWidth, this.viewY-(lineNumber+1/2)*tileWidth, this.viewX-(i+1/2)*tileWidth, this.viewY+(lineNumber+1/2)*tileWidth);
                    line(this.viewX+(i+1/2)*tileWidth, this.viewY-(lineNumber+1/2)*tileWidth, this.viewX+(i+1/2)*tileWidth, this.viewY+(lineNumber+1/2)*tileWidth);
                }
                else{
                    line(this.viewX-(lineNumber+1/2)*tileWidth, this.viewY-(i+1/2)*tileWidth, this.viewX+(lineNumber+1/2)*tileWidth, this.viewY-(i+1/2)*tileWidth);
                    line(this.viewX-(lineNumber+1/2)*tileWidth, this.viewY+(i+1/2)*tileWidth, this.viewX+(lineNumber+1/2)*tileWidth, this.viewY+(i+1/2)*tileWidth);
                }
            }
        }
        noStroke();
    }
    makeLattice(point , ref){
        let varience = (point - ref)/(this.tileWidthIs()/2);
        let lattice= (varience>=0?1:(-1)) * floor(( floor(abs(varience)) + 1)/2);
        if (lattice == -0) lattice = 0; 
        return lattice;
    }
    //MouseX, Y into [n, m]
    clickedLattice(pointX, pointY){
        let lattice = [this.makeLattice(pointX, this.viewX), -1 * this.makeLattice(pointY, this.viewY)]
        for (let lat of lattice) {
            if (abs(lat)>FIELD_HEIGHT/2){return null;};
        }
        //console.log(lattice)
        return lattice;
    }
    magnify(scrollDir){
        if (scrollDir<0) { this.viewNum = this.viewNum*0.8; }
        else {this.viewNum = this.viewNum*1.25;}
        for (let building of this.buildings){
            if (building){
                building.changeTileWidth(this.tileWidthIs());
            }
        }
    }
    drag(dragDirX, dragDirY){
        this.viewX+=dragDirX;
        this.viewY+=dragDirY;
    }
    nmIntoIndex([n, m]){return FIELD_WIDTH*((FIELD_HEIGHT-1)/2-m) + (n+(FIELD_WIDTH-1)/2);}
    indexIntoNM(index){return [(index%FIELD_WIDTH) - (FIELD_WIDTH-1)/2 , -1*floor(index/FIELD_WIDTH) + (FIELD_HEIGHT-1)/2]}
    insertBuilding([n, m], building){
        building.changeTileWidth(this.tileWidthIs()) ;
        this.buildings[this.nmIntoIndex([n,m])] = building;
    }
    deleteBuilding([n, m]){
        if (this.buildings[this.nmIntoIndex([n,m])]){
            this.buildings[this.nmIntoIndex([n,m])].delElem();
        };
        
        this.buildings[this.nmIntoIndex([n,m])]=0;
    }

}

export {Field};