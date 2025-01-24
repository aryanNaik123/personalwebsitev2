import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { marked } from 'marked';
import {
  getBlogPosts,
  getBookNotes,
  addBlogPost,
  addBookNote,
  updateBlogPost,
  updateBookNote
} from '../../utils/fileOperations';

export default function PostEditor({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewPost = !id;
  const isBook = type === 'book';

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    ...(isBook && { author: '' }),
  });
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }

    // Load existing content if editing
    if (!isNewPost) {
      try {
        const items = isBook ? getBookNotes() : getBlogPosts();
        if (items[id]) {
          setFormData(items[id]);
        }
      } catch (error) {
        console.error('Error loading content:', error);
        alert('Error loading content');
        navigate('/admin/dashboard');
      }
    }
  }, [isNewPost, isBook, id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isNewPost) {
        if (isBook) {
          addBookNote(formData);
        } else {
          addBlogPost(formData);
        }
      } else {
        if (isBook) {
          updateBookNote(parseInt(id), formData);
        } else {
          updateBlogPost(parseInt(id), formData);
        }
      }
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving changes');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isNewPost ? 'Create New' : 'Edit'} {isBook ? 'Book Note' : 'Blog Post'}
          </h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {isBook && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Author
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <button
                  type="button"
                  onClick={() => setPreview(!preview)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {preview ? 'Edit' : 'Preview'}
                </button>
              </div>
              
              {preview ? (
                <div
                  className="prose max-w-none p-4 border rounded-md bg-gray-50"
                  dangerouslySetInnerHTML={{
                    __html: marked(formData.content || '')
                  }}
                />
              ) : (
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="12"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
