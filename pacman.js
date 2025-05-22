const pacArray = [
    ["./docs/assets/images/PacMan2.png", "./docs/assets/images/PacMan1.png"], // direction 0 (right): [closed, open]
    ["./docs/assets/images/PacMan4.png", "./docs/assets/images/PacMan3.png"]  // direction 1 (left): [closed, open]
];
const colorFilters = [
    'none', // Normal yellow
    'hue-rotate(90deg)', // Greenish
    'hue-rotate(180deg)', // Cyannish/Blueish
    'hue-rotate(270deg)', // Pinkish/Purpleish
    'saturate(2)', // More vibrant yellow
    'grayscale(100%)' // Black and White
];

const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
var mouthFrame = 0;
const pacMen = [];  // This array holds all the pacmen
let time = null; // Changed var to let
// const gameDiv = document.getElementById('game'); // It's better to define this where it's used or ensure DOM is loaded

// Function to preload images
function preloadImages() {
    for (let i = 0; i < pacArray.length; i++) {
        for (let j = 0; j < pacArray[i].length; j++) {
            const img = new Image();
            img.src = pacArray[i][j];
        }
    }
}

// Call preloadImages at the start
// preloadImages(); // Will be called after DOMContentLoaded

const cellSize = 20; // Define cell size for the maze

function renderMaze() {
    const gameDiv = document.getElementById('game');
    if (!gameDiv) {
        console.error('Game div not found! Cannot render maze.');
        return;
    }
    gameDiv.style.position = 'relative'; // Ensure gameDiv can contain positioned children
    
    // Dynamically set game container size
    if (maze.length > 0 && maze[0].length > 0) {
        gameDiv.style.width = maze[0].length * cellSize + 'px';
        gameDiv.style.height = maze.length * cellSize + 'px';
    } else {
        console.error('Maze is empty or invalid. Cannot set game dimensions.');
        return; // Don't proceed with rendering if maze is invalid
    }

    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            const cell = document.createElement('div');
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            cell.style.position = 'absolute';
            cell.style.left = `${j * cellSize}px`;
            cell.style.top = `${i * cellSize}px`;

            if (maze[i][j] === 1) {
                cell.classList.add('maze-wall');
            } else {
                cell.classList.add('maze-path');
            }
            gameDiv.appendChild(cell);
        }
    }
}

// Call renderMaze to draw the maze on script load
// renderMaze(); // Will be called after DOMContentLoaded

document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    renderMaze();
});

// Helper function to get cell type (0 for path, 1 for wall)
function getCellType(pixelX, pixelY) {
    const gridCol = Math.floor(pixelX / cellSize);
    const gridRow = Math.floor(pixelY / cellSize);

    // Check if out of maze bounds
    if (gridRow < 0 || gridRow >= maze.length || gridCol < 0 || gridCol >= maze[0].length) {
        return 1; // Treat out-of-bounds as a wall
    }
    return maze[gridRow][gridCol];
}

// This function returns an object with random values
function generateRandom(scale) {
    return {
        x: Math.random() * scale, y: Math.random() * scale,
    };
}

function makePac() {
    let velocity = generateRandom(30); // Will be refined later
    let direction = 0;
    let initialGridPos = null;

    // Find the first path cell (0) in the maze
    for (let r = 0; r < maze.length; r++) {
        for (let c = 0; c < maze[r].length; c++) {
            if (maze[r][c] === 0) {
                initialGridPos = { row: r, col: c };
                break;
            }
        }
        if (initialGridPos) break;
    }

    // If no path is found, default to a position (though this shouldn't happen with the current maze)
    if (!initialGridPos) {
        initialGridPos = { row: 1, col: 1 }; // Fallback
        console.warn("No path found in maze for PacMan, defaulting to 1,1");
    }

    let position = {
        x: initialGridPos.col * cellSize,
        y: initialGridPos.row * cellSize
    };

    let game = document.getElementById('game');
    let img = document.createElement('img');
    img.style.position = 'absolute';
    img.src = pacArray[0][0]; // Initialize with closed mouth, facing right
    img.style.width = cellSize + "px"; // Set width to cellSize
    img.style.height = cellSize + "px"; // Set height to cellSize

    // Apply a random color filter
    const randomFilter = colorFilters[Math.floor(Math.random() * colorFilters.length)];
    img.style.filter = randomFilter;

    img.style.left = position.x + "px";
    img.style.top = position.y + "px";

    // Click-to-remove event listener
    img.addEventListener('click', function() {
        game.removeChild(img); // Remove image from DOM
        const index = pacMen.findIndex(p => p.img === img);
        if (index !== -1) {
            pacMen.splice(index, 1); // Remove Pac-Man from the array
        }
    });

    game.appendChild(img);

    const isPlayer = pacMen.length === 0; // First PacMan is player controlled

    return {
        position,
        velocity: isPlayer ? {x: 0, y: 0} : velocity, // Player PacMan doesn't use random velocity
        img,
        direction,
        gridPosition: { row: initialGridPos.row, col: initialGridPos.col },
        intendedDirection: null, // Will store 'ArrowUp', 'ArrowDown', etc.
        isPlayerControlled: isPlayer
    };
}

// Keyboard event listener for player control
document.addEventListener('keydown', (event) => {
    const playerPacMan = pacMen.find(p => p.isPlayerControlled);
    if (playerPacMan) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault(); // Prevent scrolling
            playerPacMan.intendedDirection = event.key;
        }
    }
});

function update() {
    const btn = document.querySelector("button.start");
    btn.disabled = true;
    mouthFrame = (mouthFrame + 1) % 2; // Cycle mouthFrame 0, 1, 0, 1...
    pacMen.forEach((item) => {
        if (item.isPlayerControlled) {
            if (item.intendedDirection) {
                let nextGridPosition = { ...item.gridPosition };
                let newDirection = item.direction;

                switch (item.intendedDirection) {
                    case 'ArrowUp':
                        nextGridPosition.row -= 1;
                        // item.direction remains based on last horizontal movement or defaults
                        break;
                    case 'ArrowDown':
                        nextGridPosition.row += 1;
                        // item.direction remains
                        break;
                    case 'ArrowLeft':
                        nextGridPosition.col -= 1;
                        newDirection = 1; // Facing left
                        break;
                    case 'ArrowRight':
                        nextGridPosition.col += 1;
                        newDirection = 0; // Facing right
                        break;
                }
                item.direction = newDirection; // Update direction even if move is blocked

                // Wall collision detection
                const r_next = nextGridPosition.row;
                const c_next = nextGridPosition.col;

                // Check bounds and if the next cell is a path (0)
                if (r_next >= 0 && r_next < maze.length &&
                    c_next >= 0 && c_next < maze[0].length &&
                    maze[r_next][c_next] === 0) {
                    
                    // Valid move: Update grid position and pixel position
                    item.gridPosition = nextGridPosition;
                    item.position.x = item.gridPosition.col * cellSize;
                    item.position.y = item.gridPosition.row * cellSize;

                    item.img.style.left = item.position.x + 'px';
                    item.img.style.top = item.position.y + 'px';
                } else {
                    // Invalid move (wall or out of bounds): PacMan doesn't move.
                    // Position remains unchanged. IntendedDirection is kept.
                }
                // Player PacMan does not use checkCollisions for screen boundaries
            }
            // Mouth animation for player - always update mouth and facing direction
            item.img.src = pacArray[item.direction][mouthFrame];

        } else { // AI PacMen
            let newX = item.position.x + item.velocity.x;
            let newY = item.position.y + item.velocity.y;

            // Define corners for collision detection based on newX, newY
            // Using cellSize-1 for right/bottom to check within the target cell, not the next cell's boundary
            const pacmanLeft = newX;
            const pacmanRight = newX + cellSize -1; // item.img.width is cellSize
            const pacmanTop = newY;
            const pacmanBottom = newY + cellSize -1; // item.img.height is cellSize

            // Horizontal collision check
            if (item.velocity.x > 0) { // Moving right
                if (getCellType(pacmanRight, pacmanTop) === 1 || getCellType(pacmanRight, pacmanBottom) === 1) {
                    item.velocity.x *= -1;
                    newX = item.position.x; // Don't update X
                }
            } else if (item.velocity.x < 0) { // Moving left
                if (getCellType(pacmanLeft, pacmanTop) === 1 || getCellType(pacmanLeft, pacmanBottom) === 1) {
                    item.velocity.x *= -1;
                    newX = item.position.x; // Don't update X
                }
            }

            // Vertical collision check
            // For these checks, use the original newX for left/right boundaries of the PacMan
            // to correctly predict vertical collision based on the intended horizontal position.
            // However, if newX was reset due to horizontal collision, use item.position.x
            const checkXLeft = (newX === item.position.x) ? item.position.x : pacmanLeft; // if newX was reset by horizontal collision
            const checkXRight = (newX === item.position.x) ? item.position.x + cellSize -1 : pacmanRight;


            if (item.velocity.y > 0) { // Moving down
                 // Use the horizontal position resulting from horizontal checks
                if (getCellType(checkXLeft, pacmanBottom) === 1 || getCellType(checkXRight, pacmanBottom) === 1) {
                    item.velocity.y *= -1;
                    newY = item.position.y; // Don't update Y
                }
            } else if (item.velocity.y < 0) { // Moving up
                if (getCellType(checkXLeft, pacmanTop) === 1 || getCellType(checkXRight, pacmanTop) === 1) {
                    item.velocity.y *= -1;
                    newY = item.position.y; // Don't update Y
                }
            }

            item.position.x = newX;
            item.position.y = newY;

            // Update visual direction based on new velocity
            if (item.velocity.x > 0) item.direction = 0; // Facing right
            else if (item.velocity.x < 0) item.direction = 1; // Facing left

            item.img.src = pacArray[item.direction][mouthFrame];
            item.img.style.left = item.position.x + 'px';
            item.img.style.top = item.position.y + 'px';
            
            checkCollisions(item); // Original screen boundary checks
        }
    });
    time = setTimeout(update, 200); // Adjusted for grid movement visibility
}

// It's generally better to get gameDiv inside functions that need it,
// or ensure it's initialized after the DOM is fully loaded if defined globally.
// For this case, getting it inside checkCollisions is safest.
function checkCollisions(item) {
    const gameDiv = document.getElementById('game');
    if (!gameDiv) return; // Guard clause if gameDiv isn't found

    let edgeW = gameDiv.offsetWidth - item.img.width;
    let edgeH = gameDiv.offsetHeight - item.img.height; // Used item.img.height

    if (item.position.x >= edgeW || item.position.x <=0) {
        item.velocity.x = item.velocity.x * -1;
    }
    if (item.position.y >= edgeH || item.position.y <=0) {
        item.velocity.y = item.velocity.y * -1;
    }
}

function makeOne() {
    pacMen.push(makePac());
}


function stop() {
    clearInterval(time);
    time = null;
    const btn = document.querySelector("button.start");
    btn.disabled = false;

}


function reset(){
    location.reload();
    return false;
}


