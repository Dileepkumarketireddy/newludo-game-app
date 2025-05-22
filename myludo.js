// Game configuration
const BOARD_SIZE = 15;
const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;
const TOKENS_PER_PLAYER = 4;
const WINNING_SCORE = 57; // Number of cells in the path to home

// DOM elements
const boardEl = document.getElementById('board');
const diceEl = document.getElementById('dice');
const diceContainerEl = document.getElementById('diceContainer');
const statusEl = document.getElementById('status');
const rollBtn = document.getElementById('rollBtn');
const passBtn = document.getElementById('passBtn');
const playerInfoEl = document.getElementById('playerInfo');

// New DOM elements for Game Over screen
const gameOverOverlay = document.getElementById('gameOverOverlay');
const gameOverMessage = document.getElementById('gameOverMessage');
const newGameBtn = document.getElementById('newGameBtn');

// Game state
let currentPlayerIndex = 0;
let diceValue = 0;
let gameEnded = false;
let selectedTokenIndex = -1;
let sixRolled = false;
let moveMade = false;

// Players data (initial state, will be reset for new game)
let players = []; // Initialize as empty, will be filled in resetGame

// Board cells
const cells = [];

// Initialize or reset game
function resetGame() {
    // Reset player data to initial state
    players = [
        {
            name: 'Red',
            color: 'red',
            tokens: Array(TOKENS_PER_PLAYER).fill(-1),
            homeIndices: [],
            startIndex: -1,
            pathIndices: [],
            finishedTokens: 0
        },
        {
            name: 'Green',
            color: 'green',
            tokens: Array(TOKENS_PER_PLAYER).fill(-1),
            homeIndices: [],
            startIndex: -1,
            pathIndices: [],
            finishedTokens: 0
        },
        {
            name: 'Yellow',
            color: 'yellow',
            tokens: Array(TOKENS_PER_PLAYER).fill(-1),
            homeIndices: [],
            startIndex: -1,
            pathIndices: [],
            finishedTokens: 0
        },
        {
            name: 'Blue',
            color: 'blue',
            tokens: Array(TOKENS_PER_PLAYER).fill(-1),
            homeIndices: [],
            startIndex: -1,
            pathIndices: [],
            finishedTokens: 0
        }
    ];

    currentPlayerIndex = 0;
    diceValue = 0;
    gameEnded = false;
    selectedTokenIndex = -1;
    sixRolled = false;
    moveMade = false;

    // Hide game over overlay
    gameOverOverlay.classList.remove('show');

    // Re-initialize board elements and game state
    createBoard();
    setupHomes();
    setupPaths();
    renderPlayerInfo();
    renderTokens();
    updateUI();
    statusEl.textContent = `${players[currentPlayerIndex].name}'s turn - Roll the dice to start!`;
}

// Initial game setup
function initGame() {
    resetGame(); // Call resetGame to set up initial state
}

// Create the board grid
function createBoard() {
    boardEl.innerHTML = '';
    cells.length = 0; // Clear existing cells array
    for (let i = 0; i < TOTAL_CELLS; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cells.push(cell);
        boardEl.appendChild(cell);
    }
}

// Setup home areas for each player
function setupHomes() {
    // Red home (top-left 6x6)
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            const idx = r * BOARD_SIZE + c;
            cells[idx].classList.add('home-red');
            players[0].homeIndices.push(idx);
        }
    }

    // Green home (top-right 6x6)
    for (let r = 0; r < 6; r++) {
        for (let c = 9; c < 15; c++) {
            const idx = r * BOARD_SIZE + c;
            cells[idx].classList.add('home-green');
            players[1].homeIndices.push(idx);
        }
    }

    // Yellow home (bottom-left 6x6)
    for (let r = 9; r < 15; r++) {
        for (let c = 0; c < 6; c++) {
            const idx = r * BOARD_SIZE + c;
            cells[idx].classList.add('home-yellow');
            players[2].homeIndices.push(idx);
        }
    }

    // Blue home (bottom-right 6x6)
    for (let r = 9; r < 15; r++) {
        for (let c = 9; c < 15; c++) {
            const idx = r * BOARD_SIZE + c;
            cells[idx].classList.add('home-blue');
            players[3].homeIndices.push(idx);
        }
    }

    // Set start positions (simplified for demo)
    players[0].startIndex = 6 * BOARD_SIZE + 1;  // Red start
    players[1].startIndex = 1 * BOARD_SIZE + 8;  // Green start
    players[2].startIndex = 8 * BOARD_SIZE + 6;  // Yellow start
    players[3].startIndex = 13 * BOARD_SIZE + 8; // Blue start
}

// Setup path cells (simplified path for demo)
function setupPaths() {
    // Common path cells (example, needs proper Ludo path logic)
    // This is a simplified path for demonstration purposes.
    // A real Ludo game would have more complex path definition.
    const commonPath = [
        6*BOARD_SIZE + 1, 7*BOARD_SIZE + 1, 8*BOARD_SIZE + 1, 9*BOARD_SIZE + 1, 10*BOARD_SIZE + 1,
        10*BOARD_SIZE + 2, 10*BOARD_SIZE + 3, 10*BOARD_SIZE + 4, 10*BOARD_SIZE + 5, 10*BOARD_SIZE + 6,
        9*BOARD_SIZE + 6, 8*BOARD_SIZE + 6, 7*BOARD_SIZE + 6, 6*BOARD_SIZE + 6, 5*BOARD_SIZE + 6,
        5*BOARD_SIZE + 7, 5*BOARD_SIZE + 8, 5*BOARD_SIZE + 9, 5*BOARD_SIZE + 10, 5*BOARD_SIZE + 11,
        6*BOARD_SIZE + 11, 7*BOARD_SIZE + 11, 8*BOARD_SIZE + 11, 9*BOARD_SIZE + 11, 10*BOARD_SIZE + 11,
        10*BOARD_SIZE + 12, 10*BOARD_SIZE + 13, 10*BOARD_SIZE + 14,
        9*BOARD_SIZE + 14, 8*BOARD_SIZE + 14, 7*BOARD_SIZE + 14, 6*BOARD_SIZE + 14,
        5*BOARD_SIZE + 14, 4*BOARD_SIZE + 14, 3*BOARD_SIZE + 14, 2*BOARD_SIZE + 14, 1*BOARD_SIZE + 14,
        1*BOARD_SIZE + 13, 1*BOARD_SIZE + 12, 1*BOARD_SIZE + 11, 1*BOARD_SIZE + 10, 1*BOARD_SIZE + 9,
        2*BOARD_SIZE + 9, 3*BOARD_SIZE + 9, 4*BOARD_SIZE + 9, 5*BOARD_SIZE + 9,
        // The following part would be the player's specific home path
        // For Red, path to home
        6*BOARD_SIZE + 7, 6*BOARD_SIZE + 8, 6*BOARD_SIZE + 9, 6*BOARD_SIZE + 10, 6*BOARD_SIZE + 11, 6*BOARD_SIZE + 12,
        // For Green, path to home
        2*BOARD_SIZE + 7, 3*BOARD_SIZE + 7, 4*BOARD_SIZE + 7, 5*BOARD_SIZE + 7, 6*BOARD_SIZE + 7, 7*BOARD_SIZE + 7,
        // For Yellow, path to home
        8*BOARD_SIZE + 7, 8*BOARD_SIZE + 8, 8*BOARD_SIZE + 9, 8*BOARD_SIZE + 10, 8*BOARD_SIZE + 11, 8*BOARD_SIZE + 12,
        // For Blue, path to home
        7*BOARD_SIZE + 2, 7*BOARD_SIZE + 3, 7*BOARD_SIZE + 4, 7*BOARD_SIZE + 5, 7*BOARD_SIZE + 6, 7*BOARD_SIZE + 7,
    ];

    // Mark path cells
    commonPath.forEach(idx => {
        if (cells[idx]) { // Ensure cell exists
            cells[idx].classList.add('path');
        }
    });

    // Mark safe zones (stars) - these are the entry points after a 6
    const safeZones = [
        players[0].startIndex, // Red Start
        players[1].startIndex, // Green Start
        players[2].startIndex, // Yellow Start
        players[3].startIndex  // Blue Start
    ];
    safeZones.forEach(idx => {
        if (cells[idx]) { // Ensure cell exists
            cells[idx].classList.add('safe-zone', 'star');
        }
    });

    // Define player-specific paths including home stretch
    // This is a simplified representation. In a full Ludo, you'd define the exact sequence of cell indices for each player's path.
    // For this example, we'll assume a generic common path and then an abstract 'WINNING_SCORE'
    // A more robust Ludo game would define each player's specific path, including their home stretch.
    // For now, we'll just map the common path for all and handle `WINNING_SCORE` as the final state.
    players.forEach(player => {
        player.pathIndices = []; // Reset for new game
        // For a true Ludo game, you'd define this sequence:
        // player.pathIndices = [start_cell_idx, ..., last_cell_before_home_idx, home_stretch_1, ..., home_stretch_6];
        // For now, it's abstract.
    });
}

// Render player information
function renderPlayerInfo() {
    playerInfoEl.innerHTML = '';
    players.forEach((player, index) => {
        const playerCard = document.createElement('div');
        playerCard.className = `player-card ${player.color} ${index === currentPlayerIndex ? 'active' : ''}`;

        const colorIndicator = document.createElement('div');
        colorIndicator.className = `player-color ${player.color}`;

        const nameSpan = document.createElement('span');
        nameSpan.className = 'player-name';
        nameSpan.textContent = player.name;

        const tokensSpan = document.createElement('span');
        tokensSpan.className = 'player-tokens';
        tokensSpan.textContent = `Tokens: ${player.finishedTokens}/${TOKENS_PER_PLAYER}`;

        playerCard.appendChild(colorIndicator);
        playerCard.appendChild(nameSpan);
        playerCard.appendChild(tokensSpan);
        playerInfoEl.appendChild(playerCard);
    });
}

// Clear all tokens from the board
function clearTokens() {
    cells.forEach(cell => {
        const tokensOnCell = cell.querySelectorAll('.token');
        tokensOnCell.forEach(token => token.remove());
    });
}

// Render tokens on the board
function renderTokens() {
    clearTokens();

    players.forEach((player, playerIndex) => {
        player.tokens.forEach((tokenPos, tokenIndex) => {
            if (tokenPos === -1) {
                // Token is in home area, not on a path cell
                // You might want to render them in their starting home box visually
                // For now, they are just not rendered on the main board path.
                return;
            }

            // Ensure tokenPos doesn't exceed the last valid path index if not yet home
            const cellIndex = (tokenPos < WINNING_SCORE) ? (player.pathIndices[tokenPos] || -1) : -2; // -2 implies finished

            if (cellIndex >= 0 && cells[cellIndex]) { // Check if it's a valid cell on the board
                const cell = cells[cellIndex];
                const tokenEl = document.createElement('div');
                tokenEl.className = `token ${player.color}`;
                tokenEl.textContent = tokenIndex + 1; // Token ID
                tokenEl.dataset.player = playerIndex;
                tokenEl.dataset.token = tokenIndex;

                // Highlight active player's tokens that can move
                if (playerIndex === currentPlayerIndex && canMoveToken(currentPlayerIndex, tokenIndex)) {
                    tokenEl.classList.add('active');
                    tokenEl.addEventListener('click', () => selectToken(tokenIndex));
                }

                cell.appendChild(tokenEl);
            }
        });
    });
}

// Roll the dice
function rollDice() {
    if (gameEnded) return;

    // Disable roll button during animation
    rollBtn.disabled = true;
    diceEl.classList.add('rolling');

    // Random dice value between 1 and 6
    setTimeout(() => {
        diceValue = Math.floor(Math.random() * 6) + 1;
        diceEl.textContent = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][diceValue - 1];
        diceEl.classList.remove('rolling');

        // Check if player can move
        const currentPlayer = players[currentPlayerIndex];
        const canMove = currentPlayer.tokens.some((pos, index) => canMoveToken(currentPlayerIndex, index));

        if (!canMove) {
            statusEl.textContent = `${currentPlayer.name} cannot move. Passing turn...`;
            setTimeout(nextTurn, 1500);
        } else {
            statusEl.textContent = `${currentPlayer.name} rolled a ${diceValue}. Select a token to move!`;
            sixRolled = diceValue === 6;
            moveMade = false;
        }

        updateUI();
        renderTokens(); // Re-render tokens to update active state
    }, 1000);
}

// Check if a token can move
function canMoveToken(playerIndex, tokenIndex) {
    const player = players[playerIndex];
    const tokenPos = player.tokens[tokenIndex];

    // Token not on board - can only move if dice is 6
    if (tokenPos === -1) return diceValue === 6;

    // Token already finished
    if (tokenPos === WINNING_SCORE) return false;

    // Check if move would go beyond winning score
    return tokenPos + diceValue <= WINNING_SCORE;
}

// Select a token to move
function selectToken(tokenIndex) {
    if (gameEnded || moveMade) return;

    const currentPlayer = players[currentPlayerIndex];

    if (canMoveToken(currentPlayerIndex, tokenIndex)) {
        selectedTokenIndex = tokenIndex;
        moveToken();
    }
}

// Move the selected token
function moveToken() {
    if (selectedTokenIndex === -1) return;

    const currentPlayer = players[currentPlayerIndex];
    let currentPos = currentPlayer.tokens[selectedTokenIndex];
    let newPos;

    // If token is not on board (position -1) and dice is 6, bring it to start
    if (currentPos === -1 && diceValue === 6) {
        newPos = 0; // First position on player's path
        currentPlayer.tokens[selectedTokenIndex] = newPos;
        statusEl.textContent = `${currentPlayer.name} brought token ${selectedTokenIndex + 1} into play!`;
    }
    // Otherwise, move the token along the path
    else if (currentPos >= 0) {
        newPos = currentPos + diceValue;

        // Check if token reached home
        if (newPos >= WINNING_SCORE) { // Use >= in case dice rolls too high past WINNING_SCORE
            currentPlayer.tokens[selectedTokenIndex] = WINNING_SCORE;
            currentPlayer.finishedTokens++;
            statusEl.textContent = `${currentPlayer.name} moved token ${selectedTokenIndex + 1} home!`;

            // Check for winner
            if (currentPlayer.finishedTokens === TOKENS_PER_PLAYER) {
                gameEnded = true;
                showGameOverScreen(currentPlayer.name);
                return;
            }
        } else {
            currentPlayer.tokens[selectedTokenIndex] = newPos;
            statusEl.textContent = `${currentPlayer.name} moved token ${selectedTokenIndex + 1} forward!`;
        }
    }

    moveMade = true;
    selectedTokenIndex = -1;

    // If player rolled a 6, they get another turn
    if (sixRolled && diceValue === 6 && !gameEnded) {
        setTimeout(() => {
            statusEl.textContent = `${currentPlayer.name} rolled a 6! Roll again.`;
            updateUI();
            renderTokens(); // Re-render to update active tokens
        }, 1000);
    } else {
        setTimeout(nextTurn, 1500);
    }

    renderTokens();
}

// Pass turn to next player
function nextTurn() {
    if (gameEnded) return;

    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    diceValue = 0;
    sixRolled = false;
    moveMade = false;
    selectedTokenIndex = -1;

    statusEl.textContent = `${players[currentPlayerIndex].name}'s turn - Roll the dice!`;
    updateUI();
    renderPlayerInfo();
    renderTokens();
}

// Update UI elements
function updateUI() {
    rollBtn.disabled = (diceValue > 0 && !sixRolled) || gameEnded; // Can't roll if already rolled and not a 6, or game ended
    passBtn.disabled = diceValue === 0 || gameEnded; // Can't pass if dice not rolled yet or game ended
    playerInfoEl.querySelectorAll('.player-card').forEach((card, index) => {
        if (index === currentPlayerIndex && !gameEnded) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
}

// Show game over screen
function showGameOverScreen(winnerName = null) {
    gameEnded = true;
    let message;
    if (winnerName) {
        message = `${winnerName} wins the game! 🎉`;
        celebrateWinner(players.find(p => p.name === winnerName)); // Trigger confetti
    } else {
        message = "It's a draw! No one could make a move. 🤝"; // Example for a draw scenario (though less common in Ludo)
    }
    gameOverMessage.textContent = message;
    gameOverOverlay.classList.add('show');
}


// Celebrate winner (confetti effect)
function celebrateWinner(player) {
    statusEl.textContent = `${player.name} wins the game! 🎉`;

    // Create confetti effect
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = confetti.style.width;
            document.body.appendChild(confetti);

            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }, i * 50);
    }
}

// Event listeners
rollBtn.addEventListener('click', rollDice);
diceContainerEl.addEventListener('click', rollDice);
passBtn.addEventListener('click', nextTurn);
newGameBtn.addEventListener('click', resetGame); // Event listener for new game button

// Initialize the game when the page loads
initGame();