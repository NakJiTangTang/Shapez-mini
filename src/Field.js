import {MIN_DIST, CANVAS_WIDTH,CANVAS_HEIGHT, FIELD_HEIGHT, FIELD_WIDTH, ElEM_RADIUS_INT} from './Constants.js';
import { Subject } from './Subject.js';
import {Building, Ore} from './Building.js'
import list from './OreList.json'

class Field extends Subject{
    constructor(){
        super()
        this.fieldH = FIELD_HEIGHT;
        this.fieldW = FIELD_WIDTH;
        this.buildings = new Array(this.fieldH*this.fieldW);
        this.viewNum = 10;
        this.viewX=CANVAS_WIDTH/2;
        this.viewY=CANVAS_HEIGHT/2; 
        this.Orelist = new Array(this.fieldH*this.fieldW);
        this.Ores = new Array(this.fieldH*this.fieldW);
        this.loadOreList();
        //this.peekBuilding = new Building([0,0], 'up')
    }
    
    saveOreList(){
        save(this.Orelist, "OreList.json");
        //localStorage.setItem("OreList", JSON.stringify(this.Orelist));
    }
    loadOreList(){
        //const data = localStorage.getItem("OreList");
        this.Orelist=list;
        if(this.Orelist){
            //this.Orelist = JSON.parse(data);
            for (let i=0;i<this.Orelist.length;i++){ 
                if (this.Orelist[i]){
                    this.insertOre(this.indexIntoNM(i), this.Orelist[i])}
            }
        }
    }
    initOreList(){this.Orelist = new Array(this.fieldH*this.fieldW);}
    
    tileWidthIs(){
        return CANVAS_WIDTH / this.viewNum;
    }
    draw(){
        const tileWidth = this.tileWidthIs()
        this.drawGrid(tileWidth);

        translate(this.viewX, this.viewY);
        rectMode(CENTER);
        for (let i=0;i<this.Ores.length;i++){ 
            if (this.Ores[i]){
                this.Ores[i].dragWithElement(this.viewX, this.viewY);
                if (this.buildings[i]){this.Ores[i].queue[0].visibleChanger(false);
                }else {this.Ores[i].queue[0].visibleChanger(true);}
            }
        }

        fill(100);
        square(0, 0, 2.7*tileWidth);
        noFill();
        for (let building of this.buildings){ 
            if (building){
                building.draw()
                building.dragWithElement(this.viewX, this.viewY);
            }
        }
        for (let building of this.buildings){ 
            if (building){
                building.emitElem();
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
        for (let ore of this.Ores){ 
            if (ore){ore.changeTileWidth(this.tileWidthIs());}
        }


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
        this.subscribe(this.buildings[this.nmIntoIndex([n,m])]);
        this.buildings[this.nmIntoIndex([n,m])].subscribe(this);
        for (let building of this.buildings){
            if (building){building.movingElem()}
        }
    }
    insertOre([n, m], ore){
        this.Orelist[this.nmIntoIndex([n, m])]=ore;
        this.Ores[this.nmIntoIndex([n, m])]=new Ore([n, m], ore)
        this.Ores[this.nmIntoIndex([n, m])].changeTileWidth(this.tileWidthIs()) ;
        this.subscribe(this.Ores[this.nmIntoIndex([n,m])]);
        this.Ores[this.nmIntoIndex([n,m])].subscribe(this);
        for (let ore of this.Ores){
            if (ore){ore.movingElem()}
        }
    }




    deleteBuilding([n, m]){
        if (this.buildings[this.nmIntoIndex([n,m])]){
            this.buildings[this.nmIntoIndex([n,m])].delElemAll();
            this.unsubscribe(this.buildings[this.nmIntoIndex([n,m])]);
            this.buildings[this.nmIntoIndex([n,m])].unsubscribeAll();
        };
        this.buildings[this.nmIntoIndex([n,m])]=0;
    }
    update(source, ...others){
        if (source == 'CheckNext'){
            // others: [next lattice, previous dirOut, now lattice]
            let buildingToSee = this.buildings[this.nmIntoIndex(others[0])]
            if (buildingToSee){
                if(buildingToSee.dir[0]==others[1]){
                    //let sol = !buildingToSee.isJammed;
                    let sol = ((buildingToSee.queue[0])?buildingToSee.queue[0].movingPercent:100 )
                    this.notifySubscribers('IsNotJam', sol>MIN_DIST, others[0], others[2]);
                }
                else{this.notifySubscribers('IsNotJam', false, others[0], others[2])}
            }
            else{this.notifySubscribers('IsNotJam', false, others[0], others[2])}
        }
        if (source == 'ElemTransferStart'){
            // others: [element, new [n, m]]
            //console.log(others);
            this.buildings[this.nmIntoIndex(others[1])].newElem(others[0]);
        }
    }
}

export {Field};