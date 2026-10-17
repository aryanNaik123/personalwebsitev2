import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BLACK,
  EMPTY,
  KOMI,
  newGame,
  play,
  chooseMove,
  score,
  coordName,
} from "../utils/go";
import "./GoBoard.css";

const SIZE = 9;
const CELL = 40;
const SPAN = (SIZE + 1) * CELL;
const HOSHI = [20, 24, 56, 60, 40]; // 3-3 points and tengen on 9x9
const RESTART_DELAY = 6000;
const BOT_DELAY = 450;
const MOVE_DELAY = 900;

const DRAG_THRESHOLD = 4; // px before a press becomes a drag instead of a click
const MAX_TILT = 70;
const SENSITIVITY = 0.4; // degrees per pixel dragged
const MAX_SPEED = 4; // degrees per frame of momentum

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/**
 * Drag to orbit the board like it sits on a table: vertical drags tilt it back,
 * horizontal drags spin it. Releases coast with a little momentum.
 */
function useTilt() {
  const [tilt, setTilt] = useState({ x: 0, z: 0 });
  const drag = useRef(null);
  const velocity = useRef({ x: 0, z: 0 });
  const frame = useRef(0);
  const dragged = useRef(false);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const coast = () => {
    const v = velocity.current;
    v.x *= 0.85;
    v.z *= 0.85;
    if (Math.abs(v.x) < 0.05 && Math.abs(v.z) < 0.05) return;
    setTilt((t) => ({ x: clamp(t.x + v.x, 0, MAX_TILT), z: t.z + v.z }));
    frame.current = requestAnimationFrame(coast);
  };

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    cancelAnimationFrame(frame.current);
    drag.current = { x: e.clientX, y: e.clientY, active: false };
    dragged.current = false;
    velocity.current = { x: 0, z: 0 };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.active) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      // Capture only once it's a real drag, so plain clicks still reach the board.
      d.active = true;
      dragged.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    const step = {
      x: clamp(-dy * SENSITIVITY, -MAX_SPEED, MAX_SPEED),
      z: clamp(dx * SENSITIVITY, -MAX_SPEED, MAX_SPEED),
    };
    velocity.current = step;
    setTilt((t) => ({ x: clamp(t.x + step.x, 0, MAX_TILT), z: t.z + step.z }));
    d.x = e.clientX;
    d.y = e.clientY;
  };

  const onPointerUp = () => {
    if (drag.current && drag.current.active) {
      frame.current = requestAnimationFrame(coast);
    }
    drag.current = null;
  };

  // Swallow the click that ends a drag so it doesn't place a stone.
  const onClickCapture = (e) => {
    if (dragged.current) {
      e.stopPropagation();
      dragged.current = false;
    }
  };

  const reset = () => {
    cancelAnimationFrame(frame.current);
    velocity.current = { x: 0, z: 0 };
    setTilt({ x: 0, z: 0 });
  };

  return {
    tilt,
    tilted: tilt.x > 0.5 || Math.abs(tilt.z % 360) > 0.5,
    reset,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onClickCapture,
      onDoubleClick: reset,
    },
  };
}

/**
 * Spinning a square makes its footprint grow (up to √2 at 45°), and tilting it
 * toward the viewer enlarges the near edge, so shrink to stay inside the box.
 */
function tiltTransform({ x, z }) {
  const rad = (d) => (d * Math.PI) / 180;
  const fit =
    (1 / (Math.abs(Math.cos(rad(z))) + Math.abs(Math.sin(rad(z))))) *
    (1 - 0.15 * Math.sin(rad(x)));
  return `rotateX(${x}deg) rotateZ(${z}deg) scale(${fit})`;
}

const at = (p) => ({
  cx: CELL + (p % SIZE) * CELL,
  cy: CELL + Math.floor(p / SIZE) * CELL,
});

const formatMargin = (m) =>
  m === 0 ? "even" : `${m > 0 ? "B" : "W"}+${Math.abs(m)}`;

/** A one-line hint that unfolds into the board, so it takes no space until asked for. */
export default function GoBoard() {
  const [open, setOpen] = useState(false);

  return (
    <section
      className="go-root mt-4 ml-5 text-left font-medium"
      aria-label="A game of Go"
    >
      {open ? (
        <GoGame onHide={() => setOpen(false)} />
      ) : (
        <button
          type="button"
          className="go-hint"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          aria-label="Show a game of Go"
          title="Go?"
        >
          <svg
            className="go-hint-stones"
            viewBox="0 0 26 14"
            aria-hidden="true"
          >
            <circle className="go-hint-b" cx="7" cy="7" r="5.5" />
            <circle className="go-hint-w" cx="19" cy="7" r="5.5" />
          </svg>
        </button>
      )}
    </section>
  );
}

function GoGame({ onHide }) {
  const [game, setGame] = useState(() => newGame(SIZE));
  const [paused, setPaused] = useState(false);
  const [human, setHuman] = useState(false); // visitor plays black
  const [hover, setHover] = useState(-1);
  const prevBoard = useRef(game.board);
  const { tilt, tilted, reset: resetTilt, handlers: tiltHandlers } = useTilt();

  const restart = useCallback(() => {
    prevBoard.current = new Array(SIZE * SIZE).fill(EMPTY);
    setGame(newGame(SIZE));
  }, []);

  // Drive the game: bot-vs-bot when watching, bot as white when a visitor plays.
  useEffect(() => {
    if (game.over) {
      if (human || paused) return;
      const t = setTimeout(restart, RESTART_DELAY);
      return () => clearTimeout(t);
    }
    if (paused && !human) return;
    if (human && game.toPlay === BLACK) return;

    const t = setTimeout(
      () => {
        prevBoard.current = game.board;
        setGame((g) => (g.over ? g : play(g, chooseMove(g)) || play(g, -1)));
      },
      human ? BOT_DELAY : MOVE_DELAY,
    );
    return () => clearTimeout(t);
  }, [game, paused, human, restart]);

  const area = useMemo(() => score(game), [game]);
  const last = game.moves[game.moves.length - 1];

  // Stones removed by the last move, for a brief fade-out ring.
  const ghosts = useMemo(() => {
    if (!last || !last.captured) return [];
    const out = [];
    prevBoard.current.forEach((c, p) => {
      if (c !== EMPTY && game.board[p] === EMPTY) out.push({ p, c });
    });
    return out;
  }, [game, last]);

  const onPoint = (p) => {
    if (!human || game.over || game.toPlay !== BLACK) return;
    const next = play(game, p);
    if (!next) return;
    prevBoard.current = game.board;
    setGame(next);
  };

  const onPass = () => {
    if (!human || game.over || game.toPlay !== BLACK) return;
    prevBoard.current = game.board;
    setGame(play(game, -1));
  };

  const toggleHuman = () => {
    setHuman((h) => !h);
    setPaused(false);
    setHover(-1);
    restart();
  };

  const status = (() => {
    const lead = `${formatMargin(area.margin)} (komi ${KOMI})`;
    if (game.over) return `Game over, ${formatMargin(area.margin)}`;
    if (human) {
      return game.toPlay === BLACK ? `Your move · ${lead}` : "Thinking…";
    }
    return `Move ${game.moves.length}${last ? ` (${coordName(SIZE, last.point)})` : ""} · ${lead}`;
  })();

  return (
    <div className="go-game">
      <div
        className="go-stage"
        {...tiltHandlers}
        title="Drag to tilt · double-click to reset"
      >
        <svg
          className="go-board"
          viewBox={`0 0 ${SPAN} ${SPAN}`}
          role="img"
          aria-label={`Go board, move ${game.moves.length}`}
          style={{ transform: tiltTransform(tilt) }}
          onMouseLeave={() => setHover(-1)}
        >
          {Array.from({ length: SIZE }, (_, i) => (
            <g key={i} className="go-grid">
              <line
                x1={CELL}
                y1={CELL * (i + 1)}
                x2={CELL * SIZE}
                y2={CELL * (i + 1)}
              />
              <line
                x1={CELL * (i + 1)}
                y1={CELL}
                x2={CELL * (i + 1)}
                y2={CELL * SIZE}
              />
            </g>
          ))}
          {HOSHI.map((p) => (
            <circle key={p} className="go-hoshi" {...at(p)} r={3} />
          ))}

          {game.over &&
            area.territory.map((owner, p) =>
              owner === EMPTY ? null : (
                <rect
                  key={`t${p}`}
                  className={`go-territory ${owner === BLACK ? "b" : "w"}`}
                  x={at(p).cx - 5}
                  y={at(p).cy - 5}
                  width={10}
                  height={10}
                />
              ),
            )}

          {ghosts.map(({ p, c }) => (
            <circle
              key={`g${game.moves.length}-${p}`}
              className={`go-ghost ${c === BLACK ? "b" : "w"}`}
              {...at(p)}
              r={CELL * 0.44}
            />
          ))}

          {game.board.map((c, p) =>
            c === EMPTY ? null : (
              <circle
                key={`s${p}-${c}`}
                className={`go-stone ${c === BLACK ? "b" : "w"}`}
                {...at(p)}
                r={CELL * 0.45}
              />
            ),
          )}

          {last && last.point >= 0 && (
            <circle
              className={`go-last ${last.color === BLACK ? "on-b" : "on-w"}`}
              {...at(last.point)}
              r={CELL * 0.16}
            />
          )}

          {human && hover >= 0 && game.board[hover] === EMPTY && (
            <circle
              className="go-stone b go-preview"
              {...at(hover)}
              r={CELL * 0.45}
            />
          )}

          {human &&
            game.board.map((c, p) => (
              <rect
                key={`h${p}`}
                className="go-hit"
                x={at(p).cx - CELL / 2}
                y={at(p).cy - CELL / 2}
                width={CELL}
                height={CELL}
                onMouseEnter={() => setHover(p)}
                onClick={() => onPoint(p)}
              />
            ))}
        </svg>
      </div>

      <p className="go-status">{status}</p>
      <div className="go-controls">
        {!human && (
          <button
            type="button"
            className="hover:italic"
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? "resume" : "pause"}
          </button>
        )}
        {human && (
          <button
            type="button"
            className="hover:italic"
            onClick={onPass}
            disabled={game.over || game.toPlay !== BLACK}
          >
            pass
          </button>
        )}
        <button type="button" className="hover:italic" onClick={restart}>
          restart
        </button>
        <button type="button" className="hover:italic" onClick={toggleHuman}>
          {human ? "just watch" : "play it"}
        </button>
        {tilted && (
          <button type="button" className="hover:italic" onClick={resetTilt}>
            flatten
          </button>
        )}
        <button type="button" className="hover:italic" onClick={onHide}>
          hide
        </button>
      </div>
    </div>
  );
}
