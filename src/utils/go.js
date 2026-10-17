// Minimal Go engine: rules (captures, suicide, simple ko), area scoring, and a
// heuristic bot that plays plausible-looking moves without any search.

export const EMPTY = 0;
export const BLACK = 1;
export const WHITE = 2;
export const KOMI = 7.5;

const COLUMNS = "ABCDEFGHJKLMNOPQRST"; // Go coordinates skip "I"

export const other = (color) => (color === BLACK ? WHITE : BLACK);

/**
 * Create a fresh game state.
 * @param {number} size board width/height
 */
export function newGame(size = 9) {
  return {
    size,
    board: new Array(size * size).fill(EMPTY),
    toPlay: BLACK,
    ko: -1,
    captures: { [BLACK]: 0, [WHITE]: 0 },
    moves: [], // { color, point } — point is -1 for a pass
    passes: 0,
    over: false,
  };
}

export function neighbors(size, p) {
  const x = p % size;
  const y = (p - x) / size;
  const out = [];
  if (x > 0) out.push(p - 1);
  if (x < size - 1) out.push(p + 1);
  if (y > 0) out.push(p - size);
  if (y < size - 1) out.push(p + size);
  return out;
}

function diagonals(size, p) {
  const x = p % size;
  const y = (p - x) / size;
  const out = [];
  for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && ny >= 0 && nx < size && ny < size) out.push(ny * size + nx);
  }
  return out;
}

/** Flood-fill the group containing p. Returns its stones and liberties. */
export function groupAt(board, size, p) {
  const color = board[p];
  const stones = [p];
  const seen = new Set(stones);
  const liberties = new Set();
  for (let i = 0; i < stones.length; i++) {
    for (const n of neighbors(size, stones[i])) {
      if (board[n] === EMPTY) liberties.add(n);
      else if (board[n] === color && !seen.has(n)) {
        seen.add(n);
        stones.push(n);
      }
    }
  }
  return { stones, liberties };
}

/**
 * Try to play `point` for the side to move (-1 passes).
 * Returns the next state, or null if the move is illegal.
 */
export function play(state, point) {
  const { size, toPlay } = state;
  if (state.over) return null;

  if (point < 0) {
    const passes = state.passes + 1;
    return {
      ...state,
      toPlay: other(toPlay),
      ko: -1,
      moves: [...state.moves, { color: toPlay, point: -1, captured: 0 }],
      passes,
      over: passes >= 2,
    };
  }

  if (state.board[point] !== EMPTY || point === state.ko) return null;

  const board = state.board.slice();
  board[point] = toPlay;

  const opponent = other(toPlay);
  let captured = [];
  for (const n of neighbors(size, point)) {
    if (board[n] !== opponent) continue;
    const g = groupAt(board, size, n);
    if (g.liberties.size === 0) {
      for (const s of g.stones) board[s] = EMPTY;
      captured = captured.concat(g.stones);
    }
  }

  const own = groupAt(board, size, point);
  if (own.liberties.size === 0) return null; // suicide

  // Simple ko: a lone stone that captured exactly one stone and now sits in atari.
  const ko =
    captured.length === 1 && own.stones.length === 1 && own.liberties.size === 1
      ? captured[0]
      : -1;

  return {
    ...state,
    board,
    toPlay: opponent,
    ko,
    captures: {
      ...state.captures,
      [toPlay]: state.captures[toPlay] + captured.length,
    },
    moves: [...state.moves, { color: toPlay, point, captured: captured.length }],
    passes: 0,
  };
}

/** True if p is an empty point whose every neighbor is `color` — i.e. an eye-ish point. */
function isOwnEye(board, size, p, color) {
  if (!neighbors(size, p).every((n) => board[n] === color)) return false;
  const diags = diagonals(size, p);
  const bad = diags.filter((d) => board[d] === other(color)).length;
  // On the edge, any enemy diagonal ruins the eye; in the middle, two do.
  return diags.length < 4 ? bad === 0 : bad < 2;
}

/**
 * Area (Chinese) score: stones plus empty regions touching only one color.
 * Dead stones are not removed, so this is an estimate mid-game.
 */
export function score(state) {
  const { board, size } = state;
  const area = { [BLACK]: 0, [WHITE]: 0 };
  const territory = new Array(board.length).fill(EMPTY);
  const seen = new Set();

  board.forEach((c, p) => {
    if (c !== EMPTY) area[c]++;
  });

  for (let p = 0; p < board.length; p++) {
    if (board[p] !== EMPTY || seen.has(p)) continue;
    const region = [p];
    const borders = new Set();
    seen.add(p);
    for (let i = 0; i < region.length; i++) {
      for (const n of neighbors(size, region[i])) {
        if (board[n] === EMPTY && !seen.has(n)) {
          seen.add(n);
          region.push(n);
        } else if (board[n] !== EMPTY) borders.add(board[n]);
      }
    }
    if (borders.size === 1) {
      const owner = [...borders][0];
      area[owner] += region.length;
      for (const r of region) territory[r] = owner;
    }
  }

  return {
    black: area[BLACK],
    white: area[WHITE] + KOMI,
    margin: area[BLACK] - area[WHITE] - KOMI,
    territory,
  };
}

/** Live position stats for the side panel. */
export function analyze(state) {
  const { board, size } = state;
  const seen = new Set();
  const stats = {
    [BLACK]: { stones: 0, groups: 0, atari: 0, liberties: 0 },
    [WHITE]: { stones: 0, groups: 0, atari: 0, liberties: 0 },
  };
  for (let p = 0; p < board.length; p++) {
    const c = board[p];
    if (c === EMPTY) continue;
    stats[c].stones++;
    if (seen.has(p)) continue;
    const g = groupAt(board, size, p);
    g.stones.forEach((s) => seen.add(s));
    stats[c].groups++;
    stats[c].liberties += g.liberties.size;
    if (g.liberties.size === 1) stats[c].atari++;
  }
  return stats;
}

export function coordName(size, p) {
  if (p < 0) return "pass";
  const x = p % size;
  const y = (p - x) / size;
  return `${COLUMNS[x]}${size - y}`;
}

/**
 * Pick a move for the side to play using cheap tactical heuristics.
 * Returns a point, or -1 to pass.
 */
export function chooseMove(state, rand = Math.random) {
  const { board, size, toPlay } = state;
  const opponent = other(toPlay);
  const moveNo = state.moves.length;
  const mid = (size - 1) / 2;

  // Groups already in atari, so we can reward saving or capturing them.
  const ownAtari = new Set();
  for (let p = 0; p < board.length; p++) {
    if (board[p] !== toPlay || ownAtari.has(p)) continue;
    const g = groupAt(board, size, p);
    if (g.liberties.size === 1) g.stones.forEach((s) => ownAtari.add(s));
  }

  let best = -1;
  let bestScore = -Infinity;

  for (let p = 0; p < board.length; p++) {
    if (board[p] !== EMPTY) continue;
    if (isOwnEye(board, size, p, toPlay)) continue;

    const next = play(state, p);
    if (!next) continue;

    const captured = next.captures[toPlay] - state.captures[toPlay];
    const own = groupAt(next.board, size, p);
    let s = 0;

    s += captured * 12;

    const savedStones = neighbors(size, p).filter((n) => ownAtari.has(n)).length;
    if (savedStones && own.liberties.size >= 2) s += 9 + own.stones.length * 2;

    if (own.liberties.size === 1 && captured === 0) s -= 14; // self-atari
    else if (own.liberties.size === 2) s -= 1;

    for (const n of neighbors(size, p)) {
      if (next.board[n] !== opponent) continue;
      const libs = groupAt(next.board, size, n).liberties.size;
      if (libs === 1) s += 4;
      else if (libs === 2) s += 1;
    }

    // Shape and position: favour 3rd–4th lines early, avoid the first line.
    const x = p % size;
    const y = (p - x) / size;
    const line = Math.min(x, y, size - 1 - x, size - 1 - y);
    if (line === 0) s -= moveNo < 40 ? 3 : 1;
    if (moveNo < 8) s += line === 2 ? 3 : line === 3 ? 2 : 0;
    s -= (Math.abs(x - mid) + Math.abs(y - mid)) * 0.05;

    // Stay connected to the action, and fill shared liberties late in the game.
    const adjOwn = neighbors(size, p).some((n) => board[n] === toPlay);
    const adjOpp = neighbors(size, p).some((n) => board[n] === opponent);
    if (adjOpp) s += 1.2;
    if (adjOwn && adjOpp) s += 0.8;
    if (adjOwn && !adjOpp && moveNo > 30) s -= 1.5; // filling own territory

    s += rand() * 2.5;

    if (s > bestScore) {
      bestScore = s;
      best = p;
    }
  }

  // Late in the game, pass rather than play pointless moves.
  if (best < 0 || (moveNo > 40 && bestScore < 0)) return -1;
  return best;
}
