import {
  BOARD_SIZE,
  applyDirection,
  createGame,
  getCellClass,
  restartGame,
  stepGame,
  toCellIndex
} from "./game.js";

const board = document.querySelector("#board");
const scoreNode = document.querySelector("#score");
const statusNode = document.querySelector("#status");
const modeNode = document.querySelector("#mode");
const restartButton = document.querySelector("#restart");
const controlButtons = document.querySelectorAll("[data-direction]");

let state = createGame();
let timer = null;
let tickMs = 180;

board.style.setProperty("--size", String(BOARD_SIZE));

function render() {
  if (!board) {
    return;
  }

  if (!board.dataset.initialized) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.setAttribute("role", "gridcell");
      cell.dataset.index = String(i);
      fragment.appendChild(cell);
    }
    board.replaceChildren(fragment);
    board.dataset.initialized = "true";
  }

  board.querySelectorAll(".cell").forEach((cell, index) => {
    cell.className = getCellClass(index, state);
  });

  scoreNode.textContent = String(state.score);

  if (state.gameOver) {
    statusNode.textContent = "Game over. Press Restart or Enter.";
    statusNode.dataset.state = "gameover";
    modeNode.textContent = "Game over";
    modeNode.dataset.mode = "gameover";
  } else if (state.status === "ready") {
    statusNode.textContent = "Use arrow keys or WASD to start.";
    statusNode.dataset.state = "ready";
    modeNode.textContent = "Ready";
    modeNode.dataset.mode = "ready";
  } else {
    statusNode.textContent = "Keep going.";
    statusNode.dataset.state = "playing";
    modeNode.textContent = "Playing";
    modeNode.dataset.mode = "playing";
  }
}

function restart() {
  state = restartGame(state);
  clearInterval(timer);
  timer = null;
  state.status = "ready";
  tickMs = 180;
  render();
}

function startLoop() {
  if (timer) {
    return;
  }
  timer = setInterval(() => {
    state = stepGame(state);
    render();
    if (state.gameOver) {
      clearInterval(timer);
      timer = null;
    }
  }, tickMs);
}

function handleDirection(direction) {
  const before = state;
  state = applyDirection(state, direction);
  if (state !== before && state.status === "ready") {
    state = { ...state, status: "playing" };
  }
  startLoop();
  render();
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && state.gameOver) {
    restart();
    return;
  }

  const nextState = applyDirection(state, event.key);
  if (nextState !== state) {
    state = nextState;
    if (state.status === "ready") {
      state = { ...state, status: "playing" };
    }
    startLoop();
    render();
  }
});

restartButton.addEventListener("click", restart);

controlButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.direction;
    if (direction) {
      handleDirection(direction);
    }
  });
});

render();

const observeResize = () => {
  const size = board.getBoundingClientRect().width;
  tickMs = size < 420 ? 200 : 180;
  if (timer) {
    clearInterval(timer);
    timer = null;
    startLoop();
  }
};

window.addEventListener("resize", observeResize);
observeResize();

// Prevent unused helper from being tree-shaken in simple static mode.
void toCellIndex;
