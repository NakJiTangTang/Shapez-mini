

**Name: Lee Nak Hyeong** 

**Student ID: 20200437**

**Repository URL: [Here](http://git.prototyping.id/20200437/homework5)**

 
 
## Table of Contents

- [Shapez.io](#shapezio)
  - [Game goal](#game-goal)
  - [Core mechanics](#core-mechanics)
    - [Building blocks](#building-blocks)
    - [Extraction](#extraction)
    - [Modification](#modification)
    - [Upgrade](#upgrade)
  - [How to implement](#how-to-implement)
    - [Scope](#scope)
    - [Basic Idea](#basic-idea)
  - [Expecting challange](#expecting-challange)



# Shapez.io

![main](http://git.prototyping.id/20200437/homework5/raw/branch/main/sources/Main.png)

Construction management simulation io game released on May 21, 2020. As its name suggests, Shapez is a game that consists of a factory that extracts shapes and pigments, cuts and combines shapes, and colors them to produce various shapes.

It is free for web games, which are generally a feature of well-known io games, also [open-sources](https://github.com/tobspr-games/shapez.io). Actually web version is only available for a trial version, and the full version is sold for 13,000 won on [Steam](https://store.steampowered.com/app/1318690/shapez/).


## Game goal

![structure](http://git.prototyping.id/20200437/homework5/raw/branch/main/sources/game_structure.webp)

The main objective of shapez.io is to design and build factories to produce various shapes. The game starts with a basic set of tools, and players must gather materials(shape & dye), construct  production lines(cut, rotate, merge, stack, color), and create production lines to manufacture different items.

There is no strict win and lose in this game. As players progress through the game, they encounter more complex shapes to make, which require more advanced and efficient production processes. 

But what the player should consider is optimization, since each level need a huge amount of target shapes. The ultimate goal is to create a highly optimized and automated factory that can produce all the required items as efficiently as possible, to avoid long waiting.

## Core mechanics
### Building blocks

![building](http://git.prototyping.id/20200437/homework5/raw/branch/main/sources/elements-01.jpg)
![ores](http://git.prototyping.id/20200437/homework5/raw/branch/main/sources/elements-02.jpg)

The game basically consists of elements of shapes/dyes and building that transports/processes them. Each element on the belt can move only when there is _no traffic jam_.


### Extraction
![Extract](http://git.prototyping.id/20200437/homework5/raw/branch/main/sources/play-03.jpg)
By placing _Extractor_ on the ore tile, each ore elements pop out. Player can connect the extractor and hub using belts, through simpy dragging along the path. 
Each ore tile can consist of basic shape (4 part of the shape is all the same), dye or mixed shape. Since each tile are spread throughout all field randomly, 

### Modification
![Modification](http://git.prototyping.id/20200437/homework5/raw/branch/main/sources/play-04.jpg)
To make wanted shape, player should build their own production line. Each element can be modified by placing on the conveyor belt or connecting building, as there are buildings that perform one function each. When the player goes over the stage, a building with better functionality will be available.

- For each elements: Cut in half/quad, Rotate, Paint color
- For two elements: (Merge, Stack), Color mix
- Conviniences: Merge/Split conveyer belt, Wormhole, Storage, Speed checker
### Upgrade
![Upgrade](http://git.prototyping.id/20200437/homework5/raw/branch/main/sources/Upgrades.png)
The upgrade requires existing shapes, not the target shape of the stage. The upgrade does not add new features, but increases the speed & effieicncy of each feature. Therefore, players need to produce more diverse shapes at once, not just to clear the stage, but to create more efficient production line.

## How to implement

### Scope
Since I mentioned before, it is [open-sources.](https://github.com/tobspr-games/shapez.io) But in this project, I would like to aim to implement part of the game based on p5.js without referring to this. The reason is that first, the project should be completed within three weeks, and more importantly, I thought it was possible to implement many parts with what I learned in class.

Now my idea is to implement the building up to the third section of this [list](#building-blocks). And I'm thinking about simplifying the stage system and changing only the shape of the target.
In fact, there are additional buildings, such as logical circuit buildings, for highly skilled users, but this part will be omitted. (It makes game too loose, deep depth)

### Basic Idea

As far as I'm concerned, choosing OOP is the best intuitive way. By default, each figure can have a total of 4 layers, and each layer gathers 4 different shapes and colors. So I'm thinking about objectifying each element on the belt like in the game, moving it on the belt, and transforming it accordingly when they meet a building.

```Javascript

const Field = []; //Including buldings
const Elements = []; //Including each shape elements


// Each layer
class layer{
  constructor(s1, s2, s3, s4, c1=0, c2=0, c3=0, c4=0) {
    this.layer=[[s1, c1], [s2, c2], [s3, c3], [s4, c4]];
  }
  draw(x, y, size){}
  rotate(){}
}

class element{
  constructor(x, y, lowest, low, high, highest) {
    this.layers = [lowest, low, high, highest];
    this._x = x;
    this._y = y;
    this.show = true;
    }
  drawElement(){
    for (let i =0; i<4 ; i++){
        this.layers[i].draw(_x, _y, 100-i*10);
    }
  }
  isJammed(){}
  move(){}
  rotate(){}
  isEnterBuilding(){
    // not jammed, element is on the entrace of building
  }
  getWhatBuilding(){... return buildingObject}
  elementReact(){
    if (isEnterBuildiing) {
        getWhatBuilding.enter(this.layers);
        this.show = false;
    }
  }

// Each building: on the tile, so let (i, j)
class exampleBuilding{
    constructor(i, j, direction) {
        this._i = i;
        this._j = j;
        this._dir=direction; //up down left right: u, d, l, r
        this.speed = SpeedList.exampleBuilding;
        this.queue =[];
    }
    draw(){}
    enter(layers){
        let countDown = this.speed;
        this.queue.push([layers, countDown]);
    }
    act(){// characteristic action
    }
    common(){
        // Every time each countDown of layers will -1 (@ each refreshing). when =0, it will reacts
    }
}

  setup(){... frameRate(30)}
  draw(){... 
  //each building -> do common
  //each shape -> elementReact
  //each shape -> if this.show=false -> deleted
  
  }
}

```


## Expecting challange

1. Number of Objects: Hundreds of objects will be contained on a single screen if it goes this way. Therefore, I wonder if the browser can withstand this much. If there is a problem such as lagging, all mechanisms must be changed to solve it.
   
    ![Upgrade](http://git.prototyping.id/20200437/homework5/raw/branch/main/sources/Coordinate.png)

2. Field Coordinate Calculation: I want to create a coordinate with the center of the field as (0, 0), but it is impossible to apply negative coordinates in the actual array. Therefore, I'm first considering creating a general array and placing each element in a spiral shape. But I'm not sure this is a widely known way. Of course, the movement of each shape element consists of simple x and y, but a large amount of coordinate transformation is expected to proceed in each building and ore placement, and the task load is likely to increase.
3. Time management problem: since it's my first time working on a project in this format, I can't guess if it's possible to do the full amount planned. Therefore, I'm thinking of make only the basic structure first and then adding elements.