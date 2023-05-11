import {Shape} from './Shape.js'


class Element{
    constructor([shapeU, shapeR, shapeD, shapeL]){
        this.layers = [shapeU, shapeR, shapeD, shapeL];
        this.sprite = new Sprite();
	
        this.sprite.draw = () => {
            fill(237, 205, 0);
    
            push();
            rotate(this.sprite.direction);
            ellipse(0, 0, 100 + this.sprite.speed, 100 - this.sprite.speed);
            pop();
        };
    
        this.sprite.update = () => {
            this.sprite.moveTowards(mouse, 0.07);
        };
    }
}

export {Element};
