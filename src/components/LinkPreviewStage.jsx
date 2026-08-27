import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  claimFrameSlot,
  embedUrlOf,
  isSameOrigin,
  liveFramesAllowed,
  releaseFrameSlot,
} from "../utils/linkPreview";

// The page is rendered at desktop width and scaled down, so it reads like the real site.
const FRAME_WIDTH = 980;
const FRAME_TIMEOUT_MS = 7000;

export default function LinkPreviewStage({ url, host, title, preview }) {
  const stageRef = useRef(null);
  const tokenRef = useRef({});

  const [box, setBox] = useState(null);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [frameGaveUp, setFrameGaveUp] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [hasSlot, setHasSlot] = useState(false);
  const [framesEnabled] = useState(() => liveFramesAllowed());

  const embedUrl = useMemo(() => embedUrlOf(url), [url]);

  const frameSrc =
    framesEnabled && !frameGaveUp
      ? embedUrl ||
        (preview?.embeddable && !isSameOrigin(url)
          ? preview.finalUrl || url
          : null)
      : null;

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    if (!width || !height) return;
    const scale = width / FRAME_WIDTH;
    setBox({ scale, height: Math.round(height / scale) });
  }, []);

  useEffect(() => {
    if (!frameSrc) return undefined;
    const token = tokenRef.current;
    setHasSlot(claimFrameSlot(token));
    return () => {
      releaseFrameSlot(token);
      setHasSlot(false);
    };
  }, [frameSrc]);

  const showFrame = Boolean(frameSrc) && hasSlot && Boolean(box);

  // Some pages accept the frame but never finish loading; fall back rather than hang.
  useEffect(() => {
    if (!showFrame || frameLoaded) return undefined;
    const timer = setTimeout(() => setFrameGaveUp(true), FRAME_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [showFrame, frameLoaded]);

  const image = !showFrame && !imageFailed ? preview?.image : null;
  const waiting = !preview || (showFrame && !frameLoaded);
  const empty = Boolean(preview) && !showFrame && !image;

  return (
    <div className="link-popup-stage" ref={stageRef}>
      {showFrame ? (
        <iframe
          className={`link-popup-frame${frameLoaded ? " is-loaded" : ""}`}
          src={frameSrc}
          title={`Preview of ${title || host || url}`}
          sandbox="allow-scripts allow-same-origin"
          referrerPolicy="no-referrer"
          loading="lazy"
          scrolling="no"
          tabIndex={-1}
          style={{
            width: FRAME_WIDTH,
            height: box.height,
            transform: `scale(${box.scale})`,
          }}
          onLoad={() => setFrameLoaded(true)}
        />
      ) : null}

      {image ? (
        <img
          className="link-popup-shot"
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
        />
      ) : null}

      {waiting || empty ? (
        <div
          className={`link-popup-stage-placeholder${empty ? " is-static" : ""}`}
          aria-hidden="true"
        >
          <span>{host || "preview unavailable"}</span>
        </div>
      ) : null}

      <a
        className="link-popup-stage-link"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${title || host || "link"} in a new tab`}
      >
        <span className="link-popup-stage-badge">
          {showFrame ? "live preview" : "open"}
        </span>
      </a>
    </div>
  );
}
