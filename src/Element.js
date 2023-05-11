import {Shape} from './Shape.js'
import {ElEM_RADIUS_INT, ElEM_RADIUS_RATIO} from './Constants.js'


class Element{
    constructor([n, m], [shapeU, shapeR, shapeD, shapeL]){
        this.layers = [shapeU, shapeR, shapeD, shapeL];
        this.sprite = new Sprite();
        this.tileWidth =0;
        this.movingPercent=0;
        this.inWhere = [n, m];
        this.inRef = [0, 0];
        this.collider = 's';

        this.sprite.draw = () => {
            fill(237, 205, 0);
            push();
            ellipse(this.inRef[0]+this.inWhere[0]*this.tileWidth, this.inRef[1]-this.inWhere[1]*this.tileWidth, 
                this.tileWidth*ElEM_RADIUS_INT, this.tileWidth*ElEM_RADIUS_INT);
            pop();
        };

        this.sprite.update = () => {
            //this.sprite.moveTowards(mouse, 0.07);
        };
    }
}

export {Element};
