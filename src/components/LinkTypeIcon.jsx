import React, { useState } from "react";

function hostnameOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function IconWrap({ label, children }) {
  return (
    <span className="link-type-icon" title={label} aria-hidden="true">
      {children}
    </span>
  );
}

function SvgIcon({ children, viewBox = "0 0 24 24" }) {
  return (
    <svg viewBox={viewBox} width="13" height="13" fill="currentColor">
      {children}
    </svg>
  );
}

function WikipediaIcon() {
  return (
    <span
      className="link-type-icon link-type-icon--wikipedia"
      title="Wikipedia"
      aria-hidden="true"
    >
      <svg viewBox="0 0 128 128" width="14" height="14" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M 120.85,29.21 C 120.85,29.62 120.72,29.99 120.47,30.33 C 120.21,30.66 119.94,30.83 119.63,30.83 C 117.14,31.07 115.09,31.87 113.51,33.24 C 111.92,34.6 110.29,37.21 108.6,41.05 L 82.8,99.19 C 82.63,99.73 82.16,100 81.38,100 C 80.77,100 80.3,99.73 79.96,99.19 L 65.49,68.93 L 48.85,99.19 C 48.51,99.73 48.04,100 47.43,100 C 46.69,100 46.2,99.73 45.96,99.19 L 20.61,41.05 C 19.03,37.44 17.36,34.92 15.6,33.49 C 13.85,32.06 11.4,31.17 8.27,30.83 C 8,30.83 7.74,30.69 7.51,30.4 C 7.27,30.12 7.15,29.79 7.15,29.42 C 7.15,28.47 7.42,28 7.96,28 C 10.22,28 12.58,28.1 15.05,28.3 C 17.34,28.51 19.5,28.61 21.52,28.61 C 23.58,28.61 26.01,28.51 28.81,28.3 C 31.74,28.1 34.34,28 36.6,28 C 37.14,28 37.41,28.47 37.41,29.42 C 37.41,30.36 37.24,30.83 36.91,30.83 C 34.65,31 32.87,31.58 31.57,32.55 C 30.27,33.53 29.62,34.81 29.62,36.4 C 29.62,37.21 29.89,38.22 30.43,39.43 L 51.38,86.74 L 63.27,64.28 L 52.19,41.05 C 50.2,36.91 48.56,34.23 47.28,33.03 C 46,31.84 44.06,31.1 41.46,30.83 C 41.22,30.83 41,30.69 40.78,30.4 C 40.56,30.12 40.45,29.79 40.45,29.42 C 40.45,28.47 40.68,28 41.16,28 C 43.42,28 45.49,28.1 47.38,28.3 C 49.2,28.51 51.14,28.61 53.2,28.61 C 55.22,28.61 57.36,28.51 59.62,28.3 C 61.95,28.1 64.24,28 66.5,28 C 67.04,28 67.31,28.47 67.31,29.42 C 67.31,30.36 67.15,30.83 66.81,30.83 C 62.29,31.14 60.03,32.42 60.03,34.68 C 60.03,35.69 60.55,37.26 61.6,39.38 L 68.93,54.26 L 76.22,40.65 C 77.23,38.73 77.74,37.11 77.74,35.79 C 77.74,32.69 75.48,31.04 70.96,30.83 C 70.55,30.83 70.35,30.36 70.35,29.42 C 70.35,29.08 70.45,28.76 70.65,28.46 C 70.86,28.15 71.06,28 71.26,28 C 72.88,28 74.87,28.1 77.23,28.3 C 79.49,28.51 81.35,28.61 82.8,28.61 C 83.84,28.61 85.38,28.52 87.4,28.35 C 89.96,28.12 92.11,28 93.83,28 C 94.23,28 94.43,28.4 94.43,29.21 C 94.43,30.29 94.06,30.83 93.32,30.83 C 90.69,31.1 88.57,31.83 86.97,33.01 C 85.37,34.19 83.37,36.87 80.98,41.05 L 71.26,59.02 L 84.42,85.83 L 103.85,40.65 C 104.52,39 104.86,37.48 104.86,36.1 C 104.86,32.79 102.6,31.04 98.08,30.83 C 97.67,30.83 97.47,30.36 97.47,29.42 C 97.47,28.47 97.77,28 98.38,28 C 100.03,28 101.99,28.1 104.25,28.3 C 106.34,28.51 108.1,28.61 109.51,28.61 C 111,28.61 112.72,28.51 114.67,28.3 C 116.7,28.1 118.52,28 120.14,28 C 120.61,28 120.85,28.4 120.85,29.21 z"
        />
      </svg>
    </span>
  );
}

function YouTubeIcon() {
  return (
    <IconWrap label="YouTube">
      <SvgIcon>
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12z" />
      </SvgIcon>
    </IconWrap>
  );
}

function SubstackIcon() {
  return (
    <IconWrap label="Substack">
      <SvgIcon>
        <path d="M22 8.5H2V5h20v3.5zM2 10.75h20V22L12 16.5 2 22V10.75zM2 3.25h20V1.5H2v1.75z" />
      </SvgIcon>
    </IconWrap>
  );
}

function GitHubIcon() {
  return (
    <IconWrap label="GitHub">
      <SvgIcon>
        <path d="M12 .3C5.37.3 0 5.67 0 12.3c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58 0-.28-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.22.69.83.57C20.56 22.1 24 17.6 24 12.3 24 5.67 18.63.3 12 .3z" />
      </SvgIcon>
    </IconWrap>
  );
}

function XIcon() {
  return (
    <IconWrap label="X">
      <SvgIcon>
        <path d="M14.3 10.2 22.7 1h-2L13.4 8.9 8.2 1H1.3l8.9 12.7L1.3 23h2l7.6-8.6L16 23h6.9l-8.6-12.8zm-2.7 3 1-1.3 6.7 9.6h-2.3l-5.4-8.3zm-6.8-10 5.2 7.6 1 1.3L5.2 21.5h2.3l6.8-9.7L18.8 3h-2.3L8.8 11.8 7.8 10.5 4.8 3.2z" />
      </SvgIcon>
    </IconWrap>
  );
}

function ArxivIcon() {
  return (
    <IconWrap label="arXiv">
      <SvgIcon>
        <path d="M3.5 4.5 10 12 3.5 19.5h3.2L12 14.2l5.3 5.3h3.2L13.9 12l6.6-7.5h-3.2L12 9.8 6.7 4.5z" />
      </SvgIcon>
    </IconWrap>
  );
}

function PdfIcon() {
  return (
    <IconWrap label="PDF">
      <SvgIcon>
        <path d="M6 2h8.5L20 7.5V22a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1.5V8h4.5L14 3.5zM8 12h2.2c1.4 0 2.3.8 2.3 2s-.9 2-2.3 2H9.2V18H8v-6zm1.2 1.1v1.8h.9c.7 0 1.1-.3 1.1-.9s-.4-.9-1.1-.9h-.9zM14 12h3.4v1.1H15.2v1.3h1.9v1.1h-1.9V18H14v-6z" />
      </SvgIcon>
    </IconWrap>
  );
}

function DiamondIcon() {
  return (
    <IconWrap label="">
      <svg viewBox="0 0 46 46" width="11" height="11" fill="none">
        <path
          stroke="currentColor"
          strokeWidth="4"
          d="M2.828 22.627L22.627 2.828l19.799 19.8-19.8 19.798z"
        />
        <path
          fill="currentColor"
          d="M17 22.657L22.657 17l5.657 5.657-5.657 5.657z"
        />
      </svg>
    </IconWrap>
  );
}

function FaviconIcon({ host }) {
  const [failed, setFailed] = useState(false);
  if (!host || failed) return <DiamondIcon />;

  return (
    <img
      className="link-type-icon link-type-icon--img"
      src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(
        host
      )}&sz=32`}
      alt=""
      width="13"
      height="13"
      onError={() => setFailed(true)}
    />
  );
}

export default function LinkTypeIcon({ url }) {
  const host = hostnameOf(url || "");
  const path = (() => {
    try {
      return new URL(url).pathname;
    } catch {
      return "";
    }
  })();

  if (/(^|\.)wikipedia\.org$/.test(host)) return <WikipediaIcon />;
  if (host === "youtu.be" || /(^|\.)youtube\.com$/.test(host)) {
    return <YouTubeIcon />;
  }
  if (host === "substack.com" || host.endsWith(".substack.com")) {
    return <SubstackIcon />;
  }
  if (host === "github.com") return <GitHubIcon />;
  if (host === "twitter.com" || host === "x.com") return <XIcon />;
  if (host === "arxiv.org") return <ArxivIcon />;
  if (/\.pdf$/i.test(path) || /\.pdf(\?|#|$)/i.test(url || "")) {
    return <PdfIcon />;
  }
  return <FaviconIcon host={host} />;
}
