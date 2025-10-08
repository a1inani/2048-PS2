export const GRID_SIZE = 4;

let grid = null;
let score = 0;
let won = false;
let lost = false;
let animTiles = [];

class Tile {
  constructor(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.previousPosition = null;
    this.mergedFrom = null;
    this.new = true;
  }
  savePosition() { this.previousPosition = { x: this.x, y: this.y }; }
  updatePosition(pos) { this.x = pos.x; this.y = pos.y; }
}

function makeEmptyGrid() {
  const g = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    g[y] = [];
    for (let x = 0; x < GRID_SIZE; x++) g[y][x] = null;
  }
  return g;
}

export function init() { reset(); }

export function reset() {
  grid = makeEmptyGrid();
  score = 0;
  won = false;
  lost = false;
  animTiles = [];
  addRandomTile();
  addRandomTile();
}

export function getState() {
  return { grid, score, won, lost, animations: animTiles.slice(), size: GRID_SIZE };
}

export function addRandomTile() {
  const empties = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (!grid[y][x]) empties.push({ x, y });
    }
  }
  if (!empties.length) return false;
  const i = Math.floor(Math.random() * empties.length);
  const pos = empties[i];
  const tile = new Tile(pos.x, pos.y, Math.random() < 0.9 ? 2 : 4);
  grid[pos.y][pos.x] = tile;
  animTiles.push({ type: "appear", tile });
  return true;
}

function withinBounds(pos) { return pos.x >= 0 && pos.x < GRID_SIZE && pos.y >= 0 && pos.y < GRID_SIZE; }
function cellOccupied(pos) { return grid[pos.y][pos.x] !== null; }
function buildVector(d) { return {left:{x:-1,y:0}, right:{x:1,y:0}, up:{x:0,y:-1}, down:{x:0,y:1}}[d]; }
function positionsEqual(a,b){return a.x===b.x&&a.y===b.y;}

function findFarthestPosition(cell, v) {
  let prev;
  do { prev = cell; cell = {x:prev.x+v.x,y:prev.y+v.y}; }
  while (withinBounds(cell) && !cellOccupied(cell));
  return { farthest: prev, next: cell };
}

export function move(direction) {
  const vector = buildVector(direction);
  const traversals = { x: [0,1,2,3], y: [0,1,2,3] };
  if (vector.x === 1) traversals.x.reverse();
  if (vector.y === 1) traversals.y.reverse();
  let moved = false;
  animTiles = [];

  for (let y = 0; y < GRID_SIZE; y++)
    for (let x = 0; x < GRID_SIZE; x++)
      if (grid[y][x]) { grid[y][x].savePosition(); grid[y][x].mergedFrom = null; }

  traversals.x.forEach(x => {
    traversals.y.forEach(y => {
      const cell = grid[y][x];
      if (cell) {
        const positions = findFarthestPosition({x,y}, vector);
        const next = grid[positions.next.y]?.[positions.next.x];
        if (next && next.value === cell.value && !next.mergedFrom) {
          const merged = new Tile(positions.next.x, positions.next.y, cell.value*2);
          merged.mergedFrom = [cell,next];
          grid[y][x]=null; grid[positions.next.y][positions.next.x]=merged;
          score+=merged.value; if (merged.value===2048) won=true;
          animTiles.push({type:"merge",from:cell,to:merged});
          moved=true;
        } else {
          if (!positionsEqual({x,y},positions.farthest)) {
            moveTile(cell,positions.farthest);
            animTiles.push({type:"move",tile:cell,from:{x,y},to:positions.farthest});
            moved=true;
          }
        }
      }
    });
  });

  if (moved) { addRandomTile(); if (!movesAvailable()) lost=true; }
  return moved;
}

function moveTile(tile,pos){grid[tile.y][tile.x]=null;grid[pos.y][pos.x]=tile;tile.updatePosition(pos);}
function movesAvailable(){return cellsAvailable()||tileMatchesAvailable();}
function cellsAvailable(){for(let y=0;y<GRID_SIZE;y++)for(let x=0;x<GRID_SIZE;x++)if(!grid[y][x])return true;return false;}
function tileMatchesAvailable(){for(let y=0;y<GRID_SIZE;y++)for(let x=0;x<GRID_SIZE;x++){const t=grid[y][x];if(t){for(const d of ["left","right","up","down"]){const v=buildVector(d);const p={x:x+v.x,y:y+v.y};if(withinBounds(p)){const o=grid[p.y][p.x];if(o&&o.value===t.value)return true;}}}}return false;}
