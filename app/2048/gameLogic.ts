export const SIZE = 4;

export type Direction = 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
export type Board = number[][];

export interface Coord {
  row: number;
  col: number;
}

export interface DetailedMoveCell {
  row: number;
  col: number;
  value: number;
  sources: Coord[];
}

export function emptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => 0));
}

export function addRandom(board: Board, random: () => number = Math.random): Board {
  const next = board.map((row) => row.slice());
  const empties: Array<[number, number]> = [];

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (next[r][c] === 0) empties.push([r, c]);
    }
  }

  if (empties.length === 0) return next;

  const [rr, cc] = empties[Math.floor(random() * empties.length)];
  next[rr][cc] = random() < 0.9 ? 2 : 4;
  return next;
}

export function slideLine(line: number[]): { newLine: number[]; gained: number } {
  const nonZero = line.filter((v) => v !== 0);
  const merged: number[] = [];
  let gained = 0;
  let skip = false;

  for (let i = 0; i < nonZero.length; i++) {
    if (skip) {
      skip = false;
      continue;
    }

    if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
      const val = nonZero[i] * 2;
      merged.push(val);
      gained += val;
      skip = true;
    } else {
      merged.push(nonZero[i]);
    }
  }

  while (merged.length < SIZE) merged.push(0);
  return { newLine: merged, gained };
}

function slideLineWithSources(
  line: number[]
): { merged: Array<{ value: number; sourceIndices: number[] }>; gained: number } {
  const nonZero: Array<{ value: number; srcIndex: number }> = [];
  for (let i = 0; i < line.length; i++) {
    if (line[i] !== 0) nonZero.push({ value: line[i], srcIndex: i });
  }

  const merged: Array<{ value: number; sourceIndices: number[] }> = [];
  let gained = 0;
  let i = 0;

  while (i < nonZero.length) {
    const cur = nonZero[i];
    const next = nonZero[i + 1];

    if (next && cur.value === next.value) {
      const value = cur.value * 2;
      merged.push({ value, sourceIndices: [cur.srcIndex, next.srcIndex] });
      gained += value;
      i += 2;
    } else {
      merged.push({ value: cur.value, sourceIndices: [cur.srcIndex] });
      i += 1;
    }
  }

  while (merged.length < SIZE) merged.push({ value: 0, sourceIndices: [] });
  return { merged, gained };
}

export function transpose(board: Board): Board {
  const res = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      res[c][r] = board[r][c];
    }
  }
  return res;
}

function boardsEqual(a: Board, b: Board): boolean {
  return a.every((row, i) => row.every((v, j) => v === b[i][j]));
}

function orientedCoord(dir: Direction, lineIndex: number, offset: number): Coord {
  switch (dir) {
    case 'LEFT':
      return { row: lineIndex, col: offset };
    case 'RIGHT':
      return { row: lineIndex, col: SIZE - 1 - offset };
    case 'UP':
      return { row: offset, col: lineIndex };
    case 'DOWN':
      return { row: SIZE - 1 - offset, col: lineIndex };
    default:
      return { row: lineIndex, col: offset };
  }
}

function getOrientedLine(board: Board, dir: Direction, lineIndex: number): number[] {
  const line: number[] = [];
  for (let offset = 0; offset < SIZE; offset++) {
    const { row, col } = orientedCoord(dir, lineIndex, offset);
    line.push(board[row][col]);
  }
  return line;
}

export function moveBoardDetailed(
  board: Board,
  dir: Direction
): { board: Board; gained: number; moved: boolean; cells: DetailedMoveCell[] } {
  const movedBoard = emptyBoard();
  const cells: DetailedMoveCell[] = [];
  let gainedTotal = 0;

  for (let lineIndex = 0; lineIndex < SIZE; lineIndex++) {
    const line = getOrientedLine(board, dir, lineIndex);
    const { merged, gained } = slideLineWithSources(line);
    gainedTotal += gained;

    for (let offset = 0; offset < SIZE; offset++) {
      const { row, col } = orientedCoord(dir, lineIndex, offset);
      const out = merged[offset];
      movedBoard[row][col] = out.value;

      if (out.value !== 0) {
        cells.push({
          row,
          col,
          value: out.value,
          sources: out.sourceIndices.map((srcOffset) =>
            orientedCoord(dir, lineIndex, srcOffset)
          ),
        });
      }
    }
  }

  return {
    board: movedBoard,
    gained: gainedTotal,
    moved: !boardsEqual(board, movedBoard),
    cells,
  };
}

export function moveBoard(
  board: Board,
  dir: Direction
): { board: Board; gained: number; moved: boolean } {
  const { board: movedBoard, gained, moved } = moveBoardDetailed(board, dir);
  return { board: movedBoard, gained, moved };
}

export function hasAnyMove(board: Board): boolean {
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (board[i][j] === 0) return true;
    }
  }

  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE - 1; j++) {
      if (board[i][j] === board[i][j + 1]) return true;
    }
  }

  for (let i = 0; i < SIZE - 1; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (board[i][j] === board[i + 1][j]) return true;
    }
  }

  return false;
}

export function applyMove(
  board: Board,
  dir: Direction,
  random: () => number = Math.random
): { board: Board; gained: number; moved: boolean } {
  const { board: movedBoard, gained, moved } = moveBoard(board, dir);
  if (!moved) return { board: movedBoard, gained, moved };
  return { board: addRandom(movedBoard, random), gained, moved };
}
