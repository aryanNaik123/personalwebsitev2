import { useEffect, useState } from "react";

const MAX_CACHED = 150;
const MAX_LIVE_FRAMES = 2;

const cache = new Map();
const inFlight = new Map();
const liveFrames = new Set();

const FAILED = { ok: false, embeddable: false, image: null };

function remember(url, data) {
  if (cache.size >= MAX_CACHED) {
    cache.delete(cache.keys().next().value);
  }
  cache.set(url, data);
}

export function fetchPreview(url) {
  if (cache.has(url)) return Promise.resolve(cache.get(url));
  if (inFlight.has(url)) return inFlight.get(url);

  const request = fetch(`/api/preview?url=${encodeURIComponent(url)}`)
    .then((res) => (res.ok ? res.json() : FAILED))
    .catch(() => FAILED)
    .then((data) => {
      remember(url, data);
      inFlight.delete(url);
      return data;
    });

  inFlight.set(url, request);
  return request;
}

export function useLinkPreview(url) {
  const [preview, setPreview] = useState(() => cache.get(url) || null);

  useEffect(() => {
    if (!url) return undefined;

    const cached = cache.get(url);
    if (cached) {
      setPreview(cached);
      return undefined;
    }

    let active = true;
    setPreview(null);
    fetchPreview(url).then((data) => {
      if (active) setPreview(data);
    });

    return () => {
      active = false;
    };
  }, [url]);

  return preview;
}

// Rendering a real page is the expensive part, so keep it off metered or tiny screens.
export function liveFramesAllowed() {
  if (typeof window === "undefined") return false;
  if (window.innerWidth < 640) return false;

  const connection =
    navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection) {
    if (connection.saveData) return false;
    if (/(^|-)2g$/.test(connection.effectiveType || "")) return false;
  }

  return !window.matchMedia("(prefers-reduced-data: reduce)").matches;
}

export function claimFrameSlot(token) {
  if (liveFrames.has(token)) return true;
  if (liveFrames.size >= MAX_LIVE_FRAMES) return false;
  liveFrames.add(token);
  return true;
}

export function releaseFrameSlot(token) {
  liveFrames.delete(token);
}

// Players and readers that refuse to be framed have purpose-built embeds instead.
export function embedUrlOf(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1);
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = parsed.searchParams.get("v");
    if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
    const short = parsed.pathname.match(/^\/(?:embed|shorts)\/([\w-]+)/);
    if (short) return `https://www.youtube-nocookie.com/embed/${short[1]}`;
  }

  return null;
}

export function isSameOrigin(url) {
  try {
    return new URL(url).origin === window.location.origin;
  } catch {
    return false;
  }
}
