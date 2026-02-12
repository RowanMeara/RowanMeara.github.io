import test from 'node:test';
import assert from 'node:assert/strict';

import { moveBoardDetailed, type Board, type DetailedMoveCell } from './gameLogic.ts';
import {
  addSpawnTile,
  buildSettledTiles,
  buildSlidePhaseTiles,
  type Tile,
} from './tileAnimator.ts';

function tilesFromBoard(board: Board): Tile[] {
  let id = 1;
  const tiles: Tile[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] !== 0) {
        tiles.push({ id: id++, value: board[r][c], row: r, col: c });
      }
    }
  }
  return tiles;
}

function findCell(cells: DetailedMoveCell[], row: number, col: number): DetailedMoveCell {
  const cell = cells.find((c) => c.row === row && c.col === col);
  assert.ok(cell);
  return cell;
}

test('slide phase preserves values from source tiles during merge animation', () => {
  const board: Board = [
    [2, 2, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const prevTiles = tilesFromBoard(board);
  const result = moveBoardDetailed(board, 'LEFT');

  const mergeCell = findCell(result.cells, 0, 0);
  assert.equal(mergeCell.value, 4);
  assert.equal(mergeCell.sources.length, 2);

  const slideTiles = buildSlidePhaseTiles(prevTiles, result.cells);
  const onMergeTarget = slideTiles.filter((t) => t.row === 0 && t.col === 0);

  assert.equal(onMergeTarget.length, 2);
  assert.deepEqual(onMergeTarget.map((t) => t.value).sort((a, b) => a - b), [2, 2]);
});

test('settled phase collapses merge into one tile with merged value', () => {
  const board: Board = [
    [2, 2, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const prevTiles = tilesFromBoard(board);
  const result = moveBoardDetailed(board, 'LEFT');
  let nextId = 100;
  const settled = buildSettledTiles(prevTiles, result.cells, () => nextId++);

  const target = settled.filter((t) => t.row === 0 && t.col === 0);
  assert.equal(target.length, 1);
  assert.equal(target[0].value, 4);
  assert.equal(target[0].isMerged, true);
});

test('spawn phase adds exactly one new tile flagged isNew', () => {
  const movedBoard: Board = [
    [2, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  const finalBoard: Board = [
    [2, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 2, 0],
  ];

  const settled: Tile[] = [{ id: 1, value: 2, row: 0, col: 0 }];
  let nextId = 10;
  const withSpawn = addSpawnTile(settled, movedBoard, finalBoard, () => nextId++);

  const spawned = withSpawn.filter((t) => t.isNew);
  assert.equal(spawned.length, 1);
  assert.deepEqual(spawned[0], {
    id: 10,
    value: 2,
    row: 3,
    col: 2,
    isNew: true,
  });
});
