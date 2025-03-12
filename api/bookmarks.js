// Helper function to wait between retries
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Default response when everything fails
const DEFAULT_RESPONSE = {
  bookmarks: [],
  lastUpdated: new Date().toISOString(),
  success: false,
  error: 'Unable to fetch bookmarks'
};

// Fetch with a simple timeout
async function fetchWithTimeout(url, options, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Attempt to fetch with multiple retries and increasing timeouts
async function fetchWithRetries(url, options) {
  // Array of timeout values in milliseconds, increasing with each retry
  const timeouts = [3000, 5000, 8000];
  let lastError;

  for (let i = 0; i < timeouts.length; i++) {
    try {
      console.log(`Attempt ${i + 1} with timeout ${timeouts[i]}ms`);
      const response = await fetchWithTimeout(url, options, timeouts[i]);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error.message);
      lastError = error;
      
      // If it's not a timeout error, no point in retrying with longer timeout
      if (error.name !== 'AbortError') {
        break;
      }
      
      // Wait before next retry
      if (i < timeouts.length - 1) {
        await wait(500); // Small delay between retries
      }
    }
  }
  
  throw lastError;
}

// Process bookmarks data
function processBookmarks(data) {
  const bookmarks = data.userSaved || [];
  
  return bookmarks.map(bookmark => {
    // Check if the bookmark has highlights with comments
    if (bookmark.highlights && bookmark.highlights.length > 0) {
      // Find the first highlight with a comment
      const highlightWithComment = bookmark.highlights.find(highlight => 
        highlight.comment && highlight.comment.text
      );
      
      if (highlightWithComment) {
        return {
          ...bookmark,
          highlightedText: highlightWithComment.highlight,
          comment: highlightWithComment.comment
        };
      }
    }
    
    return bookmark;
  });
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const CURIUS_API = 'https://curius.app/api/users/2138/links?page=0';
  
  try {
    // Try to fetch with multiple retries
    const response = await fetchWithRetries(
      CURIUS_API, 
      {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );
    
    const data = await response.json();
    const bookmarksWithComments = processBookmarks(data);
    
    // Set caching headers for successful response (30 minutes fresh, 24 hours stale)
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400');
    
    // Return successful response
    return res.status(200).json({
      bookmarks: bookmarksWithComments,
      lastUpdated: new Date().toISOString(),
      success: true
    });
  } catch (error) {
    console.error('All attempts to fetch bookmarks failed:', error);
    
    // Provide a more specific error message based on the error type
    let errorMessage = 'Failed to fetch bookmarks';
    let statusCode = 500;
    
    if (error.name === 'AbortError') {
      errorMessage = 'Request timeout while fetching bookmarks';
      statusCode = 504; // Match the original error for clarity
    } else if (error.message.includes('fetch')) {
      errorMessage = 'Network error while connecting to bookmark service';
    } else if (error.message.includes('Failed to fetch:')) {
      // Extract status code if available
      const statusMatch = error.message.match(/(\d+)/);
      if (statusMatch && statusMatch[1]) {
        errorMessage = `API returned error status: ${statusMatch[1]}`;
      }
    }
    
    // Prevent caching of error responses
    res.setHeader('Cache-Control', 'no-store');
    
    // Return error response
    return res.status(statusCode).json({ 
      error: errorMessage,
      bookmarks: [],
      lastUpdated: new Date().toISOString(),
      success: false
    });
  }
}
