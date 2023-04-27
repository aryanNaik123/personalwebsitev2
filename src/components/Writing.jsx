import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import Post from "./Post";

export default function Writing() {
  const blog = require("../blog.json");
  console.log(blog.blogs);
  return (
    <>
      <div>
        <Link to="/" className="ml-5 mt-3 float-left">
          ⏮️
        </Link>
        <div className="pt-10 pl-3 text-left">
          <Routes>
            <Route
              path="/*"
              element={
                <>
                  <h1>Blog Posts</h1>
                  <ul>
                    {blog.blogs.map((blog) => (
                      <li key={blog.id}>
                        <Link to={`/${blog.title.replace(/\s+/g, "-")}`}>
                          {blog.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Routes>
                    {blog.blogs.map((blog) => (
                      <Route
                        key={blog.id}
                        path={`/${blog.title.replace(/\s+/g, "-")}`}
                        element={<Post title={blog.title} />}
                      />
                    ))}
                  </Routes>
                </>
              }
            />
          </Routes>
        </div>
      </div>
    </>
  );
}
