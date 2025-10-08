// {"name": "2048 Game", "author": "PS2 Port", "version": "1.0", "icon": "", "file": "main.js"}

// Game constants
const GRID_SIZE = 4;
const TILE_SIZE = 70.0;
const TILE_MARGIN = 8.0;
const GRID_PADDING = 15.0;

// Initialize font
const font = new Font("default");

// Colors
const BG_COLOR = Color.new(187, 173, 160, 255);
const EMPTY_TILE_COLOR = Color.new(205, 193, 180, 255);
const TEXT_COLOR = Color.new(119, 110, 101, 255);
const LIGHT_TEXT_COLOR = Color.new(249, 246, 242, 255);

// Tile colors lookup
function getTileColorValues(value) {
    switch(value) {
        case 0: return [205, 193, 180, 255];
        case 2: return [238, 228, 218, 255];
        case 4: return [237, 224, 200, 255];
        case 8: return [242, 177, 121, 255];
        case 16: return [245, 149, 99, 255];
        case 32: return [246, 124, 95, 255];
        case 64: return [246, 94, 59, 255];
        case 128: return [237, 207, 114, 255];
        case 256: return [237, 204, 97, 255];
        case 512: return [237, 200, 80, 255];
        case 1024: return [237, 197, 63, 255];
        case 2048: return [237, 194, 46, 255];
        default: return [60, 58, 50, 255];
    }
}

// Game state
let grid = [];
let score = 0;
let gameOver = false;
let won = false;
let moveDelay = 0;

// Initialize the grid
function initGrid() {
    grid = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        grid[i] = [];
        for (let j = 0; j < GRID_SIZE; j++) {
            grid[i][j] = 0;
        }
    }
    score = 0;
    gameOver = false;
    won = false;
    addNewTile();
    addNewTile();
}

// Add a new tile
function addNewTile() {
    const emptyCells = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] === 0) {
                emptyCells.push([i, j]);
            }
        }
    }
    
    if (emptyCells.length > 0) {
        const idx = Math.floor(Math.random() * emptyCells.length);
        const cell = emptyCells[idx];
        grid[cell[0]][cell[1]] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Check if any moves are possible
function canMove() {
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] === 0) return true;
            if (j < GRID_SIZE - 1 && grid[i][j] === grid[i][j + 1]) return true;
            if (i < GRID_SIZE - 1 && grid[i][j] === grid[i + 1][j]) return true;
        }
    }
    return false;
}

// Copy grid
function copyGrid() {
    const newGrid = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        newGrid[i] = [];
        for (let j = 0; j < GRID_SIZE; j++) {
            newGrid[i][j] = grid[i][j];
        }
    }
    return newGrid;
}

// Compare grids
function gridsEqual(g1, g2) {
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (g1[i][j] !== g2[i][j]) return false;
        }
    }
    return true;
}

// Move tiles
function move(direction) {
    if (gameOver) return false;
    
    const oldGrid = copyGrid();
    
    if (direction === 0) { // LEFT
        for (let i = 0; i < GRID_SIZE; i++) {
            let row = [];
            for (let j = 0; j < GRID_SIZE; j++) {
                if (grid[i][j] !== 0) row.push(grid[i][j]);
            }
            
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    score += row[j];
                    if (row[j] === 2048) won = true;
                    row.splice(j + 1, 1);
                }
            }
            
            for (let j = 0; j < GRID_SIZE; j++) {
                grid[i][j] = j < row.length ? row[j] : 0;
            }
        }
    } else if (direction === 1) { // RIGHT
        for (let i = 0; i < GRID_SIZE; i++) {
            let row = [];
            for (let j = 0; j < GRID_SIZE; j++) {
                if (grid[i][j] !== 0) row.push(grid[i][j]);
            }
            
            for (let j = row.length - 1; j > 0; j--) {
                if (row[j] === row[j - 1]) {
                    row[j] *= 2;
                    score += row[j];
                    if (row[j] === 2048) won = true;
                    row.splice(j - 1, 1);
                    j--;
                }
            }
            
            for (let j = 0; j < GRID_SIZE; j++) {
                grid[i][j] = j < GRID_SIZE - row.length ? 0 : row[j - (GRID_SIZE - row.length)];
            }
        }
    } else if (direction === 2) { // UP
        for (let j = 0; j < GRID_SIZE; j++) {
            let col = [];
            for (let i = 0; i < GRID_SIZE; i++) {
                if (grid[i][j] !== 0) col.push(grid[i][j]);
            }
            
            for (let i = 0; i < col.length - 1; i++) {
                if (col[i] === col[i + 1]) {
                    col[i] *= 2;
                    score += col[i];
                    if (col[i] === 2048) won = true;
                    col.splice(i + 1, 1);
                }
            }
            
            for (let i = 0; i < GRID_SIZE; i++) {
                grid[i][j] = i < col.length ? col[i] : 0;
            }
        }
    } else if (direction === 3) { // DOWN
        for (let j = 0; j < GRID_SIZE; j++) {
            let col = [];
            for (let i = 0; i < GRID_SIZE; i++) {
                if (grid[i][j] !== 0) col.push(grid[i][j]);
            }
            
            for (let i = col.length - 1; i > 0; i--) {
                if (col[i] === col[i - 1]) {
                    col[i] *= 2;
                    score += col[i];
                    if (col[i] === 2048) won = true;
                    col.splice(i - 1, 1);
                    i--;
                }
            }
            
            for (let i = 0; i < GRID_SIZE; i++) {
                grid[i][j] = i < GRID_SIZE - col.length ? 0 : col[i - (GRID_SIZE - col.length)];
            }
        }
    }
    
    const moved = !gridsEqual(grid, oldGrid);
    
    if (moved) {
        addNewTile();
        if (!canMove()) {
            gameOver = true;
        }
    }
    
    return moved;
}

// Draw a tile
function drawTile(x, y, value) {
    const colorVals = getTileColorValues(value);
    const color = Color.new(colorVals[0], colorVals[1], colorVals[2], colorVals[3]);
    Draw.rect(x, y, TILE_SIZE, TILE_SIZE, color);
    
    if (value > 0) {
        const text = value.toString();
        const textColor = value <= 4 ? TEXT_COLOR : LIGHT_TEXT_COLOR;
        font.color = textColor;
        
        const textLen = text.length;
        const textX = x + TILE_SIZE / 2.0 - textLen * 6.0;
        const textY = y + TILE_SIZE / 2.0 - 6.0;
        font.print(textX, textY, text);
    }
}

// Draw the grid
function drawGrid() {
    const totalWidth = GRID_SIZE * (TILE_SIZE + TILE_MARGIN) - TILE_MARGIN;
    const startX = 320.0 - totalWidth / 2.0;
    const startY = 80.0;
    
    const bgX = startX - GRID_PADDING;
    const bgY = startY - GRID_PADDING;
    const bgWidth = totalWidth + GRID_PADDING * 2.0;
    const bgHeight = totalWidth + GRID_PADDING * 2.0;
    Draw.rect(bgX, bgY, bgWidth, bgHeight, BG_COLOR);
    
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const x = startX + j * (TILE_SIZE + TILE_MARGIN);
            const y = startY + i * (TILE_SIZE + TILE_MARGIN);
            drawTile(x, y, grid[i][j]);
        }
    }
    
    font.color = TEXT_COLOR;
    font.print(10.0, 10.0, "Score: " + score);
    font.print(10.0, 40.0, "D-Pad: Move");
    font.print(10.0, 60.0, "START: New Game");
    
    if (gameOver) {
        font.color = Color.new(255, 0, 0, 255);
        font.print(250.0, 400.0, "Game Over!");
    } else if (won) {
        font.color = Color.new(0, 255, 0, 255);
        font.print(260.0, 400.0, "You Win!");
    }
}

// Initialize game
initGrid();

// Main loop
os.setInterval(() => {
    const pad = Pads.get(0);
    pad.update();
    
    if (moveDelay > 0) {
        moveDelay--;
    } else {
        if (pad.justPressed(Pads.START)) {
            initGrid();
            moveDelay = 10;
        } else if (pad.justPressed(Pads.UP)) {
            move(2);
            moveDelay = 10;
        } else if (pad.justPressed(Pads.DOWN)) {
            move(3);
            moveDelay = 10;
        } else if (pad.justPressed(Pads.LEFT)) {
            move(0);
            moveDelay = 10;
        } else if (pad.justPressed(Pads.RIGHT)) {
            move(1);
            moveDelay = 10;
        }
    }
    
    Screen.clear(Color.new(250, 248, 239, 255));
    drawGrid();
    Screen.flip();
}, 0);