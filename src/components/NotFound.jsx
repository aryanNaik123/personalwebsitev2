import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { notFoundDiscs } from "../data/notFoundDiscs";
import "./NotFound.css";

const THUMB = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

const PHASE_EMPTY = "empty";
const PHASE_INSERTING = "inserting";
const PHASE_LOADED = "loaded";
const PHASE_EJECTING = "ejecting";

export default function NotFound() {
  const [phase, setPhase] = useState(PHASE_EMPTY);
  const [disc, setDisc] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [slotHover, setSlotHover] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [playerShake, setPlayerShake] = useState(false);
  const timerRef = useRef(null);
  const timerRef2 = useRef(null);

  useEffect(() => {
    document.title = "404 — Aryan Naik";
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(timerRef2.current);
    };
  }, []);

  const insertDisc = useCallback((discId) => {
    if (phase !== PHASE_EMPTY) return;
    const found = notFoundDiscs.find((d) => d.id === discId);
    if (!found) return;

    setDisc(found);
    setPhase(PHASE_INSERTING);
    setSelectedId(null);
    setShowFlash(false);
    setPlayerShake(false);

    timerRef.current = setTimeout(() => {
      setShowFlash(true);
      setPlayerShake(true);
      timerRef2.current = setTimeout(() => {
        setShowFlash(false);
        setPlayerShake(false);
      }, 600);
      setPhase(PHASE_LOADED);
    }, 900);
  }, [phase]);

  const eject = useCallback(() => {
    if (phase !== PHASE_LOADED) return;
    setPhase(PHASE_EJECTING);

    timerRef.current = setTimeout(() => {
      setPhase(PHASE_EMPTY);
      setDisc(null);
    }, 650);
  }, [phase]);

  const onDragStart = (e, discId) => {
    setDragId(discId);
    e.dataTransfer.setData("text/plain", discId);
    e.dataTransfer.effectAllowed = "copy";
  };

  const onDragEnd = () => {
    setDragId(null);
    setSlotHover(false);
  };

  const onSlotDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setSlotHover(true);
  };

  const onSlotDrop = (e) => {
    e.preventDefault();
    setSlotHover(false);
    const id = e.dataTransfer.getData("text/plain") || dragId;
    if (id) insertDisc(id);
    setDragId(null);
  };

  const onSlotClick = () => {
    if (selectedId) insertDisc(selectedId);
  };

  const onDiscClick = (discId) => {
    setSelectedId((prev) => (prev === discId ? null : discId));
  };

  const isEmpty = phase === PHASE_EMPTY;
  const isInserting = phase === PHASE_INSERTING;
  const isLoaded = phase === PHASE_LOADED;
  const isEjecting = phase === PHASE_EJECTING;
  const hasDisc = disc !== null;

  return (
    <div className="not-found-wrap">
      <Link to="/" className="not-found-back">⏮️</Link>

      <div className="not-found-header">
        <h1 className="not-found-title">this page doesn't exist</h1>
        <p className="not-found-blurb">
          but while you're here — pick a disc and drop it in the player.
        </p>
      </div>

      <div className="not-found-stage">
        <div className={`not-found-player ${playerShake ? "not-found-player--shake" : ""}`}>
          <div className="not-found-player-label">Player</div>

          <div className={`not-found-eject-slit ${isEjecting ? "not-found-eject-slit--active" : ""}`}>
            {isEjecting && hasDisc && (
              <div className="not-found-eject-disc-wrap not-found-eject-disc-wrap--active">
                <div
                  className="not-found-disc"
                  style={{ width: 64, height: 64, "--disc-size": "64px", cursor: "default" }}
                >
                  <span className="not-found-disc-grooves" />
                  <span className="not-found-disc-sheen" style={{ opacity: 1 }} />
                  <img className="not-found-disc-cover" src={THUMB(disc.youtubeId)} alt="" />
                  <span className="not-found-disc-rim" />
                  <span className="not-found-disc-hole not-found-disc-hole--shelf" />
                </div>
              </div>
            )}
          </div>

          <div
            role="button"
            tabIndex={0}
            className={[
              "not-found-slot",
              isLoaded && "not-found-slot--loaded",
              isInserting && "not-found-slot--inserting",
              slotHover && isEmpty && "not-found-slot--drag",
              isEmpty && selectedId && "not-found-slot--active",
            ].filter(Boolean).join(" ")}
            onDragOver={isEmpty ? onSlotDragOver : undefined}
            onDragLeave={isEmpty ? () => setSlotHover(false) : undefined}
            onDrop={isEmpty ? onSlotDrop : undefined}
            onClick={isEmpty ? onSlotClick : undefined}
            onKeyDown={(e) => {
              if (isEmpty && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onSlotClick();
              }
            }}
            aria-label="DVD slot"
          >
            {(isEmpty || isInserting) && <div className="not-found-slot-groove" aria-hidden />}
            {showFlash && <div className="not-found-slot-flash" />}

            {isEmpty && selectedId && (
              <p className="not-found-slot-hint">tap here to load</p>
            )}

            {isInserting && hasDisc && (
              <>
                <div className="not-found-slot-shadow" />
                <div className="not-found-slot-disc not-found-slot-disc--inserting">
                  <div
                    className="not-found-disc"
                    style={{ width: 76, height: 76, "--disc-size": "76px", cursor: "default" }}
                  >
                    <span className="not-found-disc-grooves" />
                    <span className="not-found-disc-sheen" style={{ opacity: 1 }} />
                    <img className="not-found-disc-cover" src={THUMB(disc.youtubeId)} alt="" />
                    <span className="not-found-disc-rim" />
                    <span className="not-found-disc-hole not-found-disc-hole--shelf" />
                  </div>
                </div>
              </>
            )}

            {isLoaded && hasDisc && (
              <>
                <div className="not-found-led-panel">
                  <span className="not-found-led" />
                  <div className="not-found-led-info">
                    <div className="not-found-led-title">{disc.title}</div>
                    <div className="not-found-led-subtitle">{disc.subtitle}</div>
                  </div>
                  <button
                    type="button"
                    className="not-found-eject"
                    onClick={(e) => { e.stopPropagation(); eject(); }}
                  >
                    eject ⏏
                  </button>
                </div>
                <div className="not-found-led-bar-track">
                  <div className="not-found-led-bar-fill" />
                </div>
              </>
            )}

            {isEjecting && (
              <p className="not-found-slot-hint">ejecting…</p>
            )}
          </div>

          {isLoaded && hasDisc && (
            <div className="not-found-video-wrap">
              <iframe
                className="not-found-video"
                title={`Now playing: ${disc.title}`}
                src={`https://www.youtube.com/embed/${disc.youtubeId}?rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}

          <div className="not-found-shelf-label">Shelf</div>
          <div className="not-found-shelf">
            {notFoundDiscs.map((d) => (
              <div key={d.id} className="not-found-disc-item">
                <button
                  type="button"
                  draggable={isEmpty}
                  onDragStart={isEmpty ? (e) => onDragStart(e, d.id) : undefined}
                  onDragEnd={isEmpty ? onDragEnd : undefined}
                  onClick={() => isEmpty && onDiscClick(d.id)}
                  className={[
                    "not-found-disc",
                    selectedId === d.id && "not-found-disc--selected",
                    hasDisc && disc.id === d.id && !isEmpty && "not-found-disc--dimmed",
                  ].filter(Boolean).join(" ")}
                  aria-pressed={selectedId === d.id}
                  aria-label={`${d.title} — ${d.subtitle}`}
                  style={hasDisc && disc.id === d.id && !isEmpty ? { opacity: 0.35, pointerEvents: "none" } : undefined}
                >
                  <span className="not-found-disc-grooves" />
                  <span className="not-found-disc-sheen" />
                  <img className="not-found-disc-cover" src={THUMB(d.youtubeId)} alt="" />
                  <span className="not-found-disc-rim" />
                  <span className="not-found-disc-hole not-found-disc-hole--shelf" />
                </button>
                <div className="not-found-disc-caption">
                  <span className="not-found-disc-caption-title" title={d.title}>
                    {d.title}
                  </span>
                  <span className="not-found-disc-caption-kind">
                    {d.kind}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="not-found-footer">
          <Link to="/" className="not-found-home-link">
            ← back home
          </Link>
        </div>
      </div>
    </div>
  );
}
