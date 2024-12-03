const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20; // Ukuran grid
const canvasSize = 400;
const rows = canvasSize / gridSize;
const cols = canvasSize / gridSize;

let snake = [
    { x: 2, y: 2 }
];
let direction = 'RIGHT'; // Arah awal ular
let food = { x: 5, y: 5 };
let gameInterval;
let gamePaused = false;
let score = 0;

// Tombol kontrol
const startButton = document.getElementById('startGame');
const pauseButton = document.getElementById('pauseGame');
const resetButton = document.getElementById('resetGame');

// Tombol arah
const upButton = document.getElementById('upBtn');
const downButton = document.getElementById('downBtn');
const leftButton = document.getElementById('leftBtn');
const rightButton = document.getElementById('rightBtn');

// Fungsi untuk menggambar ular dan makanan
function drawGame() {
    // Membersihkan canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Menampilkan ular
    ctx.fillStyle = 'green';
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
    }

    // Menampilkan makanan
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Menampilkan skor
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Skor: ${score}`, 10, 30);
}

// Fungsi untuk menggerakkan ular
function moveSnake() {
    const head = { ...snake[0] };

    // Update posisi kepala ular berdasarkan arah
    if (direction === 'UP') head.y -= 1;
    if (direction === 'DOWN') head.y += 1;
    if (direction === 'LEFT') head.x -= 1;
    if (direction === 'RIGHT') head.x += 1;

    // Tambahkan kepala ke depan ular
    snake.unshift(head);

    // Jika ular makan makanan
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        spawnFood();
    } else {
        // Hapus ekor ular jika tidak makan
        snake.pop();
    }

    // Periksa tabrakan dengan tembok
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        gameOver();
    }

    // Periksa tabrakan dengan tubuh ular
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }

    drawGame();
}

// Fungsi untuk menghasilkan makanan baru
function spawnFood() {
    food = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows),
    };

    // Pastikan makanan tidak muncul di tempat ular
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === food.x && snake[i].y === food.y) {
            spawnFood();
        }
    }
}

// Fungsi untuk memulai game
function startGame() {
    snake = [{ x: 2, y: 2 }];
    direction = 'RIGHT';
    score = 0;
    gamePaused = false;
    spawnFood();
    gameInterval = setInterval(moveSnake, 100); // Update posisi ular setiap 100ms
    startButton.disabled = true;
    pauseButton.disabled = false;
    resetButton.disabled = false;
}

// Fungsi untuk menjeda game
function pauseGame() {
    clearInterval(gameInterval);
    gamePaused = true;
    pauseButton.disabled = true;
    startButton.disabled = false;
}

// Fungsi untuk melanjutkan game
function resumeGame() {
    gamePaused = false;
    gameInterval = setInterval(moveSnake, 100);
    pauseButton.disabled = false;
    startButton.disabled = true;
}

// Fungsi untuk mereset game
function resetGame() {
    clearInterval(gameInterval);
    startButton.disabled = false;
    pauseButton.disabled = true;
    resetButton.disabled = true;
    score = 0;
    snake = [{ x: 2, y: 2 }];
    direction = 'RIGHT';
    drawGame();
}

// Fungsi untuk mengakhiri game
function gameOver() {
    clearInterval(gameInterval);
    alert(`Game Over! Skor Anda: ${score}`);
    startButton.disabled = false;
    pauseButton.disabled = true;
    resetButton.disabled = true;
}

// Fungsi untuk menangani input tombol
function handleDirection(newDirection) {
    // Cegah ular berbalik arah ke arah yang berlawanan
    if (newDirection === 'UP' && direction !== 'DOWN') {
        direction = 'UP';
    } else if (newDirection === 'DOWN' && direction !== 'UP') {
        direction = 'DOWN';
    } else if (newDirection === 'LEFT' && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (newDirection === 'RIGHT' && direction !== 'LEFT') {
        direction = 'RIGHT';
    }
}

// Event Listeners untuk tombol kontrol
startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);
resetButton.addEventListener('click', resetGame);

// Menambahkan event listener untuk tombol layar sentuh
upButton.addEventListener('click', () => handleDirection('UP'));
downButton.addEventListener('click', () => handleDirection('DOWN'));
leftButton.addEventListener('click', () => handleDirection('LEFT'));
rightButton.addEventListener('click', () => handleDirection('RIGHT'));
