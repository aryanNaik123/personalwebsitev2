import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Bookmarks() {
  const [bookmarksData, setBookmarksData] = useState({ bookmarks: [], lastUpdated: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/bookmarks')
      .then(res => res.json())
      .then(data => {
        setBookmarksData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching bookmarks:', err);
        setError('Failed to load bookmarks');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center">Loading bookmarks...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const { bookmarks, lastUpdated } = bookmarksData;
  
  return (
    <div className="mb-8">
      <Link to="/" className="ml-5 mt-3 float-left">
        ⏮️
      </Link>
      <h2 className="text-xl text-center mb-4">Links</h2>
      <ul className="text-left pl-5 text-md">
        {bookmarks.map((bookmark) => (
          <li key={bookmark.id} className="mb-3">
            <a 
              href={bookmark.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {bookmark.title || 'Untitled'}
            </a>
            {bookmark.snippet && (
              <p className="text-sm text-gray-600 mt-1">{bookmark.snippet}</p>
            )}
            {bookmark.highlightedText && bookmark.comment && (
              <div className="mt-1 border-l-2 border-blue-300 pl-2">
                <p className="text-sm text-gray-700">"{bookmark.highlightedText}"</p>
                <p className="text-sm text-blue-500 italic">
                  Comment: "{bookmark.comment.text}"
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-500 text-center mt-4">
        Last updated: {new Date(lastUpdated).toLocaleString()}
      </p>
    </div>
  );
}
