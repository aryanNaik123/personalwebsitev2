import React, { useState, useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Post from "./Post";
import { getBlogPosts, getBookNotes } from "../utils/fileOperations";

export default function Writing() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [bookNotes, setBookNotes] = useState([]);
  const location = useLocation();

  // Function to refresh data
  const refreshData = () => {
    const blogs = getBlogPosts();
    const books = getBookNotes();
    setBlogPosts(blogs);
    setBookNotes(books);
  };

  // Initialize content on mount and set up storage listeners
  useEffect(() => {
    refreshData();

    // Listen for storage changes
    const handleStorageChange = (event) => {
      if (event.detail?.key === 'books' || event.key === 'books') {
        refreshData();
      }
    };

    // Add event listeners
    window.addEventListener('storageChange', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('storageChange', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Only run once on mount

  // Determine if we're on the main writing page or viewing a post
  const isMainWritingPage = location.pathname === '/writing' || location.pathname === '/writing/';

  return (
    <>
      <div>
        <Link 
          to={isMainWritingPage ? "/" : "/writing"} 
          className="ml-5 mt-3 float-left"
        >
          ⏮️
        </Link>
        <div className="pt-10 pl-3 pr-4 sm:pr-6 md:pr-8 lg:pr-12 text-left">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div>
                    <h1 className="text-xl">Blog Posts</h1>
                    <ul>
                      {blogPosts.map((blog, index) => (
                        <li key={index}>
                          <Link
                            className="text-lg hover:text-blue-400 italic"
                            to={`blog/${blog.title.replace(/\s+/g, "-")}`}
                          >
                            {"> " + blog.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-8">
                    <h1 className="text-xl">Book Notes</h1>
                    <ul>
                      {bookNotes.map((book, index) => (
                        <li key={index}>
                          <Link
                            className="text-lg hover:text-blue-400 italic"
                            to={`book/${book.title.replace(/\s+/g, "-")}`}
                          >
                            {"> " + book.title + " by " + book.author}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              }
            />
            {blogPosts.map((blog, index) => (
              <Route
                key={index}
                path={`blog/${blog.title.replace(/\s+/g, "-")}`}
                element={<Post title={blog.title} content={blog.content} />}
              />
            ))}
            {bookNotes.map((book, index) => (
              <Route
                key={`book-${index}`}
                path={`book/${book.title.replace(/\s+/g, "-")}`}
                element={<Post title={`${book.title} by ${book.author}`} content={book.content} />}
              />
            ))}
          </Routes>
        </div>
      </div>
    </>
  );
}
