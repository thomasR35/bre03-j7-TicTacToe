function dataController() {
  let boardData = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  let currentPlayer = "X";
  let gameOver = false;

  const resetBoard = () => {
    boardData = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    currentPlayer = "X";
    gameOver = false;
  };

  const getBoard = () => {
    return boardData.map((row) => [...row]);
  };

  const setBoard = (newValue) => {
    boardData = newValue;
  };

  const getCell = (x, y) => {
    return boardData[x][y];
  };

  const setCell = (x, y, value) => {
    boardData[x][y] = value;
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  };

  const getCurrentPlayer = () => {
    return currentPlayer;
  };

  const isGameOver = () => {
    return gameOver;
  };

  const setGameOver = (value) => {
    gameOver = value;
  };

  return {
    getCell,
    getBoard,
    setBoard,
    resetBoard,
    setCell,
    switchPlayer,
    getCurrentPlayer,
    isGameOver,
    setGameOver,
  };
}

const isWon = (board) => {
  const combinations = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];

  for (const combination of combinations) {
    const [a, b, c] = combination;
    const value = board[a[0]][a[1]];
    if (value && value === board[b[0]][b[1]] && value === board[c[0]][c[1]]) {
      return value;
    }
  }
  return null;
};

function DisplayController(data) {
  const boardElement = document.getElementById("board");
  const resetButton = document.getElementById("resetButton");
  const winnerMessage = document.getElementById("winnerMessage");

  const clear = () => {
    boardElement.innerHTML = "";
  };

  const createCell = (x, y) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.x = x;
    cell.dataset.y = y;
    cell.addEventListener("click", () => handleCellClick(x, y));
    boardElement.appendChild(cell);
  };

  const handleCellClick = (x, y) => {
    if (!data.isGameOver() && data.getCell(x, y) === 0) {
      data.setCell(x, y, data.getCurrentPlayer());
      actualize();
      if (isWon(data.getBoard())) {
        winnerMessage.textContent = `Le joueur ${data.getCurrentPlayer()} a gagné!`;
        data.setGameOver(true);
      } else if (
        data
          .getBoard()
          .flat()
          .every((cell) => cell !== 0)
      ) {
        winnerMessage.textContent = "Égalité!";
        data.setGameOver(true);
      } else {
        data.switchPlayer();
      }
    }
  };

  const actualize = () => {
    clear();
    const board = data.getBoard();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        createCell(i, j);
        const cell = boardElement.querySelector(
          `[data-x="${i}"][data-y="${j}"]`
        );
        if (board[i][j] === "X") {
          cell.innerHTML =
            '<img src="assets/croix.svg" alt="X" width="50" height="50">';
        } else if (board[i][j] === "O") {
          cell.innerHTML =
            '<img src="assets/rond.svg" alt="O" width="50" height="50">';
        }
      }
    }
  };

  resetButton.addEventListener("click", () => {
    data.resetBoard();
    winnerMessage.textContent = "";
    actualize();
  });

  return {
    clear,
    actualize,
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const data = dataController();
  const display = DisplayController(data);
  display.actualize();
});
