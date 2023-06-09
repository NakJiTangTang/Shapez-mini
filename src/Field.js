import {MIN_DIST, FIELD_HEIGHT, FIELD_WIDTH} from './Constants.js';
import { Subject } from './Subject.js';
import {Ore} from './Building.js'
import {Hub, HubInlet} from './Etcbuilding.js'
import list from './OreList.json'

class Field extends Subject{
    constructor(){
        super()
        this.fieldH = FIELD_HEIGHT;
        this.fieldW = FIELD_WIDTH;
        this.buildings = new Array(this.fieldH*this.fieldW);
        this.viewNum = 15;
        this.viewX=width/2;
        this.viewY=height/2; 
        this.Orelist = new Array(this.fieldH*this.fieldW);
        this.Ores = new Array(this.fieldH*this.fieldW);
        this.loadOreList();
        for (let i=-1; i<2; i++){
            for (let j=-1; j<2; j++){
                if (!(i==0 && j==0)){
                    this.insertBuilding([i, j], new HubInlet([i, j]));
                }
            }
        }
        this.insertBuilding([0, 0], new Hub());
    }
    
    saveOreList(){
        save(this.Orelist, "OreList.json");
    }
    loadOreList(){
        this.Orelist=list;
        if(this.Orelist){
            for (let i=0;i<this.Orelist.length;i++){ 
                if (this.Orelist[i]){
                    this.insertOre(this.indexIntoNM(i), this.Orelist[i])}
            }
        }
    }
    initOreList(){this.Orelist = new Array(this.fieldH*this.fieldW);}
    
    tileWidthIs(){return width / this.viewNum;}
    draw(){
        const tileWidth = this.tileWidthIs()
        this.drawGrid(tileWidth);
        translate(this.viewX, this.viewY);
        rectMode(CENTER);
        for (let i=0;i<this.Ores.length;i++){ 
            if (this.Ores[i]){
                this.Ores[i].dragWithElement(this.viewX, this.viewY);
                if (this.buildings[i]){
                    if(this.buildings[i].layer){
                        this.Ores[i].queue[0].visibleChanger(true);
                    }
                    else{this.Ores[i].queue[0].visibleChanger(false);}
                }else {this.Ores[i].queue[0].visibleChanger(true);}
            }
        }
        // Images will : belt in lowest - other buildings - elements
        for (let building of this.buildings){ 
            if (building && building.type=='belt'){
                building.draw()
                building.dragWithElement(this.viewX, this.viewY);
            }
        }
        for (let building of this.buildings){ 
            if (building && building.type!=='belt'){
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
    //MouseX, Y into [n, m]
    clickedLattice(pointX, pointY){
        function makeLattice(point , ref, tilewidth){
            let varience = (point - ref)/(tilewidth/2);
            let lattice= (varience>=0?1:(-1)) * floor(( floor(abs(varience)) + 1)/2);
            if (lattice == -0) lattice = 0; 
            return lattice;
        }
        let lattice = [makeLattice(pointX, this.viewX, this.tileWidthIs()), -1 * makeLattice(pointY, this.viewY, this.tileWidthIs())]
        for (let lat of lattice) {
            if (abs(lat)>FIELD_HEIGHT/2){return [null, null];};
        }
        return lattice;
    }
    magnify(scrollDir){
        if (this.viewNum>8 && scrollDir<0) { this.viewNum = this.viewNum*0.8; }
        else if (this.viewNum<30 && scrollDir> 0){this.viewNum = this.viewNum*1.25;}
        else {this.viewNum = this.viewNum }
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
    takeType([n, m]){
        if (this.buildings[this.nmIntoIndex([n, m])]){
            return this.buildings[this.nmIntoIndex([n, m])].type;
        }
    }
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
        let building = this.buildings[this.nmIntoIndex([n,m])];
        if (building){
            if (building.type=='counterpart'){
                let originBuilding = this.buildings[this.nmIntoIndex(building.root)];
                originBuilding.delElemAll();
                this.unsubscribe(originBuilding);
                originBuilding.unsubscribeAll();
                this.buildings[this.nmIntoIndex(building.root)] =0;
            } else if(building.dual){
                console.log(building.latticeCounter)
                let slaveBuilding = this.buildings[this.nmIntoIndex(building.latticeCounter)];
                slaveBuilding.delElemAll();
                this.unsubscribe(slaveBuilding);
                slaveBuilding.unsubscribeAll();
                this.buildings[this.nmIntoIndex(building.latticeCounter)] = 0
            }
            if (!(building.invincible)){
                building.delElemAll();
                this.unsubscribe(building);
                building.unsubscribeAll();
            }
        };
        this.buildings[this.nmIntoIndex([n,m])]=0;
    }

    update(source, ...others){
        if (source == 'CheckNext'){
            // others: [next lattice, previous dirOut, now lattice, type of previous]
            let buildingToSee = this.buildings[this.nmIntoIndex(others[0])]
            let frombuilding = this.buildings[this.nmIntoIndex(others[2])]
            let solution
            if (buildingToSee){
                if(buildingToSee.dir[0]==others[1]){
                    let sol = ((buildingToSee.queue[0])?buildingToSee.queue[0].movingPercent:100 )
                    solution =sol>MIN_DIST;
                }
                else{solution = false}
            }
            else{solution = false}
            if (buildingToSee && buildingToSee.type =="miner"){
                if(frombuilding.type !="miner"){
                    solution = false
                }
            }
            if (buildingToSee && buildingToSee.type =="hubinlet"){
                solution = true
            }
            if (buildingToSee && buildingToSee.type =="counterpart"){
                if (!buildingToSee.inletOK){solution = false}
                if (buildingToSee.isJammed){solution = false}
            }
            this.notifySubscribers('IsNotJam', solution, others[0], others[2], (buildingToSee)?buildingToSee.type:'empty')
        }
        if (source == 'ElemTransferStart'){
            // others: [element, new [n, m]]
            //console.log(others);
            this.buildings[this.nmIntoIndex(others[1])].newElem(others[0]);
        }
        if (source == 'CounterpartElem'){
            // others: [element, root [rootN, rootM], lattice itself [n, m]]
            let loot = this.buildings[this.nmIntoIndex(others[1])];
            //console.log(others[2].toString());
            if (loot.dual && others[0] && (loot.latticeCounter.toString()==others[2].toString())){
                loot.newElemCounter(others[0]);
            }
            // others: [slave lattice itself [n, m], loot.queueCounterJam, loot.queueJam]
            this.notifySubscribers('IsRootJamed', others[2], loot.queueCounterJam, loot.queueJam)
        }
    }
}

export {Field};