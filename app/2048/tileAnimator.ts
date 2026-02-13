import type { DetailedMoveCell } from './gameLogic';

export interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
}

const keyOf = (row: number, col: number) => `${row},${col}`;
const sortById = (a: Tile, b: Tile) => a.id - b.id;

function tileMaps(prevTiles: Tile[]): {
  byPos: Map<string, Tile>;
  idByPos: Map<string, number>;
} {
  const byPos = new Map<string, Tile>();
  const idByPos = new Map<string, number>();
  for (const t of prevTiles) {
    const key = keyOf(t.row, t.col);
    byPos.set(key, t);
    idByPos.set(key, t.id);
  }
  return { byPos, idByPos };
}

export function buildSlidePhaseTiles(prevTiles: Tile[], cells: DetailedMoveCell[]): Tile[] {
  const { byPos } = tileMaps(prevTiles);
  const moving: Tile[] = [];

  for (const cell of cells) {
    for (const src of cell.sources) {
      const sourceTile = byPos.get(keyOf(src.row, src.col));
      if (!sourceTile) continue;

      moving.push({
        id: sourceTile.id,
        value: sourceTile.value,
        row: cell.row,
        col: cell.col,
      });
    }
  }

  return moving.sort(sortById);
}

export function buildSettledTiles(
  prevTiles: Tile[],
  cells: DetailedMoveCell[],
  createId: () => number
): Tile[] {
  const { idByPos } = tileMaps(prevTiles);
  const settled: Tile[] = [];

  for (const cell of cells) {
    const primary = cell.sources[0];
    const id = primary ? idByPos.get(keyOf(primary.row, primary.col)) : undefined;

    settled.push({
      id: id ?? createId(),
      value: cell.value,
      row: cell.row,
      col: cell.col,
      isMerged: cell.sources.length > 1,
    });
  }

  return settled.sort(sortById);
}

export function addSpawnTile(
  settled: Tile[],
  movedBoard: number[][],
  finalBoard: number[][],
  createId: () => number
): Tile[] {
  const next: Tile[] = settled.map((t) => ({ ...t, isMerged: false, isNew: false }));

  for (let r = 0; r < movedBoard.length; r++) {
    for (let c = 0; c < movedBoard[r].length; c++) {
      if (movedBoard[r][c] === 0 && finalBoard[r][c] !== 0) {
        next.push({
          id: createId(),
          value: finalBoard[r][c],
          row: r,
          col: c,
          isNew: true,
        });
      }
    }
  }

  return next.sort(sortById);
}
