import assert from "node:assert/strict";
import { applyDirection, createGame, spawnFood, stepGame } from "../src/game.js";

function makeRandom(sequence) {
  let index = 0;
  return () => {
    const value = sequence[index % sequence.length];
    index += 1;
    return value;
  };
}

const cases = [];

function test(name, fn) {
  cases.push({ name, fn });
}

test("snake moves one step to the right by default", () => {
  const state = createGame(() => 0);
  const next = stepGame(state);

  assert.equal(next.snake[0].x, state.snake[0].x + 1);
  assert.equal(next.snake[0].y, state.snake[0].y);
});

test("direction changes follow keyboard input and reject reversals", () => {
  const state = createGame(() => 0);
  const afterUp = applyDirection(state, "ArrowUp");
  assert.equal(afterUp.nextDirection, "up");

  const blocked = applyDirection(afterUp, "ArrowDown");
  assert.equal(blocked.nextDirection, "up");
});

test("snake grows and score increases after eating food", () => {
  const state = createGame(() => 0);
  const head = state.snake[0];
  const eatingState = {
    ...state,
    food: { x: head.x + 1, y: head.y },
    random: () => 0
  };

  const next = stepGame(eatingState);
  assert.equal(next.score, 1);
  assert.equal(next.snake.length, state.snake.length + 1);
  assert.notDeepEqual(next.food, next.snake[0]);
});

test("wall collision ends the game", () => {
  const state = {
    ...createGame(() => 0),
    snake: [{ x: 0, y: 0 }],
    direction: "left",
    nextDirection: "left",
    food: { x: 10, y: 10 }
  };

  const next = stepGame(state);
  assert.equal(next.gameOver, true);
  assert.equal(next.status, "game over");
});

test("self collision ends the game", () => {
  const state = {
    ...createGame(() => 0),
    snake: [
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 6, y: 6 },
      { x: 5, y: 6 }
    ],
    direction: "right",
    nextDirection: "right",
    food: { x: 10, y: 10 }
  };

  const next = stepGame(state);
  assert.equal(next.gameOver, true);
});

test("food spawns only in empty cells", () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 }
  ];
  const food = spawnFood(snake, 3, makeRandom([0]));

  assert.ok(food);
  assert.equal(snake.some((segment) => segment.x === food.x && segment.y === food.y), false);
});

let failed = 0;
for (const { name, fn } of cases) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`not ok - ${name}`);
    console.error(error);
  }
}

if (failed > 0) {
  process.exitCode = 1;
  console.error(`\n${failed} test(s) failed.`);
} else {
  console.log(`\n${cases.length} test(s) passed.`);
}
