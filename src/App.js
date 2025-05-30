import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react"
import { inject } from '@vercel/analytics';
import "./App.css";
import Nav from "./components/Nav";
import DvdLogo from "./components/DvdLogo";
import AboutMe from "./components/AboutMe";
import Writing from "./components/Writing";
import Projects from "./components/Projects";
import Library from "./components/Library";
import Bookmarks from "./components/Bookmarks";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import PostEditor from "./components/admin/PostEditor";
import ProtectedRoute from "./components/admin/ProtectedRoute";

inject()
function App() {
  useEffect(() => {
    document.title = "Aryan Naik";
  }, []);

  return (
    <div className="App">
      <Analytics />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><Nav /><DvdLogo /><div className="fixed bottom-4 w-full text-center text-sm text-gray-500">Made with ❤️ in NYC</div></>} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/writing/*" element={<Writing />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/library" element={<Library />} />
          <Route path="/links" element={<Bookmarks />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blog/new"
            element={
              <ProtectedRoute>
                <PostEditor type="blog" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blog/edit/:id"
            element={
              <ProtectedRoute>
                <PostEditor type="blog" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/book/new"
            element={
              <ProtectedRoute>
                <PostEditor type="book" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/book/edit/:id"
            element={
              <ProtectedRoute>
                <PostEditor type="book" />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
