// Constants for the game
export const FRAME_RATE = 50;
export const FIELD_WIDTH = 21;
export const FIELD_HEIGHT = 21;
// REF_SPEED % /s
export const REF_SPEED = 70 ;
export const MIN_DIST = 51;

export const FONT_SIZE = 25;
export const ElEM_RADIUS_INT = 0.4*0.5;
export const ElEM_RADIUS_RATIO = 0.2;
export const CANVAS_WIDTH = 2000;
export const CANVAS_HEIGHT = 1500;
// Need to multiply PI
export const DIR_VEC = {up:0 , right: 1/2, down:1, left:1.5};
export const DIR_LATTICE = {up:[0, 1] , right: [1, 0], down:[0, -1], left:[-1, 0]};
export const BUILDING_MODE = {belt:1, miner:2, cutter:3, rotater:4, balancer:5,
                                painter: 6}

export const COLOR_PALET = {r: 'crimson', g:'limegreen', b:'dodgerblue', 
                            y: 'gold', p: 'orchid', c: 'aqua',
                            u: 'grey', w:'ghostwhite', '-':'ghostwhite'}