export const BOARD_SIZE = 20;

const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

const OPPOSITES = {
  up: "down",
  down: "up",
  left: "right",
  right: "left"
};

function keyToDirection(key) {
  switch (key) {
    case "ArrowUp":
    case "w":
    case "W":
      return "up";
    case "ArrowDown":
    case "s":
    case "S":
      return "down";
    case "ArrowLeft":
    case "a":
    case "A":
      return "left";
    case "ArrowRight":
    case "d":
    case "D":
      return "right";
    default:
      return null;
  }
}

function normalizeDirection(input) {
  if (input === "up" || input === "down" || input === "left" || input === "right") {
    return input;
  }

  return keyToDirection(input);
}

function createInitialSnake(size) {
  const center = Math.floor(size / 2);
  return [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center }
  ];
}

function sameCell(a, b) {
  return a.x === b.x && a.y === b.y;
}

function cloneSnake(snake) {
  return snake.map((segment) => ({ ...segment }));
}

export function createGame(random = Math.random) {
  const snake = createInitialSnake(BOARD_SIZE);
  const food = spawnFood(snake, BOARD_SIZE, random);
  return {
    boardSize: BOARD_SIZE,
    snake,
    food,
    direction: "right",
    nextDirection: "right",
    score: 0,
    status: "ready",
    gameOver: false,
    random
  };
}

export function spawnFood(snake, boardSize, random = Math.random) {
  const openCells = [];
  for (let y = 0; y < boardSize; y += 1) {
    for (let x = 0; x < boardSize; x += 1) {
      const occupied = snake.some((segment) => segment.x === x && segment.y === y);
      if (!occupied) {
        openCells.push({ x, y });
      }
    }
  }

  if (openCells.length === 0) {
    return null;
  }

  const index = Math.floor(random() * openCells.length);
  return { ...openCells[index] };
}

export function applyDirection(state, input) {
  const next = normalizeDirection(input);
  if (!next || state.gameOver) {
    return state;
  }

  const current = state.nextDirection || state.direction;
  if (OPPOSITES[current] === next) {
    return state;
  }

  return {
    ...state,
    nextDirection: next
  };
}

export function restartGame(state, random = state.random || Math.random) {
  return createGame(random);
}

export function stepGame(state) {
  if (state.gameOver) {
    return state;
  }

  const direction = state.nextDirection || state.direction;
  const vector = DIRECTIONS[direction];
  const head = state.snake[0];
  const nextHead = { x: head.x + vector.x, y: head.y + vector.y };

  const hitsWall =
    nextHead.x < 0 ||
    nextHead.y < 0 ||
    nextHead.x >= state.boardSize ||
    nextHead.y >= state.boardSize;

  const willEat = state.food && sameCell(nextHead, state.food);
  const bodyToCheck = willEat ? state.snake : state.snake.slice(0, -1);
  const hitsSelf = bodyToCheck.some((segment) => sameCell(segment, nextHead));

  if (hitsWall || hitsSelf) {
    return {
      ...state,
      snake: [nextHead, ...cloneSnake(state.snake)],
      gameOver: true,
      status: "game over"
    };
  }

  const newSnake = [nextHead, ...cloneSnake(state.snake)];
  if (!willEat) {
    newSnake.pop();
  }

  const score = willEat ? state.score + 1 : state.score;
  const food = willEat ? spawnFood(newSnake, state.boardSize, state.random) : state.food;

  return {
    ...state,
    snake: newSnake,
    food,
    direction,
    nextDirection: direction,
    score,
    status: willEat && !food ? "won" : state.status === "ready" ? "playing" : state.status,
    gameOver: false
  };
}

export function toCellIndex(x, y, boardSize) {
  return y * boardSize + x;
}

export function getCellClass(index, state) {
  const x = index % state.boardSize;
  const y = Math.floor(index / state.boardSize);
  if (state.food && state.food.x === x && state.food.y === y) {
    return "cell food";
  }
  const snakeIndex = state.snake.findIndex((segment) => segment.x === x && segment.y === y);
  if (snakeIndex === 0) {
    return "cell snake head";
  }
  if (snakeIndex > 0) {
    return "cell snake";
  }
  return (x + y) % 2 === 0 ? "cell" : "cell alt";
}
