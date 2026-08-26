import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import LinkPopup, { hostnameOf } from "./LinkPopup";
import LinkTypeIcon from "./LinkTypeIcon";

const SHOW_DELAY_MS = 320;
const HIDE_DELAY_MS = 200;

function BookmarkItem({ bookmark, hoverId, setHover, pinnedIds, togglePin }) {
  const anchorRef = useRef(null);
  const showTimer = useRef(null);
  const hideTimer = useRef(null);
  const [anchorRect, setAnchorRect] = useState(null);
  const isHovered = hoverId === bookmark.id;
  const isPinned = pinnedIds.includes(bookmark.id);
  const host = hostnameOf(bookmark.link);

  const clearTimers = () => {
    clearTimeout(showTimer.current);
    clearTimeout(hideTimer.current);
  };

  const captureRect = () => {
    if (!anchorRef.current) return null;
    return anchorRef.current.getBoundingClientRect();
  };

  const openPreview = () => {
    const rect = captureRect();
    if (!rect) return;
    setAnchorRect(rect);
    setHover(bookmark.id);
  };

  const scheduleOpen = () => {
    if (isPinned) return;
    clearTimeout(hideTimer.current);
    showTimer.current = setTimeout(openPreview, SHOW_DELAY_MS);
  };

  const scheduleClose = () => {
    clearTimeout(showTimer.current);
    hideTimer.current = setTimeout(() => {
      setHover((current) => (current === bookmark.id ? null : current));
    }, HIDE_DELAY_MS);
  };

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    if (!isHovered && !isPinned) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") {
        setHover(null);
      }
    };
    const onViewportChange = () => {
      if (isHovered && !isPinned) setHover(null);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onViewportChange, true);
    window.addEventListener("resize", onViewportChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onViewportChange, true);
      window.removeEventListener("resize", onViewportChange);
    };
  }, [isHovered, isPinned, setHover]);

  return (
    <li
      className="mb-3"
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
    >
      <LinkTypeIcon url={bookmark.link} />
      <a
        ref={anchorRef}
        href={bookmark.link}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
        onFocus={scheduleOpen}
        onBlur={scheduleClose}
      >
        {bookmark.title || "Untitled"}
      </a>
      {host ? (
        <span className="ml-2 text-xs text-gray-400">{host}</span>
      ) : null}

      {bookmark.snippet && (
        <p className="bookmark-item-body text-sm text-gray-600 mt-1">
          {bookmark.snippet}
        </p>
      )}
      {bookmark.highlightedText && bookmark.comment && (
        <div className="bookmark-item-body mt-1 border-l-2 border-blue-300 pl-2">
          <p className="text-sm text-gray-700">"{bookmark.highlightedText}"</p>
          <p className="text-sm text-blue-500 italic">
            Comment: "{bookmark.comment.text}"
          </p>
        </div>
      )}

      {(isHovered || isPinned) && anchorRect && (
        <LinkPopup
          bookmark={bookmark}
          anchorRect={anchorRect}
          pinned={isPinned}
          onPin={() => togglePin(bookmark.id)}
          onClose={() => {
            if (isPinned) togglePin(bookmark.id);
            setHover((current) => (current === bookmark.id ? null : current));
          }}
          onMouseEnter={() => {
            clearTimeout(hideTimer.current);
            if (!isPinned) setHover(bookmark.id);
          }}
          onMouseLeave={scheduleClose}
        />
      )}
    </li>
  );
}

export default function Bookmarks() {
  const [bookmarksData, setBookmarksData] = useState({
    bookmarks: [],
    lastUpdated: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoverId, setHoverId] = useState(null);
  const [pinnedIds, setPinnedIds] = useState([]);

  useEffect(() => {
    fetch("/api/bookmarks")
      .then((res) => res.json())
      .then((data) => {
        if (data.success === false) {
          setError(data.error || "Failed to load bookmarks");
          setBookmarksData({ bookmarks: [], lastUpdated: data.lastUpdated });
        } else {
          setBookmarksData(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bookmarks:", err);
        setError("Failed to load bookmarks");
        setLoading(false);
      });
  }, []);

  const togglePin = (id) => {
    setPinnedIds((current) =>
      current.includes(id)
        ? current.filter((pinnedId) => pinnedId !== id)
        : [...current, id]
    );
  };

  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      setHoverId(null);
      setPinnedIds([]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (loading) return <div className="text-center">Loading bookmarks...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const { bookmarks, lastUpdated } = bookmarksData;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <Link to="/" className="ml-5">
          ⏮️
        </Link>
        <h2 className="text-xl text-center flex-1">Links</h2>
        <div className="w-8"></div>
      </div>
      <div className="p-4 mb-4 text-center rounded">
        <span>
          Enjoy curated links? Check out&nbsp;
          <a
            href="https://aryanlinks.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold"
          >
            Aryan's Links
          </a>
          !
        </span>
      </div>
      {bookmarks.length === 0 ? (
        <p className="text-center text-gray-500">
          No bookmarks available at the moment.
        </p>
      ) : (
        <ul className="text-left pl-5 pr-5 text-md">
          {bookmarks.map((bookmark) => (
            <BookmarkItem
              key={bookmark.id}
              bookmark={bookmark}
              hoverId={hoverId}
              setHover={setHoverId}
              pinnedIds={pinnedIds}
              togglePin={togglePin}
            />
          ))}
        </ul>
      )}
      <p className="text-xs text-gray-500 text-center mt-4">
        Last updated: {new Date(lastUpdated).toLocaleString()}
        {bookmarksData.fromCache && (
          <span className="ml-1">(Cached version)</span>
        )}
      </p>
    </div>
  );
}
