import test from 'node:test';
import assert from 'node:assert/strict';

import {
  addRandom,
  applyMove,
  hasAnyMove,
  moveBoard,
  moveBoardDetailed,
  slideLine,
  type Board,
  type Direction,
} from './gameLogic.ts';

function referenceSlideLeft(line: number[]): { line: number[]; gained: number } {
  const nums = line.filter((v) => v !== 0);
  const out: number[] = [];
  let gained = 0;
  let i = 0;

  while (i < nums.length) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      const merged = nums[i] * 2;
      out.push(merged);
      gained += merged;
      i += 2;
    } else {
      out.push(nums[i]);
      i += 1;
    }
  }

  while (out.length < 4) out.push(0);
  return { line: out, gained };
}

function reverse(line: number[]): number[] {
  return line.slice().reverse();
}

function getLine(board: Board, dir: Direction, index: number): number[] {
  if (dir === 'LEFT' || dir === 'RIGHT') {
    return board[index].slice();
  }

  const col: number[] = [];
  for (let r = 0; r < 4; r++) col.push(board[r][index]);
  return col;
}

function setLine(board: Board, dir: Direction, index: number, line: number[]): void {
  if (dir === 'LEFT' || dir === 'RIGHT') {
    board[index] = line.slice();
    return;
  }

  for (let r = 0; r < 4; r++) board[r][index] = line[r];
}

function referenceMove(
  board: Board,
  dir: Direction
): { board: Board; gained: number; moved: boolean } {
  const out = board.map((row) => row.slice());
  let gained = 0;

  for (let i = 0; i < 4; i++) {
    const original = getLine(board, dir, i);
    const oriented = dir === 'RIGHT' || dir === 'DOWN' ? reverse(original) : original;
    const moved = referenceSlideLeft(oriented);
    const restored = dir === 'RIGHT' || dir === 'DOWN' ? reverse(moved.line) : moved.line;
    setLine(out, dir, i, restored);
    gained += moved.gained;
  }

  const moved = out.some((row, r) => row.some((v, c) => v !== board[r][c]));

  return { board: out, gained, moved };
}

function randomPow2OrZero(random: () => number): number {
  if (random() < 0.35) return 0;
  const exponents = [1, 2, 3, 4, 5, 6, 7, 8];
  const exp = exponents[Math.floor(random() * exponents.length)];
  return 2 ** exp;
}

function randomBoard(seed: number): Board {
  let state = seed;
  const rand = () => {
    state = (1664525 * state + 1013904223) % 4294967296;
    return state / 4294967296;
  };

  return Array.from({ length: 4 }, () =>
    Array.from({ length: 4 }, () => randomPow2OrZero(rand))
  );
}

test('slideLine merges once per pair and pads with zeros', () => {
  const { newLine, gained } = slideLine([2, 2, 2, 2]);
  assert.deepEqual(newLine, [4, 4, 0, 0]);
  assert.equal(gained, 8);
});

test('moveBoard LEFT merges and computes gained score', () => {
  const board: Board = [
    [2, 0, 2, 4],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const result = moveBoard(board, 'LEFT');

  assert.equal(result.moved, true);
  assert.equal(result.gained, 4);
  assert.deepEqual(result.board[0], [4, 4, 0, 0]);
});

test('moveBoard RIGHT handles edge merges correctly', () => {
  const board: Board = [
    [2, 2, 4, 4],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const result = moveBoard(board, 'RIGHT');

  assert.equal(result.moved, true);
  assert.equal(result.gained, 12);
  assert.deepEqual(result.board[0], [0, 0, 4, 8]);
});

test('moveBoard UP merges columns', () => {
  const board: Board = [
    [2, 0, 0, 0],
    [2, 0, 0, 0],
    [4, 0, 0, 0],
    [4, 0, 0, 0],
  ];

  const result = moveBoard(board, 'UP');

  assert.equal(result.moved, true);
  assert.equal(result.gained, 12);
  assert.deepEqual(
    result.board.map((r) => r[0]),
    [4, 8, 0, 0]
  );
});

test('moveBoard DOWN merges columns toward bottom', () => {
  const board: Board = [
    [2, 0, 0, 0],
    [2, 0, 0, 0],
    [4, 0, 0, 0],
    [4, 0, 0, 0],
  ];

  const result = moveBoard(board, 'DOWN');

  assert.equal(result.moved, true);
  assert.equal(result.gained, 12);
  assert.deepEqual(
    result.board.map((r) => r[0]),
    [0, 0, 4, 8]
  );
});

test('applyMove does not spawn new tile on invalid/no-op move', () => {
  const board: Board = [
    [2, 4, 8, 16],
    [32, 64, 128, 256],
    [512, 1024, 2, 4],
    [8, 16, 32, 64],
  ];

  const result = applyMove(board, 'LEFT', () => 0);

  assert.equal(result.moved, false);
  assert.deepEqual(result.board, board);
});

test('applyMove spawns one tile after valid move', () => {
  const board: Board = [
    [0, 2, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const result = applyMove(board, 'LEFT', () => 0);

  assert.equal(result.moved, true);

  const nonZero = result.board.flat().filter((v) => v !== 0);
  assert.equal(nonZero.length, 2);
  assert.equal(nonZero.filter((v) => v === 2).length, 2);
});

test('hasAnyMove false for full board with no adjacent equals', () => {
  const board: Board = [
    [2, 4, 2, 4],
    [4, 2, 4, 2],
    [2, 4, 2, 4],
    [4, 2, 4, 2],
  ];

  assert.equal(hasAnyMove(board), false);
});

test('hasAnyMove true when an empty cell exists', () => {
  const board: Board = [
    [2, 4, 2, 4],
    [4, 0, 4, 2],
    [2, 4, 2, 4],
    [4, 2, 4, 2],
  ];

  assert.equal(hasAnyMove(board), true);
});

test('addRandom inserts 4 when random threshold indicates 10% branch', () => {
  const board: Board = [
    [2, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const calls = [0, 0.95];
  const rng = () => calls.shift() ?? 0;

  const result = addRandom(board, rng);

  assert.equal(result.flat().filter((v) => v === 4).length, 1);
});

test('moveBoardDetailed tracks merge sources deterministically', () => {
  const board: Board = [
    [2, 2, 4, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const result = moveBoardDetailed(board, 'LEFT');
  const mergedCell = result.cells.find((c) => c.row === 0 && c.col === 0);
  const movedCell = result.cells.find((c) => c.row === 0 && c.col === 1);

  assert.ok(mergedCell);
  assert.ok(movedCell);
  assert.equal(mergedCell.value, 4);
  assert.deepEqual(mergedCell.sources, [{ row: 0, col: 0 }, { row: 0, col: 1 }]);
  assert.equal(movedCell.value, 4);
  assert.deepEqual(movedCell.sources, [{ row: 0, col: 2 }]);
});

test('moveBoardDetailed source coordinates are unique per move', () => {
  const dirs: Direction[] = ['LEFT', 'RIGHT', 'UP', 'DOWN'];

  for (let seed = 1; seed <= 300; seed++) {
    const board = randomBoard(seed);

    for (const dir of dirs) {
      const result = moveBoardDetailed(board, dir);
      const seen = new Set<string>();

      for (const cell of result.cells) {
        for (const src of cell.sources) {
          const key = `${src.row},${src.col}`;
          assert.equal(seen.has(key), false, `duplicate source for seed ${seed}, dir ${dir}`);
          seen.add(key);
        }
      }
    }
  }
});

test('moveBoard matches independent reference engine across random boards', () => {
  const dirs: Direction[] = ['LEFT', 'RIGHT', 'UP', 'DOWN'];

  for (let seed = 1; seed <= 500; seed++) {
    const board = randomBoard(seed);

    for (const dir of dirs) {
      const actual = moveBoard(board, dir);
      const expected = referenceMove(board, dir);

      assert.deepEqual(
        actual.board,
        expected.board,
        `board mismatch for seed ${seed}, dir ${dir}`
      );
      assert.equal(
        actual.gained,
        expected.gained,
        `gained mismatch for seed ${seed}, dir ${dir}`
      );
      assert.equal(
        actual.moved,
        expected.moved,
        `moved mismatch for seed ${seed}, dir ${dir}`
      );
    }
  }
});
