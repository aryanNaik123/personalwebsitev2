import React, { useState, useEffect } from "react";

const SHELF_LABELS = {
  "currently-reading": "Currently Reading",
  "read": "Read",
  "to-read": "Want to Read",
};

const SHELF_ORDER = ["currently-reading", "read", "to-read"];
const MAX_BOOKS = 5;

function StarRating({ rating }) {
  if (!rating || rating === 0) return null;
  return (
    <span className="text-xs tracking-wide ml-1" style={{ color: "#c9a96e" }}>
      {"★".repeat(rating)}
    </span>
  );
}

function BookItem({ book, showRating }) {
  return (
    <li className="mb-2">
      <a
        href={book.link}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        <span className="italic">{book.title}</span>
      </a>
      <span className="text-sm text-gray-400">{" — "}{book.author}</span>
      {showRating && <StarRating rating={book.rating} />}
    </li>
  );
}

function ShelfSection({ shelfKey, books }) {
  if (!books || books.length === 0) return null;

  const displayed = books.slice(0, MAX_BOOKS);

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
        {SHELF_LABELS[shelfKey]}
      </h3>
      <ul className="text-left text-md pl-1">
        {displayed.map((book) => (
          <BookItem
            key={book.bookId || book.title}
            book={book}
            showRating={shelfKey === "read"}
          />
        ))}
      </ul>
    </div>
  );
}

export default function Bookshelf() {
  const [shelves, setShelves] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => {
        if (data.success === false) {
          setError(data.error || "Failed to load books");
        } else {
          setShelves(data.shelves);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
        setError("Failed to load books");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center">Loading bookshelf...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const totalBooks = SHELF_ORDER.reduce((sum, s) => sum + (shelves[s]?.length || 0), 0);

  return (
    <div className="px-5">
      <h2 className="text-xl text-center mb-4">Books</h2>
      {SHELF_ORDER.map((shelf) => (
        <ShelfSection key={shelf} shelfKey={shelf} books={shelves[shelf]} />
      ))}
      <p className="text-xs text-gray-400 text-center mt-2">
        <a
          href="https://www.goodreads.com/user/show/169945300"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {totalBooks} books on Goodreads
        </a>
      </p>
    </div>
  );
}
