import {REF_SPEED, INT_ElEM_RADIUS} from './Constants.js';

class Building {
    constructor([n, m], direction){
        this.queue = [];
        this.radius = INT_ElEM_RADIUS;
        this.imageSet = [loadImage('../elem/buildings/belt_top.png')];
        this.lattice = [n, m];
        this.isJammed = false;
        this.isJamPropagated = false;
        this.dirIn = direction;
        this.dirOut = direction;
        this.workSpeed =  REF_SPEED;
    }
    draw(tileWidth, viewX, viewY){
        let X = viewX + tileWidth*this.lattice[0];
        let Y = viewY - tileWidth*this.lattice[1];
        image(this.imageSet[0], X, Y, tileWidth, tileWidth);
    }

}

export { Building };