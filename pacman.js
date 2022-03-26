const img1 = "./docs/assets/images/PacMan1.png";
const img2 = "./docs/assets/images/PacMan2.png";
const img3 = "./docs/assets/images/PacMan3.png";
const img4 = "./docs/assets/images/PacMan4.png";
const pacArray = [ [img1, img2] , [img3, img4] ];
var focus = 0;
const pacMen = [];  // This array holds all the pacmen
var time = null;
window.innerWidth = 600;
window.innerHeight= 600;

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
    img.style.position = 'relative';
    img.src = img1;
    img.style.width = 10;
    img.style.left = position.x + "px";
    img.style.top = position.y + "px";
    game.appendChild(img);
    return {
        position, velocity, img, direction
    };
}

function update() {
    const btn = document.querySelector("button.start");
    btn.disabled = true;
    focus = (focus + 1) % 2;
    pacMen.forEach((item) => {
        checkCollisions(item);
        item.img.src = pacArray[item.direction][focus];
        item.position.x += item.velocity.x;
        item.position.y += item.velocity.y;
        item.img.style.left = item.position.x +'px';
        item.img.style.top = item.position.y + 'px';
    });
    time = setTimeout(update, 125);
}

function checkCollisions(item) {
    let edgeW = window.innerWidth - item.img.width; let edgeH = window.innerHeight -item.img.width;
    if (item.position.x >= edgeW){item.velocity.x = item.velocity.x * -1; item.direction = 1;}
    if (item.position.x <=0){item.velocity.x = item.velocity.x * -1; item.direction = 0;}
    if (item.position.y >= edgeH || item.position.y <=0){item.velocity.y = item.velocity.y * -1;}
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


