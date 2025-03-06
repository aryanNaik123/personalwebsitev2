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
    // Fetch bookmarks from Curius API
    const response = await fetch(CURIUS_API, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const data = await response.json();
    const bookmarks = data.userSaved || [];
    
    // Process bookmarks to extract comments from highlights
    const bookmarksWithComments = bookmarks.map(bookmark => {
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
    
    return res.status(200).json({
      bookmarks: bookmarksWithComments,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch bookmarks',
      bookmarks: [],
      lastUpdated: new Date().toISOString()
    });
  }
}
