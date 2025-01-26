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
    const response = await fetch(CURIUS_API, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const data = await response.json();
    
    return res.status(200).json({
      bookmarks: data.userSaved || [],
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
