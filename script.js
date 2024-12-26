const grid = document.getElementById('grid');
const hintContainer = document.getElementById('hintContainer');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const resetButton = document.getElementById('resetGame');
const difficultyButtons = document.querySelectorAll('#infoPanel button');
const clickSound = document.getElementById('clickSound');
const treasureSound = document.getElementById('treasureSound');

let gridSize = 6;
let treasures = [];
let score = 0;
let timer = 60;
let countdown;

function createGrid() {
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.addEventListener('click', () => checkTreasure(i, cell));
        grid.appendChild(cell);
    }
}

function placeTreasures(num) {
    treasures = [];
    while (treasures.length < num) {
        const randomIndex = Math.floor(Math.random() * gridSize * gridSize);
        if (!treasures.includes(randomIndex)) {
            treasures.push(randomIndex);
        }
    }
}

function checkTreasure(index, cell) {
    clickSound.play();
    if (treasures.includes(index)) {
        cell.classList.add('treasure');
        showHint('You found a treasure!');
        score += 10;
        treasureSound.play();
        scoreDisplay.textContent = score;
    } else {
        showHint(getHint(index));
    }
}

function getHint(index) {
    let nearestDistance = Infinity;
    treasures.forEach((treasureIndex) => {
        const distance = Math.abs(index % gridSize - treasureIndex % gridSize) +
                         Math.abs(Math.floor(index / gridSize) - Math.floor(treasureIndex / gridSize));
        nearestDistance = Math.min(nearestDistance, distance);
    });
    return `You are ${nearestDistance} step${nearestDistance > 1 ? 's' : ''} away from a treasure.`;
}

function showHint(message) {
    hintContainer.textContent = message;
}

function resetGame() {
    clearInterval(countdown);
    score = 0;
    timer = 60;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timer;
    createGrid();
    placeTreasures(gridSize === 6 ? 3 : gridSize === 8 ? 5 : 7);
    showHint('Start finding treasures!');
    startTimer();
}

function startTimer() {
    countdown = setInterval(() => {
        timer--;
        timerDisplay.textContent = timer;
        if (timer <= 0) {
            clearInterval(countdown);
            showHint('Time is up! Game Over!');
        }
    }, 1000);
}

difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        switch (button.id) {
            case 'easy':
                gridSize = 6;
                break;
            case 'medium':
                gridSize = 8;
                break;
            case 'hard':
                gridSize = 10;
                break;
        }
        resetGame();
    });
});

resetButton.addEventListener('click', resetGame);
resetGame();
