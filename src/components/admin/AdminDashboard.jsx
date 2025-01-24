import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getBlogPosts,
  getBookNotes,
  deleteBlogPost,
  deleteBookNote
} from '../../utils/fileOperations';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('blog');
  const [blogPosts, setBlogPosts] = useState([]);
  const [bookNotes, setBookNotes] = useState([]);
  const navigate = useNavigate();

  const loadContent = () => {
    try {
      setBlogPosts(getBlogPosts());
      setBookNotes(getBookNotes());
    } catch (error) {
      console.error('Error loading content:', error);
      alert('Error loading content');
    }
  };

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }

    loadContent();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('blog')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'blog'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Blog Posts
            </button>
            <button
              onClick={() => setActiveTab('books')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'books'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Book Notes
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-end mb-4">
            <Link
              to={activeTab === 'blog' ? '/admin/blog/new' : '/admin/book/new'}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Add New {activeTab === 'blog' ? 'Blog Post' : 'Book Note'}
            </Link>
          </div>

          {/* List */}
          <div className="space-y-4">
            {(activeTab === 'blog' ? blogPosts : bookNotes).map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.title}
                  </h3>
                  {activeTab === 'books' && (
                    <p className="text-sm text-gray-500">by {item.author}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/admin/${activeTab === 'blog' ? 'blog' : 'book'}/edit/${index}`}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this item?')) {
                        try {
                          if (activeTab === 'blog') {
                            deleteBlogPost(index);
                          } else {
                            deleteBookNote(index);
                          }
                          loadContent(); // Reload content after deletion
                        } catch (error) {
                          console.error('Error deleting item:', error);
                          alert('Error deleting item');
                        }
                      }
                    }}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
