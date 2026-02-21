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

// Component for redirecting to external URLs
const ExternalRedirect = ({ to }) => {
  useEffect(() => {
    window.location.href = to;
  }, [to]);
  
  return <div>Redirecting...</div>;
};

function App() {
  useEffect(() => {
    document.title = "Aryan Naik";
  }, []);

  return (
    <div className="App">
      <Analytics />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><Nav /><DvdLogo /></>} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/writing/*" element={<Writing />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/library" element={<Library />} />
          <Route path="/links" element={<Bookmarks />} />
          <Route 
            path="/links-4" 
            element={<ExternalRedirect to="https://aryanlinks.substack.com/p/aryan-links-issue-no-4" />} 
          />
          <Route 
            path="/links-5" 
            element={<ExternalRedirect to="https://aryanlinks.substack.com/p/aryan-links-issue-no-5" />} 
          />
          <Route 
            path="/links-6" 
            element={<ExternalRedirect to="https://aryanlinks.substack.com/p/aryan-links-issue-no-6" />} 
          />
          <Route 
            path="/links-7" 
            element={<ExternalRedirect to="https://aryanlinks.substack.com/p/aryan-links-issue-no-7" />} 
          />
          <Route 
            path="/links-11" 
            element={<ExternalRedirect to="https://aryanlinks.substack.com/p/aryan-links-issue-no-11" />} 
          />
          <Route 
            path="/links-14" 
            element={<ExternalRedirect to="https://aryanlinks.substack.com/p/aryan-links-issue-no-14" />} 
          />
          <Route 
            path="/links-15" 
            element={<ExternalRedirect to="https://aryanlinks.substack.com/p/aryan-links-issue-no-15" />} 
          />
          <Route 
            path="/links-16" 
            element={<ExternalRedirect to="https://aryanlinks.substack.com/p/aryan-links-issue-no-16" />} 
          />
          <Route 
            path="/links-17" 
            element={<ExternalRedirect to="https://aryanlinks.substack.com/p/aryan-links-issue-no-17" />} 
          />
          <Route 
            path="/links-18" 
            element={<ExternalRedirect to="https://aryanlinks.substack.com/p/aryan-links-issue-no-18" />} 
          />
          
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
