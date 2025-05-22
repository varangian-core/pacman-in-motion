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
preloadImages();

// This function returns an object with random values
function generateRandom(scale) {
    return {
        x: Math.random() * scale, y: Math.random() * scale,
    };
}

function makePac() {
    let velocity = generateRandom(30);
    let position = generateRandom(400);
    let direction = 0;
    let game = document.getElementById('game');
    let img = document.createElement('img');
    img.style.position = 'absolute'; // Changed to absolute positioning
    img.src = pacArray[0][0]; // Initialize with closed mouth, facing right
    // img.style.width = 10; // Removed, CSS will handle sizing via height

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
    return {
        position, velocity, img, direction
    };
}

function update() {
    const btn = document.querySelector("button.start");
    btn.disabled = true;
    mouthFrame = (mouthFrame + 1) % 2; // Cycle mouthFrame 0, 1, 0, 1...
    pacMen.forEach((item) => {
        checkCollisions(item);
        // Update direction based on horizontal velocity
        if (item.velocity.x > 0) {
            item.direction = 0; // Facing right
        } else if (item.velocity.x < 0) {
            item.direction = 1; // Facing left
        }
        // If item.velocity.x === 0, direction remains unchanged

        item.img.src = pacArray[item.direction][mouthFrame];
        item.position.x += item.velocity.x;
        item.position.y += item.velocity.y;
        item.img.style.left = item.position.x +'px';
        item.img.style.top = item.position.y + 'px';
    });
    time = setTimeout(update, 50); // Smoother animation
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


