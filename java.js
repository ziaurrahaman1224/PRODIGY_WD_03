const cells = document.querySelectorAll('.cell');
const board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let gameMode = 'player';

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const messageElement = document.getElementById('message');

const celebrateWin = () => {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
};

const handleResultValidation = () => {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        messageElement.textContent = `Player ${currentPlayer} has won! 🎉`;
        isGameActive = false;
        celebrateWin();
        return;
    }

    if (!board.includes('')) {
        messageElement.textContent = "It's a tie!";
        isGameActive = false;
        return;
    }
};

const handleCellClick = (e) => {
    const index = e.target.getAttribute('data-index');
    if (board[index] !== '' || !isGameActive) return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add(currentPlayer);

    handleResultValidation();

    if (isGameActive) {
        if (gameMode === 'ai' && currentPlayer === 'X') {
            currentPlayer = 'O';
            setTimeout(handleAIMove, 500);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
};

const handleAIMove = () => {
    const emptyCells = board.map((value, index) => value === '' ? index : null).filter(index => index !== null);
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    board[randomIndex] = 'O';
    cells[randomIndex].textContent = 'O';
    cells[randomIndex].classList.add('O');

    handleResultValidation();

    if (isGameActive) {
        currentPlayer = 'X';
    }
};

const handleRestartGame = () => {
    board.fill('');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
    });
    messageElement.textContent = '';
    currentPlayer = 'X';
    isGameActive = true;
};

const handleGameModeChange = (e) => {
    gameMode = e.target.value;
    handleRestartGame();
};

document.getElementById('reset-button').addEventListener('click', handleRestartGame);
document.getElementById('mode-select').addEventListener('change', handleGameModeChange);
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
});
