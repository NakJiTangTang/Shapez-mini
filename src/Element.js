import {Shape} from './Shape.js'
import {ElEM_RADIUS_INT, ElEM_RADIUS_RATIO} from './Constants.js'


class Element{
    constructor([n, m], [shapeU, shapeR, shapeD, shapeL]){
        this.layers = [shapeU, shapeR, shapeD, shapeL];
        this.sprite = new Sprite(0, 0, ElEM_RADIUS_INT, ElEM_RADIUS_INT, 'static');
        this.tileWidth =0;
        this.movingPercent=0;
        this.inWhere = [n, m];
        this.inRef = [0, 0];
        this.collider = 's';

        this.sprite.draw = () => {
            fill(237, 205, 0);
            push();
            let X = this.inRef[0]+this.inWhere[0]*this.tileWidth
            let Y = this.inRef[1]-this.inWhere[1]*this.tileWidth
            let R = this.tileWidth*ElEM_RADIUS_INT;
            this.sprite.pos ={x:0, y:0};
            ellipseMode(CENTER);
            ellipse(X, Y, 2*R, 2*R);
            pop();
        };

        this.sprite.update = () => {
            //this.sprite.moveTowards(mouse, 0.07);
        };
    }
}

export {Element};
