import {CANVAS_WIDTH,CANVAS_HEIGHT, FIELD_HEIGHT, FIELD_WIDTH, INT_ElEM_RADIUS} from './Constants.js';
import { Subject } from './Subject.js';

class Field {
    constructor(){
        this.buildings = [];
        this.fieldH = FIELD_HEIGHT;
        this.fieldW = FIELD_WIDTH;
        this.radius = INT_ElEM_RADIUS;
        this.viewNum = 10;
        this.viewX=CANVAS_WIDTH/2;
        this.viewY=CANVAS_HEIGHT/2;
    }
    draw(){
        const tileWidth = CANVAS_WIDTH / this.viewNum;
        this.drawGrid(tileWidth);

        rectMode(CENTER);
        fill(100);
        square(this.viewX, this.viewY, 2.7*tileWidth);
        noFill();
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

    magnify(scrollDir){
        if (scrollDir<0) { this.viewNum = this.viewNum*0.8; }
        else {this.viewNum = this.viewNum*1.25;}
    }

    drag(dragDirX, dragDirY){
        this.viewX+=dragDirX;
        this.viewY+=dragDirY;
    }

}

export {Field};