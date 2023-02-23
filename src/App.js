import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import Nav from "./components/Nav";
import AboutMe from "./components/AboutMe";
import Writing from "./components/Writing";
import Projects from "./components/Projects";
import Library from "./components/Library";
function App() {
  useEffect(() => {
    document.title = "Aryan Naik";
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Nav />} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/projects" element={<Projects />}></Route>
          <Route path="/library" element={<Library />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
