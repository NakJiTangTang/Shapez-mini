import {Shape} from './Shape.js'


class Element{
    constructor([shapeU, shapeR, shapeD, shapeL]){
        this.layers = [shapeU, shapeR, shapeD, shapeL];
        this.sprite = new Sprite();
        this.tilewidth =0;
	
        this.sprite.draw = () => {
            fill(237, 205, 0);
            push();
            ellipse(0, 0, this.tilewidth + this.sprite.speed, this.tilewidth - this.sprite.speed);
            pop();
        };
        
        this.sprite.update = () => {
            //this.sprite.moveTowards(mouse, 0.07);
        };
    }
}

export {Element};
