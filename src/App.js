import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import Nav from "./components/Nav";
import DvdLogo from "./components/DvdLogo";
import AboutMe from "./components/AboutMe";
import Writing from "./components/Writing";
import Projects from "./components/Projects";
import Library from "./components/Library";
import Post from "./components/Post";
import blogData from "./blog.json";

function App() {
  useEffect(() => {
    document.title = "Aryan Naik";
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><Nav /><DvdLogo /></>} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/library" element={<Library />} />
          {blogData.blogs.map((blog) => (
            <Route
              key={blog.id}
              path={`/${blog.title.replace(/\s+/g, "-")}`}
              element={<Post title={blog.title} content={blog.content} />}
            />
          ))}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
