import React, { useState, useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Post from "./Post";
import { getBlogPosts, getBookNotes } from "../utils/fileOperations";

export default function Writing() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [bookNotes, setBookNotes] = useState([]);
  const location = useLocation();

  // Initialize content on mount
  useEffect(() => {
    console.log('Initializing content...');
    const blogs = getBlogPosts();
    const books = getBookNotes();
    console.log('Initial blogs:', blogs);
    console.log('Initial books:', books);
    setBlogPosts(blogs);
    setBookNotes(books);
  }, []); // Only run once on mount

  // Handle storage events for updates
  useEffect(() => {
    const handleStorageChange = (e) => {
      console.log('Storage event received:', e);
      
      // Handle custom storageChange event
      if (e.type === 'storageChange') {
        const { key } = e.detail;
        if (key === 'blogPosts') {
          console.log('Updating blog posts from storage event');
          setBlogPosts(getBlogPosts());
        } else if (key === 'bookNotes') {
          console.log('Updating book notes from storage event');
          setBookNotes(getBookNotes());
        }
      }
      // Handle standard storage event
      else if (e.type === 'storage') {
        if (e.key === 'blogPosts') {
          console.log('Updating blog posts from storage event');
          setBlogPosts(getBlogPosts());
        } else if (e.key === 'bookNotes') {
          console.log('Updating book notes from storage event');
          setBookNotes(getBookNotes());
        }
      }
    };

    // Listen for both custom and standard storage events
    window.addEventListener('storageChange', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storageChange', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // No dependencies needed since we're using closure over state setters

  return (
    <>
      <div>
        <Link to="/" className="ml-5 mt-3 float-left">
          ⏮️
        </Link>
        <div className="pt-10 pl-3 text-left">
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
