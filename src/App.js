import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav";
import AboutMe from "./components/AboutMe";
import Writing from "./components/Writing";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Nav />} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/writing" element={<Writing />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
