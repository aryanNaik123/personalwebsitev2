import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createEmulator } from "../gameboy/emulator";
import { loadStoredRom, saveRom } from "../gameboy/rom";
import "./GameBoy.css";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const KEY_MAP = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  W: "up",
  a: "left",
  A: "a",
  s: "down",
  S: "down",
  d: "right",
  D: "right",
  z: "a",
  Z: "a",
  j: "a",
  J: "a",
  x: "b",
  X: "b",
  k: "b",
  K: "b",
  " ": "a",
  Enter: "start",
  Shift: "select",
};

function fitScale() {
  const h = (window.innerHeight - 48) / 640;
  const w = (window.innerWidth - 32) / 340;
  return Math.max(0.42, Math.min(1, h, w));
}

function dirFromPointer(event, el) {
  const r = el.getBoundingClientRect();
  const x = (event.clientX - r.left) / r.width - 0.5;
  const y = (event.clientY - r.top) / r.height - 0.5;
  if (Math.abs(x) < 0.1 && Math.abs(y) < 0.1) return null;
  return Math.abs(x) > Math.abs(y)
    ? x > 0
      ? "right"
      : "left"
    : y > 0
      ? "down"
      : "up";
}

function isRomFile(file) {
  if (!file) return false;
  const name = file.name.toLowerCase();
  return name.endsWith(".gb") || name.endsWith(".gbc");
}

export function openGameBoy() {
  window.dispatchEvent(new Event("open-gameboy"));
}

export default function GameBoy() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [powered, setPowered] = useState(true);
  const [muted, setMuted] = useState(false);
  const [down, setDown] = useState({});
  const [scale, setScale] = useState(1);
  const [rom, setRom] = useState(null);
  const [awaitingCart, setAwaitingCart] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const canvasRef = useRef(null);
  const cartInputRef = useRef(null);
  const gameRef = useRef(null);
  const dpadRef = useRef(null);
  const dpadDir = useRef(null);
  const dpadHeld = useRef(false);
  const konami = useRef([]);

  const close = useCallback(() => {
    setOpen(false);
    setPowered(true);
    setDragOver(false);
    if (location.pathname === "/gb") navigate("/");
  }, [location.pathname, navigate]);

  const openIt = useCallback(() => {
    setOpen(true);
    setPowered(true);
  }, []);

  const insertRom = useCallback(async (file) => {
    if (!isRomFile(file)) return;
    try {
      const buf = await file.arrayBuffer();
      await saveRom(buf);
      setRom(buf);
      setAwaitingCart(false);
    } catch {
      setAwaitingCart(true);
    }
  }, []);

  useEffect(() => {
    if (location.pathname.replace(/\/$/, "") === "/gb") openIt();
  }, [location.pathname, openIt]);

  useEffect(() => {
    const onOpen = () => openIt();
    window.addEventListener("open-gameboy", onOpen);
    return () => window.removeEventListener("open-gameboy", onOpen);
  }, [openIt]);

  useEffect(() => {
    const onKey = (e) => {
      if (open) return;
      if (e.target && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const next = [...konami.current, key].slice(-KONAMI.length);
      konami.current = next;
      if (next.join() === KONAMI.join()) {
        konami.current = [];
        openIt();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, openIt]);

  useEffect(() => {
    const onResize = () => setScale(fitScale());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    let dead = false;
    if (rom) {
      setAwaitingCart(false);
      return undefined;
    }
    loadStoredRom()
      .then((buf) => {
        if (dead) return;
        if (buf) {
          setRom(buf);
          setAwaitingCart(false);
        } else {
          setAwaitingCart(true);
        }
      })
      .catch(() => {
        if (!dead) setAwaitingCart(true);
      });
    return () => {
      dead = true;
    };
  }, [open, rom]);

  useEffect(() => {
    if (!open || !powered || !rom || !canvasRef.current) return undefined;
    let dead = false;
    let game = null;
    createEmulator(canvasRef.current, rom, { muted })
      .then((instance) => {
        if (dead) {
          instance.destroy();
          return;
        }
        game = instance;
        gameRef.current = instance;
        instance.start();
        setMuted(instance.isMuted());
      })
      .catch((err) => {
        console.error(err);
        if (!dead) setAwaitingCart(true);
      });
    return () => {
      dead = true;
      game?.destroy();
      gameRef.current = null;
    };
    // muted is applied at boot; speaker toggles live via the instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, powered, rom]);

  const sendDown = useCallback((btn) => {
    if (!btn) return;
    gameRef.current?.buttonDown(btn);
    setDown((d) => ({ ...d, [btn]: true }));
  }, []);

  const sendUp = useCallback((btn) => {
    if (!btn) return;
    gameRef.current?.buttonUp(btn);
    setDown((d) => ({ ...d, [btn]: false }));
  }, []);

  const toggleMute = useCallback(() => {
    const next = gameRef.current?.toggleMute();
    if (typeof next === "boolean") setMuted(next);
    else setMuted((m) => !m);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      const btn = KEY_MAP[e.key];
      if (!btn) return;
      e.preventDefault();
      if (e.repeat) return;
      sendDown(btn);
    };
    const onUp = (e) => {
      const btn = KEY_MAP[e.key];
      if (!btn) return;
      e.preventDefault();
      sendUp(btn);
    };
    const onBlur = () => {
      ["up", "down", "left", "right", "a", "b", "start", "select"].forEach(
        sendUp
      );
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [open, close, sendDown, sendUp]);

  const onDpadDown = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dpadHeld.current = true;
    const dir = dirFromPointer(event, dpadRef.current);
    dpadDir.current = dir;
    sendDown(dir);
  };

  const onDpadMove = (event) => {
    if (!dpadHeld.current) return;
    const dir = dirFromPointer(event, dpadRef.current);
    if (dir === dpadDir.current) return;
    sendUp(dpadDir.current);
    dpadDir.current = dir;
    sendDown(dir);
  };

  const onDpadUp = () => {
    dpadHeld.current = false;
    sendUp(dpadDir.current);
    dpadDir.current = null;
  };

  const onDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = (event) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    setDragOver(false);
  };

  const onDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) insertRom(file);
  };

  if (!open) return null;

  return (
    <div
      className={`gb-root${dragOver ? " is-drop" : ""}`}
      role="dialog"
      aria-label="Game Boy Color"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onPointerDown={() => gameRef.current?.kickAudio?.()}
    >
      <p className="gb-hint">
        <kbd>esc</kbd> to put it down
      </p>
      <div className="gb-stage" style={{ "--gb-scale": scale }}>
        <div className="gb-floor-shadow" />
        <div className="gb-device">
          <label
            className={`gb-cart${rom ? " is-in" : ""}`}
            title="Insert cartridge"
          >
            <input
              ref={cartInputRef}
              type="file"
              accept=".gb,.gbc"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file) insertRom(file);
              }}
            />
            <i className="gb-cart-label" />
          </label>
          <button
            type="button"
            className="gb-power"
            aria-label={powered ? "Power off" : "Power on"}
            onClick={() => setPowered((p) => !p)}
          />
          <div className="gb-screen-well">
            <span className={`gb-led${powered ? " on" : ""}`} />
            <span className="gb-wordmark">
              GAME BOY <em>COLOR</em>
            </span>
            <div className="gb-lcd">
              {powered ? (
                <canvas ref={canvasRef} width={160} height={144} />
              ) : null}
              {powered && awaitingCart ? (
                <button
                  type="button"
                  className="gb-insert"
                  onClick={() => cartInputRef.current?.click()}
                >
                  <span>insert cartridge</span>
                </button>
              ) : null}
              <div className="gb-glass" />
              {powered ? <div className="gb-scan" /> : null}
            </div>
          </div>
          <div className="gb-controls">
            <div
              ref={dpadRef}
              className={[
                "gb-dpad",
                down.up && "press-up",
                down.down && "press-down",
                down.left && "press-left",
                down.right && "press-right",
              ]
                .filter(Boolean)
                .join(" ")}
              onPointerDown={onDpadDown}
              onPointerMove={onDpadMove}
              onPointerUp={onDpadUp}
              onPointerCancel={onDpadUp}
            >
              <i className="gb-dpad-h" />
              <i className="gb-dpad-v" />
              <i className="gb-dpad-nub" />
            </div>
            <div className="gb-ab">
              <button
                type="button"
                className={`gb-face${down.b ? " is-down" : ""}`}
                aria-label="B"
                onPointerDown={(e) => {
                  e.preventDefault();
                  sendDown("b");
                }}
                onPointerUp={() => sendUp("b")}
                onPointerCancel={() => sendUp("b")}
              >
                B
              </button>
              <button
                type="button"
                className={`gb-face gb-face-a${down.a ? " is-down" : ""}`}
                aria-label="A"
                onPointerDown={(e) => {
                  e.preventDefault();
                  sendDown("a");
                }}
                onPointerUp={() => sendUp("a")}
                onPointerCancel={() => sendUp("a")}
              >
                A
              </button>
            </div>
            <div className="gb-menu">
              <button
                type="button"
                className={`gb-pill${down.select ? " is-down" : ""}`}
                onPointerDown={(e) => {
                  e.preventDefault();
                  sendDown("select");
                }}
                onPointerUp={() => sendUp("select")}
                onPointerCancel={() => sendUp("select")}
              >
                <span />
                <label>select</label>
              </button>
              <button
                type="button"
                className={`gb-pill${down.start ? " is-down" : ""}`}
                onPointerDown={(e) => {
                  e.preventDefault();
                  sendDown("start");
                }}
                onPointerUp={() => sendUp("start")}
                onPointerCancel={() => sendUp("start")}
              >
                <span />
                <label>start</label>
              </button>
            </div>
          </div>
          <div
            className="gb-speaker"
            onClick={toggleMute}
            role="button"
            aria-label="Mute"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <div className={`gb-mute-dot${muted ? " on" : ""}`} />
        </div>
      </div>
    </div>
  );
}
