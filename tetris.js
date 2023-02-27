const grid = document.querySelector(".grid")
for(let i=0; i<200; i++){
    const gridDiv = document.createElement("div");
    // gridDiv.textContent = i;
    grid.appendChild(gridDiv);
}
for(let i=0; i<10; i++){
    const gridDiv = document.createElement('div');
    gridDiv.classList.add("taken")
    grid.appendChild(gridDiv);
}

let squares = Array.from(document.querySelectorAll(".grid div"))
const width = 10;
const scoreDisplay = document.getElementById("score");
const startBtn = document.querySelector("button");
const miniGrid = document.querySelector(".mini_grid");
let nextRandom = 0;
let timerId;
let score = 0;

for(let i=0; i<16; i++){
    const miniGridDiv = document.createElement('div');
    // gridDiv.classList.add("taken")
    miniGrid.appendChild(miniGridDiv);
}

// Tetrominoes

const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]
const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
]

const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
]

const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
]

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
let currentPosition = 4;

//random selection of tetromino
let randomTetromino = Math.floor(Math.random()*theTetrominoes.length);
let randomRotation = Math.floor(Math.random()*theTetrominoes[randomTetromino].length);
let current = theTetrominoes[randomTetromino][randomRotation];

//draw the first rotation in the first tetromino

function draw(){
    console.log(`${randomTetromino}, ${randomRotation}`)
    current.forEach(index =>{
        squares[currentPosition + index].classList.add("tetromino");
    })
}

function undraw(){
    current.forEach(index=>{
        squares[currentPosition + index].classList.remove('tetromino')
    })
}

document.addEventListener('keydown', control)
//assign functions to keyCodes
function control(e){
    if(e.keyCode === 37){
        moveLeft();
    }
    else if(e.keyCode === 39){
        moveRight();
    }
    else if(e.keyCode === 40){
        moveDown();
    }
    else if(e.keyCode === 38){
        rotation();
    }
}


//move down function
function moveDown(){
    undraw();
    currentPosition+=10;
    draw();
    freeze();
}

//make the tetromino move down at every second
// timerId = setInterval(moveDown, 1000);

function freeze(){
    if(current.some(index => squares[currentPosition + index + width].classList.contains("taken"))){
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        
        //start a new tetromino falling
            randomTetromino = nextRandom;
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            randomRotation = Math.floor(Math.random()*theTetrominoes[randomTetromino].length);
            currentPosition = 4;
            current = theTetrominoes[randomTetromino][randomRotation];
            draw();
            displayShape();
            addScore();
    }
}

//rules of moving tetromino
function moveLeft(){
    undraw();

    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    
    if(!isAtLeftEdge){
        currentPosition-=1;
    }
    if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
    {
        currentPosition += 1;
    }
    draw();
}
function moveRight(){
    undraw();
    const isAtRightEdge = current.some(index=>(currentPosition + index)%width===9);
    if(!isAtRightEdge){
        currentPosition+=1;
    }
    if(current.some(index=>squares[currentPosition + index].classList.contains('taken'))){
        current.currentPosition-=1;
    }
    draw();
}

function rotation(){
    undraw();
    randomRotation++;
    if(randomRotation>3){
        randomRotation = 0;
    }
    current=theTetrominoes[randomTetromino][randomRotation];
    draw();
}

const displaySquares = document.querySelectorAll('.mini_grid div');
const displayWidth = 4;
let displayIndex = 0;


const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //l
    [0,displayWidth,displayWidth+1,displayWidth*2+1], //z
    [1,displayWidth,displayWidth+1,displayWidth+2], //t 
    [0,1,displayWidth,displayWidth+1], //o
    [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1]]; //i

//display the shape in the mini-grid display
function displayShape(){
    displaySquares.forEach(square=>{
        square.classList.remove('tetromino')
    })
    upNextTetrominoes[nextRandom].forEach(index => {
        displaySquares[displayIndex+index].classList.add("tetromino")
    })
}

startBtn.addEventListener('click', ()=>{
    if(timerId){
        clearInterval(timerId);
        timerId = null;
    }
    else{
        draw();
        timerId = setInterval(moveDown, 1000);
        nextRandom = Math.floor(Math.random()*theTetrominoes.length);
        displayShape();
    }
})


function addScore(){
    for(let i =0; i<200; i+=width){
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
        
        if(row.every(index=>squares[index].classList.contains('taken'))){
            score+=10;
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetromino');
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell))
        }
    }

    
}
// The tetrominos without rotations



// document.addEventListener('DOMContentLoaded', () => {

// })
