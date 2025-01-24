// Initial data from JSON files
const initialBlogData = require('../blog.json');
const initialBookData = require('../books.json');

// Function to get default data for a key
function getDefaultData(key) {
  return key === 'blogPosts' ? initialBlogData : initialBookData;
}

// Function to read from localStorage with better error handling
function readData(key) {
  console.log(`Reading data for key: ${key}`);
  try {
    // Try to get existing data
    const storedData = localStorage.getItem(key);
    if (storedData) {
      try {
        // Try to parse existing data
        const parsedData = JSON.parse(storedData);
        console.log(`Successfully read existing data for ${key}:`, parsedData);
        return parsedData;
      } catch (parseError) {
        console.error(`Error parsing data for ${key}:`, parseError);
      }
    }

    // If we get here, either there was no data or it was invalid
    console.log(`Using default data for ${key}`);
    const defaultData = getDefaultData(key);
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  } catch (error) {
    console.error(`Error accessing localStorage for ${key}:`, error);
    return getDefaultData(key);
  }
}

// Function to write to localStorage and dispatch event
function writeData(key, data) {
  console.log(`Writing data for key: ${key}`, data);
  try {
    // Stringify data
    const jsonData = JSON.stringify(data);
    
    // Write to localStorage
    localStorage.setItem(key, jsonData);
    console.log(`Successfully wrote data for ${key}`);
    
    // Dispatch events for real-time updates
    try {
      // Custom event for same-window updates
      window.dispatchEvent(new CustomEvent('storageChange', {
        detail: { key, newValue: jsonData }
      }));
      
      // Storage event for cross-window updates
      window.dispatchEvent(new StorageEvent('storage', {
        key: key,
        newValue: jsonData,
        storageArea: localStorage
      }));
      
      console.log('Storage events dispatched successfully');
    } catch (eventError) {
      console.error('Error dispatching events:', eventError);
      // Continue even if event dispatch fails
    }
  } catch (error) {
    console.error(`Error writing ${key}:`, error);
    throw error;
  }
}

// Function to get blog posts
export function getBlogPosts() {
  const data = readData('blogPosts');
  return data.blogs;
}

// Function to get book notes
export function getBookNotes() {
  const data = readData('bookNotes');
  return data.books;
}

// Function to add blog post
export function addBlogPost(post) {
  const data = readData('blogPosts');
  data.blogs.push(post);
  writeData('blogPosts', data);
}

// Function to add book note
export function addBookNote(book) {
  const data = readData('bookNotes');
  data.books.push(book);
  writeData('bookNotes', data);
}

// Function to update blog post
export function updateBlogPost(index, post) {
  const data = readData('blogPosts');
  data.blogs[index] = post;
  writeData('blogPosts', data);
}

// Function to update book note
export function updateBookNote(index, book) {
  const data = readData('bookNotes');
  data.books[index] = book;
  writeData('bookNotes', data);
}

// Function to delete blog post
export function deleteBlogPost(index) {
  const data = readData('blogPosts');
  data.blogs.splice(index, 1);
  writeData('blogPosts', data);
}

// Function to delete book note
export function deleteBookNote(index) {
  const data = readData('bookNotes');
  data.books.splice(index, 1);
  writeData('bookNotes', data);
}

// Function to reset to initial data (useful for testing)
export function resetToInitialData() {
  writeData('blogPosts', initialBlogData);
  writeData('bookNotes', initialBookData);
}
