import React, { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import LinkPreviewStage from "./LinkPreviewStage";
import { useLinkPreview } from "../utils/linkPreview";
import "./LinkPopup.css";

function hostnameOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function faviconOf(host) {
  if (!host) return "";
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
    host
  )}&sz=32`;
}

function usefulText(text) {
  if (!text) return "";
  if (/couldn't find lead section/i.test(text)) return "";
  return text;
}

function clipText(text, max = 420) {
  const cleaned = usefulText(text);
  if (!cleaned || cleaned.length <= max) return cleaned;
  const cut = cleaned.slice(0, max);
  const at = cut.lastIndexOf(" ");
  return `${(at > 80 ? cut.slice(0, at) : cut).trim()}…`;
}

function placePopup(el, anchorRect) {
  const width = el.offsetWidth;
  const height = el.offsetHeight;
  const margin = 12;
  const gap = 10;
  let left = anchorRect.left;
  let top = anchorRect.bottom + gap;

  if (left + width > window.innerWidth - margin) {
    left = window.innerWidth - width - margin;
  }
  if (left < margin) left = margin;

  if (top + height > window.innerHeight - margin) {
    top = anchorRect.top - height - gap;
  }
  if (top < margin) top = margin;

  return { top, left };
}

export default function LinkPopup({
  bookmark,
  anchorRect,
  pinned,
  onPin,
  onClose,
  onMouseEnter,
  onMouseLeave,
}) {
  const ref = useRef(null);
  const dragRef = useRef(null);
  const movedRef = useRef(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, ready: false });
  const [dragging, setDragging] = useState(false);
  const host = hostnameOf(bookmark.link);
  const favicon = faviconOf(host);
  const preview = useLinkPreview(bookmark.link);
  const snippet = clipText(bookmark.snippet || preview?.description);
  const quote = clipText(bookmark.highlightedText, 280);

  useLayoutEffect(() => {
    if (!ref.current || !anchorRect || movedRef.current) return;
    const next = placePopup(ref.current, anchorRect);
    setCoords({ ...next, ready: true });
  }, [anchorRect, bookmark.id, snippet]);

  const clampPosition = (left, top) => {
    const el = ref.current;
    const margin = 8;
    const width = el ? el.offsetWidth : 0;
    const height = el ? el.offsetHeight : 0;
    return {
      left: Math.min(
        Math.max(margin, left),
        Math.max(margin, window.innerWidth - width - margin)
      ),
      top: Math.min(
        Math.max(margin, top),
        Math.max(margin, window.innerHeight - height - margin)
      ),
    };
  };

  const onBarPointerDown = (event) => {
    if (event.button !== 0) return;
    if (event.target.closest(".link-popup-bar-btn")) return;
    event.preventDefault();
    movedRef.current = true;
    dragRef.current = {
      offsetX: event.clientX - coords.left,
      offsetY: event.clientY - coords.top,
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    if (!pinned) onPin();
  };

  const onBarPointerMove = (event) => {
    if (!dragRef.current) return;
    const next = clampPosition(
      event.clientX - dragRef.current.offsetX,
      event.clientY - dragRef.current.offsetY
    );
    setCoords((current) => ({ ...current, ...next }));
  };

  const onBarPointerUp = (event) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDragging(false);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // already released
    }
  };

  return createPortal(
    <div
      ref={ref}
      className={`link-popup${pinned ? " link-popup--pinned" : ""}${
        dragging ? " is-dragging" : ""
      }`}
      role="dialog"
      aria-label={bookmark.title || host || "Link preview"}
      style={{
        top: coords.top,
        left: coords.left,
        visibility: coords.ready ? "visible" : "hidden",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={(event) => {
        if (dragRef.current) return;
        onMouseLeave(event);
      }}
    >
      <div
        className="link-popup-bar"
        title="Drag to move"
        onPointerDown={onBarPointerDown}
        onPointerMove={onBarPointerMove}
        onPointerUp={onBarPointerUp}
        onPointerCancel={onBarPointerUp}
      >
        <button
          type="button"
          className="link-popup-bar-btn"
          aria-label="Close preview"
          title="Close"
          onClick={onClose}
        >
          ×
        </button>
        <button
          type="button"
          className={`link-popup-bar-btn${pinned ? " is-active" : ""}`}
          aria-label={pinned ? "Unpin preview" : "Pin preview"}
          aria-pressed={pinned}
          title={pinned ? "Unpin" : "Pin"}
          onClick={onPin}
        >
          ⌖
        </button>
        <span className="link-popup-bar-title">
          {bookmark.title || host || "Untitled"}
        </span>
      </div>

      <LinkPreviewStage
        url={bookmark.link}
        host={host}
        title={bookmark.title}
        preview={preview}
      />

      <div className="link-popup-body">
        <div className="link-popup-kicker">
          {favicon ? (
            <img
              className="link-popup-favicon"
              src={favicon}
              alt=""
              width="14"
              height="14"
            />
          ) : null}
          <span>{host}</span>
        </div>
        <a
          className="link-popup-title"
          href={bookmark.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {bookmark.title || "Untitled"}
        </a>
        {snippet ? <p className="link-popup-snippet">{snippet}</p> : null}
        {quote ? (
          <blockquote className="link-popup-quote">
            “{quote}”
            {bookmark.comment?.text ? (
              <p className="link-popup-comment">{bookmark.comment.text}</p>
            ) : null}
          </blockquote>
        ) : null}
      </div>
    </div>,
    document.body
  );
}

export { hostnameOf };
